import { Trans } from '@lingui/react/macro';

import { EmailBodyText, EmailHeading, EmailLayout } from '../template-components/email-primitives';
import TemplateDocumentImage from '../template-components/template-document-image';

export type DocumentCcReminderNotificationEmailTemplateProps = {
  documentName?: string;
  recipientName?: string;
  assetBaseUrl?: string;
  reportUrl?: string;
};

/**
 * Sent to CC-role recipients whenever a signing reminder (scheduled or manual)
 * goes out to another recipient. CC recipients must never receive the reminder
 * email itself — it contains the recipient's signing token — so, like
 * `DocumentCcNotificationEmailTemplate`, this is purely informational with no
 * button/CTA.
 */
export const DocumentCcReminderNotificationEmailTemplate = ({
  documentName = 'Open Source Pledge.pdf',
  recipientName = 'John Doe',
  assetBaseUrl = 'http://localhost:3002',
  reportUrl,
}: DocumentCcReminderNotificationEmailTemplateProps) => {
  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} reportUrl={reportUrl}>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        <Trans>
          A reminder for "{documentName}" has been sent to {recipientName}
        </Trans>
      </EmailHeading>

      <EmailBodyText>
        <Trans>You'll be notified as soon as the document has been signed.</Trans>
      </EmailBodyText>
    </EmailLayout>
  );
};

export default DocumentCcReminderNotificationEmailTemplate;
