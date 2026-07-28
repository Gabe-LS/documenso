import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { EmailLayout } from '../template-components/email-primitives';
import { TemplateAccessAuth2FA } from '../template-components/template-access-auth-2fa';

export type AccessAuth2FAEmailTemplateProps = {
  documentTitle: string;
  code: string;
  userEmail: string;
  userName: string;
  expiresInMinutes: number;
  assetBaseUrl?: string;
};

export const AccessAuth2FAEmailTemplate = ({
  documentTitle,
  code,
  userEmail,
  userName,
  expiresInMinutes,
  assetBaseUrl = 'http://localhost:3002',
}: AccessAuth2FAEmailTemplateProps) => {
  const { _ } = useLingui();

  // Deliberately excludes the code itself: preheaders render on lock screens.
  // Also must not restate the subject ("Your two-factor authentication code").
  const previewText = msg`Enter the code to finish signing in.`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} isDocument={false}>
      <TemplateAccessAuth2FA
        documentTitle={documentTitle}
        code={code}
        userEmail={userEmail}
        userName={userName}
        expiresInMinutes={expiresInMinutes}
        assetBaseUrl={assetBaseUrl}
      />
    </EmailLayout>
  );
};

export default AccessAuth2FAEmailTemplate;
