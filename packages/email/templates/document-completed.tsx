import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { EmailLayout } from '../template-components/email-primitives';
import type { TemplateDocumentCompletedProps } from '../template-components/template-document-completed';
import { TemplateDocumentCompleted } from '../template-components/template-document-completed';

export type DocumentCompletedEmailTemplateProps = Partial<TemplateDocumentCompletedProps> & {
  customBody?: string;
  reportUrl?: string;
};

export const DocumentCompletedEmailTemplate = ({
  downloadLink = 'https://documenso.com',
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  customBody,
  reportUrl,
}: DocumentCompletedEmailTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`Completed Document`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} reportUrl={reportUrl}>
      <TemplateDocumentCompleted
        downloadLink={downloadLink}
        documentName={documentName}
        assetBaseUrl={assetBaseUrl}
        customBody={customBody}
      />
    </EmailLayout>
  );
};

export default DocumentCompletedEmailTemplate;
