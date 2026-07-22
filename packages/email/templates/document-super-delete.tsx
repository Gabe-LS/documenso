import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { EmailLayout } from '../template-components/email-primitives';
import {
  TemplateDocumentDelete,
  type TemplateDocumentDeleteProps,
} from '../template-components/template-document-super-delete';

export type DocumentDeleteEmailTemplateProps = Partial<TemplateDocumentDeleteProps> & {
  reportUrl?: string;
};

export const DocumentSuperDeleteEmailTemplate = ({
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  reason = 'Unknown',
  reportUrl,
}: DocumentDeleteEmailTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`An admin has deleted your document "${documentName}".`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} reportUrl={reportUrl}>
      <TemplateDocumentDelete reason={reason} documentName={documentName} assetBaseUrl={assetBaseUrl} />
    </EmailLayout>
  );
};

export default DocumentSuperDeleteEmailTemplate;
