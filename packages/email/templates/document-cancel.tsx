import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { EmailLayout } from '../template-components/email-primitives';
import type { TemplateDocumentCancelProps } from '../template-components/template-document-cancel';
import { TemplateDocumentCancel } from '../template-components/template-document-cancel';

export type DocumentCancelEmailTemplateProps = Partial<TemplateDocumentCancelProps> & {
  reportUrl?: string;
};

export const DocumentCancelTemplate = ({
  inviterName = 'Lucas Smith',
  inviterEmail = 'lucas@documenso.com',
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  cancellationReason,
  // Defaults to true so the preview app shows the fullest version of the
  // email; the handler always passes an explicit value.
  hasSignatures = true,
  reportUrl,
}: DocumentCancelEmailTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`You no longer need to sign it.`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} reportUrl={reportUrl}>
      <TemplateDocumentCancel
        inviterName={inviterName}
        inviterEmail={inviterEmail}
        documentName={documentName}
        assetBaseUrl={assetBaseUrl}
        cancellationReason={cancellationReason}
        hasSignatures={hasSignatures}
      />
    </EmailLayout>
  );
};

export default DocumentCancelTemplate;
