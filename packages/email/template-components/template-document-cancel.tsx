import { Trans } from '@lingui/react/macro';

import { EmailBodyText, EmailCallout, EmailHeading } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentCancelProps {
  inviterName: string;
  inviterEmail: string;
  documentName: string;
  assetBaseUrl: string;
  cancellationReason?: string;
  /**
   * Whether any recipient had actually signed before the cancellation. When
   * nobody had, the "all signatures have been voided" line is omitted — the
   * Italian translation ("Tutte le firme apposte sul documento…") presupposes
   * signatures existed, so it asserts something false over an empty set.
   */
  hasSignatures?: boolean;
}

export const TemplateDocumentCancel = ({
  inviterName,
  documentName,
  assetBaseUrl,
  cancellationReason,
  hasSignatures,
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

      {hasSignatures && (
        <EmailBodyText>
          <Trans>All signatures have been voided.</Trans>
        </EmailBodyText>
      )}

      {cancellationReason && (
        <EmailCallout>
          <Trans>Reason for cancellation: {cancellationReason}</Trans>
        </EmailCallout>
      )}
    </>
  );
};

export default TemplateDocumentCancel;
