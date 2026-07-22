import { RECIPIENT_ROLES_DESCRIPTION } from '@documenso/lib/constants/recipient-roles';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { RecipientRole } from '@prisma/client';

import { EmailBodyText, EmailLayout } from '../template-components/email-primitives';
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
  const { _ } = useLingui();

  const action = _(RECIPIENT_ROLES_DESCRIPTION[role].actionVerb).toLowerCase();

  const previewText = msg`Reminder to ${action} ${documentName}`;

  return (
    <EmailLayout
      assetBaseUrl={assetBaseUrl}
      preview={_(previewText)}
      reportUrl={reportUrl}
      secondaryContent={
        customBody && (
          <EmailBodyText align="left" fullWidth>
            <TemplateCustomMessageBody text={customBody} />
          </EmailBodyText>
        )
      }
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
