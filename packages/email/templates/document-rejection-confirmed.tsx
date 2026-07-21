import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { Body, Container, Hr, Html, Preview, Section } from '../components';
import { TemplateBrandingLogo } from '../template-components/template-branding-logo';
import { TemplateDocumentRejectionConfirmed } from '../template-components/template-document-rejection-confirmed';
import { TemplateEmailHead } from '../template-components/template-email-head';
import { TemplateFooter } from '../template-components/template-footer';

export type DocumentRejectionConfirmedEmailProps = {
  recipientName: string;
  documentName: string;
  documentOwnerName: string;
  reason: string;
  assetBaseUrl?: string;
  reportUrl?: string;
};

export function DocumentRejectionConfirmedEmail({
  recipientName,
  documentName,
  documentOwnerName,
  reason,
  assetBaseUrl = 'http://localhost:3002',
  reportUrl,
}: DocumentRejectionConfirmedEmailProps) {
  const { _ } = useLingui();

  const previewText = _(msg`You have rejected the document '${documentName}'`);

  return (
    <Html>
      <TemplateEmailHead />

      <Body className="mx-auto my-auto bg-background font-sans">
        <Preview>{previewText}</Preview>

        <Section>
          <Container className="mx-auto mt-8 mb-2 max-w-xl rounded-lg border border-border border-solid p-4">
            <Section>
              <TemplateBrandingLogo assetBaseUrl={assetBaseUrl} className="mb-4 h-6" />

              <TemplateDocumentRejectionConfirmed
                recipientName={recipientName}
                documentName={documentName}
                documentOwnerName={documentOwnerName}
                reason={reason}
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

export default DocumentRejectionConfirmedEmail;
