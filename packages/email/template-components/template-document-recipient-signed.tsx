import { Trans } from '@lingui/react/macro';

import { EmailBodyText, EmailHeading, EmailIconLabel } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentRecipientSignedProps {
  documentName: string;
  recipientName: string;
  recipientEmail: string;
  assetBaseUrl: string;
}

export const TemplateDocumentRecipientSigned = ({
  documentName,
  recipientName,
  recipientEmail,
  assetBaseUrl,
}: TemplateDocumentRecipientSignedProps) => {
  const recipientReference = recipientName || recipientEmail;
  const signerName = recipientReference;

  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailIconLabel assetBaseUrl={assetBaseUrl} icon="completed.png">
        <Trans>Signed by {signerName}</Trans>
      </EmailIconLabel>

      <EmailHeading>
        <Trans>
          {recipientReference} has signed "{documentName}"
        </Trans>
      </EmailHeading>

      <EmailBodyText>
        <Trans>{recipientReference} has completed signing the document.</Trans>
      </EmailBodyText>
    </>
  );
};

export default TemplateDocumentRecipientSigned;
