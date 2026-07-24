import RecipientRemovedFromDocumentTemplate from '@documenso/email/templates/recipient-removed-from-document';
import { prisma } from '@documenso/prisma';
import { msg } from '@lingui/core/macro';
import { OrganisationType } from '@prisma/client';
import { createElement } from 'react';

import { getI18nInstance } from '../../../client-only/providers/i18n-server';
import { NEXT_PUBLIC_WEBAPP_URL } from '../../../constants/app';
import { getEmailContext } from '../../../server-only/email/get-email-context';
import { assertOrganisationRatesAndLimits } from '../../../server-only/rate-limit/assert-organisation-rates-and-limits';
import { extractDerivedDocumentEmailSettings } from '../../../types/document-email';
import { trimEmailTitle } from '../../../utils/email-subject';
import { isRecipientEmailValidForSending } from '../../../utils/recipients';
import { renderEmailWithI18N } from '../../../utils/render-email-with-i18n';
import type { JobRunIO } from '../../client/_internal/job';
import type { TSendRecipientRemovedEmailJobDefinition } from './send-recipient-removed-email';

export const run = async ({ payload, io }: { payload: TSendRecipientRemovedEmailJobDefinition; io: JobRunIO }) => {
  const { envelopeId, recipientEmail, recipientName, inviterName } = payload;

  const envelope = await prisma.envelope.findFirst({
    where: {
      id: envelopeId,
    },
    include: {
      documentMeta: true,
      team: {
        select: {
          name: true,
        },
      },
    },
  });

  // The envelope may have been deleted between the recipient removal and this
  // job running. Treat as a no-op so the job doesn't retry forever.
  if (!envelope || !recipientEmail || !isRecipientEmailValidForSending({ email: recipientEmail })) {
    return;
  }

  // Re-checked at send time (not just at enqueue) so the email honors the
  // document's current "recipient removed" setting.
  const isRecipientRemovedEmailEnabled = extractDerivedDocumentEmailSettings(envelope.documentMeta).recipientRemoved;

  if (!isRecipientRemovedEmailEnabled) {
    return;
  }

  const {
    branding,
    emailLanguage,
    organisationType,
    senderEmail,
    replyToEmail,
    organisationId,
    claims,
    emailsDisabled,
    emailTransport,
  } = await getEmailContext({
    emailType: 'RECIPIENT',
    source: {
      type: 'team',
      teamId: envelope.teamId,
    },
    meta: envelope.documentMeta,
  });

  // Don't send the removal email if the organisation has email sending disabled.
  if (emailsDisabled) {
    return;
  }

  // Meter the removal email against the organisation email quota/stats.
  // Add/remove churn can be used to blast unsolicited removal emails outside
  // the email limits.
  try {
    await assertOrganisationRatesAndLimits({
      organisationId,
      organisationClaim: claims,
      type: 'email',
      count: 1,
    });
  } catch (_err) {
    io.logger.warn({
      msg: 'Recipient removed email dropped: org email limit exceeded',
      organisationId,
      envelopeId: envelope.id,
    });

    return;
  }

  const assetBaseUrl = NEXT_PUBLIC_WEBAPP_URL() || 'http://localhost:3000';

  const template = createElement(RecipientRemovedFromDocumentTemplate, {
    documentName: envelope.title,
    // Customer-facing sender identity: the team when the document went out
    // through an organisation, otherwise the personal name from the payload.
    inviterName:
      organisationType === OrganisationType.ORGANISATION && envelope.team?.name
        ? envelope.team.name
        : inviterName || undefined,
    assetBaseUrl,
  });

  const i18n = await getI18nInstance(emailLanguage);

  const title = trimEmailTitle(envelope.title);

  await io.runTask('send-recipient-removed-email', async () => {
    const [html, text] = await Promise.all([
      renderEmailWithI18N(template, { lang: emailLanguage, branding }),
      renderEmailWithI18N(template, { lang: emailLanguage, branding, plainText: true }),
    ]);

    await emailTransport.sendMail({
      to: {
        address: recipientEmail,
        name: recipientName,
      },
      from: senderEmail,
      replyTo: replyToEmail,
      subject: i18n._(msg`Access removed: ${title}`),
      html,
      text,
    });
  });
};
