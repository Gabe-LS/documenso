import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { EmailLayout } from '../template-components/email-primitives';
import { TemplateDocumentRejectionConfirmed } from '../template-components/template-document-rejection-confirmed';

export type DocumentRejectionConfirmedEmailProps = {
  recipientName: string;
  documentName: string;
  documentOwnerName: string;
  reason: string;
  assetBaseUrl?: string;
  reportUrl?: string;
};

export function DocumentRejectionConfirmedEmail({
  recipientName,
  documentName,
  documentOwnerName,
  reason,
  assetBaseUrl = 'http://localhost:3002',
  reportUrl,
}: DocumentRejectionConfirmedEmailProps) {
  const { _ } = useLingui();

  const previewText = msg`Nothing else is required from you.`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} reportUrl={reportUrl}>
      <TemplateDocumentRejectionConfirmed
        recipientName={recipientName}
        documentName={documentName}
        documentOwnerName={documentOwnerName}
        reason={reason}
        assetBaseUrl={assetBaseUrl}
      />
    </EmailLayout>
  );
}

export default DocumentRejectionConfirmedEmail;
