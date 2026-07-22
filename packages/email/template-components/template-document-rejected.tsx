import { Trans } from '@lingui/react/macro';

import { EmailBodyText, EmailButton, EmailButtonSection, EmailCallout, EmailHeading } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentRejectedProps {
  documentName: string;
  recipientName: string;
  rejectionReason?: string;
  documentUrl: string;
  assetBaseUrl?: string;
}

export function TemplateDocumentRejected({
  documentName,
  recipientName: signerName,
  rejectionReason,
  documentUrl,
  assetBaseUrl = 'http://localhost:3002',
}: TemplateDocumentRejectedProps) {
  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        <Trans>Document Rejected</Trans>
      </EmailHeading>

      <EmailBodyText>
        <Trans>
          {signerName} has rejected the document "{documentName}".
        </Trans>
      </EmailBodyText>

      {rejectionReason && (
        <EmailCallout>
          <Trans>Reason for rejection: {rejectionReason}</Trans>
        </EmailCallout>
      )}

      <EmailButtonSection>
        <EmailButton href={documentUrl}>
          <Trans>View Document</Trans>
        </EmailButton>
      </EmailButtonSection>
    </>
  );
}
