import { SUPPORT_EMAIL } from '@documenso/lib/constants/app';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { Link } from '../components';
import { EmailBodyText, EmailLayout } from '../template-components/email-primitives';
import type { TemplateResetPasswordProps } from '../template-components/template-reset-password';
import { TemplateResetPassword } from '../template-components/template-reset-password';

export type ResetPasswordTemplateProps = Partial<TemplateResetPasswordProps> & {
  userName?: string;
  userEmail?: string;
};

export const ResetPasswordTemplate = ({
  userName = 'Lucas Smith',
  userEmail = 'lucas@documenso.com',
  assetBaseUrl = 'http://localhost:3002',
}: ResetPasswordTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`Password Reset Successful`;

  return (
    <EmailLayout
      assetBaseUrl={assetBaseUrl}
      preview={_(previewText)}
      isDocument={false}
      secondaryContent={
        <>
          <EmailBodyText align="left" fullWidth className="font-semibold">
            <Trans>
              Hi, {userName}{' '}
              <Link className="font-normal text-foreground underline" href={`mailto:${userEmail}`}>
                ({userEmail})
              </Link>
            </Trans>
          </EmailBodyText>

          <EmailBodyText align="left" fullWidth>
            <Trans>
              Didn't request a password change? We are here to help you secure your account, just{' '}
              <Link className="font-normal text-foreground underline" href={`mailto:${SUPPORT_EMAIL}`}>
                contact us
              </Link>
              .
            </Trans>
          </EmailBodyText>
        </>
      }
    >
      <TemplateResetPassword assetBaseUrl={assetBaseUrl} />
    </EmailLayout>
  );
};

export default ResetPasswordTemplate;
