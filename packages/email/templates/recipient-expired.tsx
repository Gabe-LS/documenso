import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { EmailLayout } from '../template-components/email-primitives';
import type { TemplateRecipientExpiredProps } from '../template-components/template-recipient-expired';
import { TemplateRecipientExpired } from '../template-components/template-recipient-expired';

export type RecipientExpiredEmailTemplateProps = Partial<TemplateRecipientExpiredProps> & {
  reportUrl?: string;
};

export const RecipientExpiredTemplate = ({
  documentName = 'Open Source Pledge.pdf',
  recipientName = 'John Doe',
  recipientEmail = 'john@example.com',
  documentLink = 'https://documenso.com',
  assetBaseUrl = 'http://localhost:3002',
  reportUrl,
}: RecipientExpiredEmailTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`The signing window for "${recipientName}" on document "${documentName}" has expired.`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} reportUrl={reportUrl}>
      <TemplateRecipientExpired
        documentName={documentName}
        recipientName={recipientName}
        recipientEmail={recipientEmail}
        documentLink={documentLink}
        assetBaseUrl={assetBaseUrl}
      />
    </EmailLayout>
  );
};

export default RecipientExpiredTemplate;
