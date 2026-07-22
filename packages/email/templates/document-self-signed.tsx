import { EmailLayout } from '../template-components/email-primitives';
import type { TemplateDocumentSelfSignedProps } from '../template-components/template-document-self-signed';
import { TemplateDocumentSelfSigned } from '../template-components/template-document-self-signed';

export type DocumentSelfSignedTemplateProps = TemplateDocumentSelfSignedProps & {
  reportUrl?: string;
};

export const DocumentSelfSignedEmailTemplate = ({
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  reportUrl,
}: DocumentSelfSignedTemplateProps) => {
  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} reportUrl={reportUrl}>
      <TemplateDocumentSelfSigned documentName={documentName} assetBaseUrl={assetBaseUrl} />
    </EmailLayout>
  );
};

export default DocumentSelfSignedEmailTemplate;
