import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { Body, Container, Hr, Html, Preview, Section } from '../components';
import type { TemplateAdminUserCreatedProps } from '../template-components/template-admin-user-created';
import { TemplateAdminUserCreated } from '../template-components/template-admin-user-created';
import { TemplateBrandingLogo } from '../template-components/template-branding-logo';
import { TemplateEmailHead } from '../template-components/template-email-head';
import { TemplateFooter } from '../template-components/template-footer';

export const AdminUserCreatedTemplate = ({
  resetPasswordLink,
  assetBaseUrl = 'http://localhost:3002',
}: TemplateAdminUserCreatedProps) => {
  const { _ } = useLingui();

  const previewText = msg`Set your password for Documenso`;

  return (
    <Html>
      <TemplateEmailHead />
      <Body className="mx-auto my-auto bg-background font-sans">
        <Preview>{_(previewText)}</Preview>

        <Section>
          <Container className="mx-auto mt-8 mb-2 max-w-xl rounded-lg border border-border border-solid p-4">
            <Section>
              <TemplateBrandingLogo assetBaseUrl={assetBaseUrl} className="mb-4 h-6" />

              <TemplateAdminUserCreated resetPasswordLink={resetPasswordLink} assetBaseUrl={assetBaseUrl} />
            </Section>
          </Container>
          <Hr className="mx-auto mt-12 max-w-xl" />

          <Container className="mx-auto max-w-xl">
            <TemplateFooter isDocument={false} />
          </Container>
        </Section>
      </Body>
    </Html>
  );
};

export default AdminUserCreatedTemplate;
