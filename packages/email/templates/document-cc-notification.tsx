import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { EmailBodyText, EmailHeading, EmailLayout } from '../template-components/email-primitives';
import TemplateDocumentImage from '../template-components/template-document-image';

export type DocumentCcNotificationEmailTemplateProps = {
  inviterName?: string;
  documentName?: string;
  assetBaseUrl?: string;
  reportUrl?: string;
};

/**
 * Sent to CC-role recipients at distribution time. CC recipients cannot open
 * the document until it's fully signed, so unlike `DocumentInviteEmailTemplate`
 * this has no button/CTA — it's purely informational, mirroring the
 * no-CTA shape of `DocumentCancelTemplate`.
 */
export const DocumentCcNotificationEmailTemplate = ({
  inviterName = 'Lucas Smith',
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  reportUrl,
}: DocumentCcNotificationEmailTemplateProps) => {
  const { _ } = useLingui();

  // Deliberately not the body's own "You'll be notified as soon as the document
  // has been signed." - lingui keys on the English text, so an identical string
  // would collapse the preheader and the body into one msgid.
  const previewText = msg`We'll email you as soon as it's signed.`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} reportUrl={reportUrl}>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        <Trans>
          {inviterName} has sent "{documentName}" for signing
        </Trans>
      </EmailHeading>

      <EmailBodyText>
        <Trans>You'll be notified as soon as the document has been signed.</Trans>
      </EmailBodyText>
    </EmailLayout>
  );
};

export default DocumentCcNotificationEmailTemplate;
