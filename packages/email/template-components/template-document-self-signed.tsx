import { Trans } from '@lingui/react/macro';

import { EmailHeading, EmailIconLabel } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentSelfSignedProps {
  documentName: string;
  assetBaseUrl: string;
}

export const TemplateDocumentSelfSigned = ({ documentName, assetBaseUrl }: TemplateDocumentSelfSignedProps) => {
  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailIconLabel assetBaseUrl={assetBaseUrl} icon="completed.png">
        <Trans>Completed</Trans>
      </EmailIconLabel>

      <EmailHeading>
        <Trans>You have signed "{documentName}"</Trans>
      </EmailHeading>
    </>
  );
};

export default TemplateDocumentSelfSigned;
