import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { EmailLayout } from '../template-components/email-primitives';
import type { TemplateDocumentPendingProps } from '../template-components/template-document-pending';
import { TemplateDocumentPending } from '../template-components/template-document-pending';

export type DocumentPendingEmailTemplateProps = Partial<TemplateDocumentPendingProps> & {
  reportUrl?: string;
};

export const DocumentPendingEmailTemplate = ({
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  reportUrl,
}: DocumentPendingEmailTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`You've signed ${documentName}, waiting for others`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} reportUrl={reportUrl}>
      <TemplateDocumentPending documentName={documentName} assetBaseUrl={assetBaseUrl} />
    </EmailLayout>
  );
};

export default DocumentPendingEmailTemplate;
