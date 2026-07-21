import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { Body, Container, Hr, Html, Preview, Section } from '../components';
import { TemplateBrandingLogo } from '../template-components/template-branding-logo';
import { TemplateDocumentRejected } from '../template-components/template-document-rejected';
import { TemplateEmailHead } from '../template-components/template-email-head';
import { TemplateFooter } from '../template-components/template-footer';

type DocumentRejectedEmailProps = {
  recipientName: string;
  documentName: string;
  documentUrl: string;
  rejectionReason: string;
  assetBaseUrl?: string;
  reportUrl?: string;
};

export function DocumentRejectedEmail({
  recipientName,
  documentName,
  documentUrl,
  rejectionReason,
  assetBaseUrl = 'http://localhost:3002',
  reportUrl,
}: DocumentRejectedEmailProps) {
  const { _ } = useLingui();

  const previewText = _(msg`${recipientName} has rejected the document '${documentName}'`);

  return (
    <Html>
      <TemplateEmailHead />

      <Body className="mx-auto my-auto bg-background font-sans">
        <Preview>{previewText}</Preview>

        <Section>
          <Container className="mx-auto mt-8 mb-2 max-w-xl rounded-lg border border-border border-solid p-4">
            <Section>
              <TemplateBrandingLogo assetBaseUrl={assetBaseUrl} className="mb-4 h-6" />

              <TemplateDocumentRejected
                recipientName={recipientName}
                documentName={documentName}
                documentUrl={documentUrl}
                rejectionReason={rejectionReason}
                assetBaseUrl={assetBaseUrl}
              />
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
}

export default DocumentRejectedEmail;
