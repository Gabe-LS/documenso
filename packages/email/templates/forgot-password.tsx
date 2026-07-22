import { EmailLayout } from '../template-components/email-primitives';
import type { TemplateForgotPasswordProps } from '../template-components/template-forgot-password';
import { TemplateForgotPassword } from '../template-components/template-forgot-password';

export type ForgotPasswordTemplateProps = Partial<TemplateForgotPasswordProps>;

export const ForgotPasswordTemplate = ({
  resetPasswordLink = 'https://documenso.com',
  assetBaseUrl = 'http://localhost:3002',
}: ForgotPasswordTemplateProps) => {
  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} isDocument={false}>
      <TemplateForgotPassword resetPasswordLink={resetPasswordLink} assetBaseUrl={assetBaseUrl} />
    </EmailLayout>
  );
};

export default ForgotPasswordTemplate;
