import { env } from '@documenso/lib/utils/env';
import { Trans } from '@lingui/react/macro';

import { EmailBodyText, EmailButton, EmailButtonSection, EmailHeading } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateResetPasswordProps {
  assetBaseUrl: string;
}

export const TemplateResetPassword = ({ assetBaseUrl }: TemplateResetPasswordProps) => {
  const NEXT_PUBLIC_WEBAPP_URL = env('NEXT_PUBLIC_WEBAPP_URL');

  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        <Trans>Password updated!</Trans>
      </EmailHeading>

      <EmailBodyText>
        <Trans>Your password has been updated.</Trans>
      </EmailBodyText>

      <EmailButtonSection>
        <EmailButton href={`${NEXT_PUBLIC_WEBAPP_URL ?? 'http://localhost:3000'}/signin`}>
          <Trans>Sign In</Trans>
        </EmailButton>
      </EmailButtonSection>
    </>
  );
};

export default TemplateResetPassword;
