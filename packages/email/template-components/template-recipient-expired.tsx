import { Trans } from '@lingui/react/macro';

import { EmailBodyText, EmailButton, EmailButtonSection, EmailHeading } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export type TemplateRecipientExpiredProps = {
  documentName: string;
  recipientName: string;
  recipientEmail: string;
  documentLink: string;
  assetBaseUrl: string;
};

export const TemplateRecipientExpired = ({
  documentName,
  recipientName,
  recipientEmail,
  documentLink,
  assetBaseUrl,
}: TemplateRecipientExpiredProps) => {
  const displayName = recipientName || recipientEmail;

  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        <Trans>
          Signing window expired for "{displayName}" on "{documentName}"
        </Trans>
      </EmailHeading>

      <EmailBodyText>
        <Trans>
          The signing window for {displayName} on document "{documentName}" has expired. You can resend the document
          to extend their deadline or cancel the document.
        </Trans>
      </EmailBodyText>

      <EmailButtonSection>
        <EmailButton href={documentLink}>
          <Trans>View Document</Trans>
        </EmailButton>
      </EmailButtonSection>
    </>
  );
};

export default TemplateRecipientExpired;
