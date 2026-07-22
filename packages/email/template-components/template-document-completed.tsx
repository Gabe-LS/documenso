import { Trans } from '@lingui/react/macro';

import { EmailBodyText, EmailButton, EmailButtonSection, EmailHeading, EmailIconLabel } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentCompletedProps {
  downloadLink: string;
  documentName: string;
  assetBaseUrl: string;
  customBody?: string;
}

export const TemplateDocumentCompleted = ({
  downloadLink,
  documentName,
  assetBaseUrl,
  customBody,
}: TemplateDocumentCompletedProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailIconLabel assetBaseUrl={assetBaseUrl} icon="completed.png">
        <Trans>Completed</Trans>
      </EmailIconLabel>

      <EmailHeading>{customBody || <Trans>"{documentName}" was signed by all signers</Trans>}</EmailHeading>

      <EmailBodyText>
        <Trans>Continue by downloading the document.</Trans>
      </EmailBodyText>

      <EmailButtonSection>
        <EmailButton href={downloadLink} iconSrc={getAssetUrl('/static/download.png')}>
          <Trans>Download</Trans>
        </EmailButton>
      </EmailButtonSection>
    </>
  );
};

export default TemplateDocumentCompleted;
