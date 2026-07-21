import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { Body, Container, Hr, Html, Preview, Section } from '../components';
import { TemplateBrandingLogo } from '../template-components/template-branding-logo';
import type { TemplateDocumentPendingProps } from '../template-components/template-document-pending';
import { TemplateDocumentPending } from '../template-components/template-document-pending';
import { TemplateEmailHead } from '../template-components/template-email-head';
import { TemplateFooter } from '../template-components/template-footer';

export type DocumentPendingEmailTemplateProps = Partial<TemplateDocumentPendingProps> & {
  reportUrl?: string;
};

export const DocumentPendingEmailTemplate = ({
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  reportUrl,
}: DocumentPendingEmailTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`Pending Document`;

  return (
    <Html>
      <TemplateEmailHead />
      <Body className="mx-auto my-auto bg-background font-sans">
        <Preview>{_(previewText)}</Preview>

        <Section>
          <Container className="mx-auto mt-8 mb-2 max-w-xl rounded-lg border border-border border-solid p-4">
            <Section>
              <TemplateBrandingLogo assetBaseUrl={assetBaseUrl} className="mb-4 h-6" />

              <TemplateDocumentPending documentName={documentName} assetBaseUrl={assetBaseUrl} />
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

export default DocumentPendingEmailTemplate;
