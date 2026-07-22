import { EmailLayout } from '../template-components/email-primitives';
import type { TemplateAdminUserCreatedProps } from '../template-components/template-admin-user-created';
import { TemplateAdminUserCreated } from '../template-components/template-admin-user-created';

export const AdminUserCreatedTemplate = ({
  resetPasswordLink,
  assetBaseUrl = 'http://localhost:3002',
}: TemplateAdminUserCreatedProps) => {
  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} isDocument={false}>
      <TemplateAdminUserCreated resetPasswordLink={resetPasswordLink} assetBaseUrl={assetBaseUrl} />
    </EmailLayout>
  );
};

export default AdminUserCreatedTemplate;
