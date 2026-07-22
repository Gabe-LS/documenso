import { EmailLayout } from '../template-components/email-primitives';
import type { TemplateConfirmationEmailProps } from '../template-components/template-confirmation-email';
import { TemplateConfirmationEmail } from '../template-components/template-confirmation-email';

export const ConfirmEmailTemplate = ({
  confirmationLink,
  assetBaseUrl = 'http://localhost:3002',
}: TemplateConfirmationEmailProps) => {
  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} isDocument={false}>
      <TemplateConfirmationEmail confirmationLink={confirmationLink} assetBaseUrl={assetBaseUrl} />
    </EmailLayout>
  );
};

export default ConfirmEmailTemplate;
