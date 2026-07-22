import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { EmailLayout } from '../template-components/email-primitives';
import { TemplateDocumentRejected } from '../template-components/template-document-rejected';

type DocumentRejectedEmailProps = {
  recipientName: string;
  documentName: string;
  documentUrl: string;
  rejectionReason: string;
  assetBaseUrl?: string;
  reportUrl?: string;
};

export function DocumentRejectedEmail({
  recipientName,
  documentName,
  documentUrl,
  rejectionReason,
  assetBaseUrl = 'http://localhost:3002',
  reportUrl,
}: DocumentRejectedEmailProps) {
  const { _ } = useLingui();

  const previewText = _(msg`${recipientName} has rejected the document '${documentName}'`);

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={previewText} reportUrl={reportUrl}>
      <TemplateDocumentRejected
        recipientName={recipientName}
        documentName={documentName}
        documentUrl={documentUrl}
        rejectionReason={rejectionReason}
        assetBaseUrl={assetBaseUrl}
      />
    </EmailLayout>
  );
}

export default DocumentRejectedEmail;
