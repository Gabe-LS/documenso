import { Trans } from '@lingui/react/macro';

import { EmailButton, EmailButtonSection, EmailHeading } from './email-primitives';
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
  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>{customBody || <Trans>"{documentName}" was signed by all signers</Trans>}</EmailHeading>

      <EmailButtonSection>
        <EmailButton href={downloadLink}>
          <Trans>Download</Trans>
        </EmailButton>
      </EmailButtonSection>
    </>
  );
};

export default TemplateDocumentCompleted;
