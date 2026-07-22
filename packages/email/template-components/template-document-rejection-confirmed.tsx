import { Trans } from '@lingui/react/macro';

import { EmailBodyText, EmailCallout, EmailHeading } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

interface TemplateDocumentRejectionConfirmedProps {
  recipientName: string;
  documentName: string;
  documentOwnerName: string;
  reason?: string;
  assetBaseUrl?: string;
}

export function TemplateDocumentRejectionConfirmed({
  recipientName,
  documentName,
  documentOwnerName,
  reason,
  assetBaseUrl = 'http://localhost:3002',
}: TemplateDocumentRejectionConfirmedProps) {
  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        <Trans>Rejection Confirmed</Trans>
      </EmailHeading>

      <EmailBodyText>
        <Trans>
          This email confirms that you have rejected the document{' '}
          <span className="font-semibold">"{documentName}"</span> sent by {documentOwnerName}.
        </Trans>
      </EmailBodyText>

      {reason && (
        <EmailCallout>
          <Trans>Rejection reason: {reason}</Trans>
        </EmailCallout>
      )}
    </>
  );
}
