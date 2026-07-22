import { Trans } from '@lingui/react/macro';

import { EmailBodyText, EmailButton, EmailButtonSection, EmailHeading } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export type TemplateForgotPasswordProps = {
  resetPasswordLink: string;
  assetBaseUrl: string;
};

export const TemplateForgotPassword = ({ resetPasswordLink, assetBaseUrl }: TemplateForgotPasswordProps) => {
  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        <Trans>No problem, let's reset it</Trans>
      </EmailHeading>

      <EmailBodyText>
        <Trans>That's okay, it happens! Click the button below to reset your password.</Trans>
      </EmailBodyText>

      <EmailButtonSection>
        <EmailButton href={resetPasswordLink}>
          <Trans>Reset Password</Trans>
        </EmailButton>
      </EmailButtonSection>
    </>
  );
};

export default TemplateForgotPassword;
