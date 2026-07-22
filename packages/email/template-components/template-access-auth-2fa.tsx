import { Plural, Trans } from '@lingui/react/macro';

import { EmailBodyText, EmailCodeBox, EmailFinePrint, EmailHeading } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export type TemplateAccessAuth2FAProps = {
  documentTitle: string;
  code: string;
  userEmail: string;
  userName: string;
  expiresInMinutes: number;
  assetBaseUrl?: string;
};

export const TemplateAccessAuth2FA = ({
  documentTitle,
  code,
  userName,
  expiresInMinutes,
  assetBaseUrl = 'http://localhost:3002',
}: TemplateAccessAuth2FAProps) => {
  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        <Trans>Verification Code Required</Trans>
      </EmailHeading>

      <EmailBodyText>
        <Trans>
          Hi {userName}, you need to enter a verification code to complete the document "{documentTitle}".
        </Trans>
      </EmailBodyText>

      <EmailCodeBox label={<Trans>Your verification code:</Trans>}>{code}</EmailCodeBox>

      <EmailFinePrint>
        <Plural
          value={expiresInMinutes}
          one="This code will expire in # minute."
          other="This code will expire in # minutes."
        />
      </EmailFinePrint>

      <EmailFinePrint>
        <Trans>If you didn't request this verification code, you can safely ignore this email.</Trans>
      </EmailFinePrint>
    </>
  );
};
