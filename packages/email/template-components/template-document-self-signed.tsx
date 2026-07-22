import { Trans } from '@lingui/react/macro';

import { EmailHeading } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentSelfSignedProps {
  documentName: string;
  assetBaseUrl: string;
}

export const TemplateDocumentSelfSigned = ({ documentName, assetBaseUrl }: TemplateDocumentSelfSignedProps) => {
  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        <Trans>You have signed "{documentName}"</Trans>
      </EmailHeading>
    </>
  );
};

export default TemplateDocumentSelfSigned;
