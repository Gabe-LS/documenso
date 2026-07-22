import { SUPPORT_EMAIL } from '@documenso/lib/constants/app';
import { Trans } from '@lingui/react/macro';

import { Link } from '../components';
import {
  EmailBodyText,
  EmailButton,
  EmailButtonSection,
  EmailFinePrint,
  EmailHeading,
} from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export type TemplateAdminUserCreatedProps = {
  resetPasswordLink: string;
  assetBaseUrl: string;
};

export const TemplateAdminUserCreated = ({ resetPasswordLink, assetBaseUrl }: TemplateAdminUserCreatedProps) => {
  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        <Trans>Welcome to Documenso!</Trans>
      </EmailHeading>

      <EmailBodyText>
        <Trans>An administrator has created a Documenso account for you.</Trans>
      </EmailBodyText>

      <EmailBodyText>
        <Trans>To get started, please set your password by clicking the button below:</Trans>
      </EmailBodyText>

      <EmailButtonSection>
        <EmailButton href={resetPasswordLink}>
          <Trans>Set Password</Trans>
        </EmailButton>
      </EmailButtonSection>

      <EmailFinePrint breakAll>
        <Trans>
          You can also copy and paste this link into your browser: {resetPasswordLink} (link expires in 24 hours)
        </Trans>
      </EmailFinePrint>

      <EmailFinePrint>
        <Trans>
          If you didn't expect this account or have any questions, please{' '}
          <Link href={`mailto:${SUPPORT_EMAIL}`} className="text-muted-foreground underline">
            contact support
          </Link>
          .
        </Trans>
      </EmailFinePrint>
    </>
  );
};
