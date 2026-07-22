import { Trans } from '@lingui/react/macro';

import { EmailBodyText, EmailButton, EmailButtonSection, EmailFinePrint, EmailHeading } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export type TemplateConfirmationEmailProps = {
  confirmationLink: string;
  assetBaseUrl: string;
};

export const TemplateConfirmationEmail = ({ confirmationLink, assetBaseUrl }: TemplateConfirmationEmailProps) => {
  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        <Trans>Welcome to Documenso!</Trans>
      </EmailHeading>

      <EmailBodyText>
        <Trans>Before you get started, please confirm your email address by clicking the button below:</Trans>
      </EmailBodyText>

      <EmailButtonSection>
        <EmailButton href={confirmationLink}>
          <Trans>Confirm email</Trans>
        </EmailButton>
      </EmailButtonSection>

      <EmailFinePrint breakAll>
        <Trans>
          You can also copy and paste this link into your browser: {confirmationLink} (link expires in 1 hour)
        </Trans>
      </EmailFinePrint>
    </>
  );
};
