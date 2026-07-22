import { Trans } from '@lingui/react/macro';

import { EmailBodyText, EmailCallout, EmailHeading } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentCancelProps {
  inviterName: string;
  inviterEmail: string;
  documentName: string;
  assetBaseUrl: string;
  cancellationReason?: string;
}

export const TemplateDocumentCancel = ({
  inviterName,
  documentName,
  assetBaseUrl,
  cancellationReason,
}: TemplateDocumentCancelProps) => {
  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        <Trans>
          {inviterName} has cancelled the document
          <br />"{documentName}"
        </Trans>
      </EmailHeading>

      <EmailBodyText>
        <Trans>All signatures have been voided.</Trans>
      </EmailBodyText>

      {cancellationReason && (
        <EmailCallout>
          <Trans>Reason for cancellation: {cancellationReason}</Trans>
        </EmailCallout>
      )}
    </>
  );
};

export default TemplateDocumentCancel;
