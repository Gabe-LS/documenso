import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { EmailLayout } from '../template-components/email-primitives';
import type { TemplateAdminUserCreatedProps } from '../template-components/template-admin-user-created';
import { TemplateAdminUserCreated } from '../template-components/template-admin-user-created';

export const AdminUserCreatedTemplate = ({
  resetPasswordLink,
  assetBaseUrl = 'http://localhost:3002',
}: TemplateAdminUserCreatedProps) => {
  const { _ } = useLingui();

  const previewText = msg`A new account was created.`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} isDocument={false}>
      <TemplateAdminUserCreated resetPasswordLink={resetPasswordLink} assetBaseUrl={assetBaseUrl} />
    </EmailLayout>
  );
};

export default AdminUserCreatedTemplate;
