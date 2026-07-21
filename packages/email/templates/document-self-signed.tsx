import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { Body, Container, Hr, Html, Preview, Section } from '../components';
import { TemplateBrandingLogo } from '../template-components/template-branding-logo';
import type { TemplateDocumentSelfSignedProps } from '../template-components/template-document-self-signed';
import { TemplateDocumentSelfSigned } from '../template-components/template-document-self-signed';
import { TemplateEmailHead } from '../template-components/template-email-head';
import { TemplateFooter } from '../template-components/template-footer';

export type DocumentSelfSignedTemplateProps = TemplateDocumentSelfSignedProps & {
  reportUrl?: string;
};

export const DocumentSelfSignedEmailTemplate = ({
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  reportUrl,
}: DocumentSelfSignedTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`Completed Document`;

  return (
    <Html>
      <TemplateEmailHead />
      <Body className="mx-auto my-auto bg-background font-sans">
        <Preview>{_(previewText)}</Preview>

        <Section>
          <Container className="mx-auto mt-8 mb-2 max-w-xl rounded-lg border border-border border-solid p-4">
            <Section className="p-2">
              <TemplateBrandingLogo assetBaseUrl={assetBaseUrl} className="mb-4 h-6" />

              <TemplateDocumentSelfSigned documentName={documentName} assetBaseUrl={assetBaseUrl} />
            </Section>
          </Container>

          <Hr className="mx-auto mt-12 max-w-xl" />

          <Container className="mx-auto max-w-xl">
            <TemplateFooter reportUrl={reportUrl} />
          </Container>
        </Section>
      </Body>
    </Html>
  );
};

export default DocumentSelfSignedEmailTemplate;
