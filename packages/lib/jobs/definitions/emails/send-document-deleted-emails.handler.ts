import DocumentCancelTemplate from '@documenso/email/templates/document-cancel';
import { prisma } from '@documenso/prisma';
import { msg } from '@lingui/core/macro';
import { OrganisationType } from '@prisma/client';
import { createElement } from 'react';

import { getI18nInstance } from '../../../client-only/providers/i18n-server';
import { NEXT_PUBLIC_WEBAPP_URL } from '../../../constants/app';
import { getEmailContext } from '../../../server-only/email/get-email-context';
import { trimEmailTitle } from '../../../utils/email-subject';
import { isRecipientEmailValidForSending } from '../../../utils/recipients';
import { renderEmailWithI18N } from '../../../utils/render-email-with-i18n';
import type { JobRunIO } from '../../client/_internal/job';
import type { TSendDocumentDeletedEmailsJobDefinition } from './send-document-deleted-emails';

export const run = async ({ payload, io }: { payload: TSendDocumentDeletedEmailsJobDefinition; io: JobRunIO }) => {
  const { teamId, documentName, inviterName, inviterEmail, meta, recipients } = payload;

  if (recipients.length === 0) {
    return;
  }

  const { branding, emailLanguage, organisationType, senderEmail, replyToEmail, emailsDisabled, emailTransport } =
    await getEmailContext({
      emailType: 'RECIPIENT',
      source: {
        type: 'team',
        teamId,
      },
      meta,
    });

  // Don't send cancellation emails if the organisation has email sending
  // disabled. Re-checked here (not just at enqueue time) because the org can be
  // disabled between the delete request and this job running.
  if (emailsDisabled) {
    return;
  }

  const assetBaseUrl = NEXT_PUBLIC_WEBAPP_URL() || 'http://localhost:3000';
  const i18n = await getI18nInstance(emailLanguage);
  const title = trimEmailTitle(documentName);

  // Customer-facing sender identity: the team when the document went out
  // through an organisation, otherwise the personal name from the payload.
  // The envelope is hard-deleted before this job runs, so the team is looked
  // up directly.
  const team =
    organisationType === OrganisationType.ORGANISATION
      ? await prisma.team.findFirst({
          where: { id: teamId },
          select: { name: true },
        })
      : null;

  const senderName = team?.name || inviterName || undefined;

  for (const recipient of recipients) {
    await io.runTask(`send-document-deleted-emails-${recipient.email}`, async () => {
      if (!isRecipientEmailValidForSending(recipient)) {
        return;
      }

      const template = createElement(DocumentCancelTemplate, {
        documentName,
        inviterName: senderName,
        inviterEmail,
        assetBaseUrl,
      });

      const [html, text] = await Promise.all([
        renderEmailWithI18N(template, { lang: emailLanguage, branding }),
        renderEmailWithI18N(template, { lang: emailLanguage, branding, plainText: true }),
      ]);

      await emailTransport.sendMail({
        to: {
          address: recipient.email,
          name: recipient.name,
        },
        from: senderEmail,
        replyTo: replyToEmail,
        subject: i18n._(msg`Document cancelled: ${title}`),
        html,
        text,
      });
    });
  }
};
