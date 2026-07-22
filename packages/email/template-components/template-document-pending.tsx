import { Trans } from '@lingui/react/macro';

import { EmailBodyText, EmailHeading, EmailIconLabel } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentPendingProps {
  documentName: string;
  assetBaseUrl: string;
}

export const TemplateDocumentPending = ({ documentName, assetBaseUrl }: TemplateDocumentPendingProps) => {
  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailIconLabel assetBaseUrl={assetBaseUrl} icon="clock.png">
        <Trans>Waiting for others</Trans>
      </EmailIconLabel>

      <EmailHeading>
        <Trans>"{documentName}" has been signed</Trans>
      </EmailHeading>

      <EmailBodyText>
        <Trans>
          We're still waiting for other signers to sign this document.
          <br />
          We'll notify you as soon as it's ready.
        </Trans>
      </EmailBodyText>
    </>
  );
};

export default TemplateDocumentPending;
