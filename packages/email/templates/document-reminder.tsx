import { RecipientRole } from '@prisma/client';

import { EmailLayout } from '../template-components/email-primitives';
import { TemplateCustomMessageBody } from '../template-components/template-custom-message-body';
import { TemplateDocumentReminder } from '../template-components/template-document-reminder';

export type DocumentReminderEmailTemplateProps = {
  recipientName: string;
  documentName: string;
  signDocumentLink: string;
  assetBaseUrl?: string;
  customBody?: string;
  role: RecipientRole;
  reportUrl?: string;
  inviterName?: string;
};

export const DocumentReminderEmailTemplate = ({
  recipientName = 'John Doe',
  documentName = 'Open Source Pledge.pdf',
  signDocumentLink = 'https://documenso.com',
  assetBaseUrl = 'http://localhost:3002',
  customBody,
  role = RecipientRole.SIGNER,
  reportUrl,
  inviterName = 'Lucas Smith',
}: DocumentReminderEmailTemplateProps) => {
  return (
    <EmailLayout
      assetBaseUrl={assetBaseUrl}
      reportUrl={reportUrl}
      secondaryContent={customBody && <TemplateCustomMessageBody text={customBody} />}
    >
      <TemplateDocumentReminder
        recipientName={recipientName}
        documentName={documentName}
        signDocumentLink={signDocumentLink}
        assetBaseUrl={assetBaseUrl}
        role={role}
        inviterName={inviterName}
      />
    </EmailLayout>
  );
};

export default DocumentReminderEmailTemplate;
