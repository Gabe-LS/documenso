import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { Body, Container, Hr, Html, Preview, Section, Text } from '../components';
import { TemplateBrandingLogo } from '../template-components/template-branding-logo';
import TemplateDocumentImage from '../template-components/template-document-image';
import { TemplateEmailHead } from '../template-components/template-email-head';
import { TemplateFooter } from '../template-components/template-footer';

export type RecipientRemovedFromDocumentEmailTemplateProps = {
  inviterName?: string;
  documentName?: string;
  assetBaseUrl?: string;
  reportUrl?: string;
};

export const RecipientRemovedFromDocumentTemplate = ({
  inviterName = 'Lucas Smith',
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  reportUrl,
}: RecipientRemovedFromDocumentEmailTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`${inviterName} has removed you from the document ${documentName}.`;

  return (
    <Html>
      <TemplateEmailHead />

      <Body className="mx-auto my-auto bg-background font-sans">
        <Preview>{_(previewText)}</Preview>

        <Section>
          <Container className="mx-auto mt-8 mb-2 max-w-xl rounded-lg border border-border border-solid p-4">
            <Section>
              <TemplateBrandingLogo assetBaseUrl={assetBaseUrl} className="mb-4 h-6" />

              <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

              <Section>
                <Text className="mx-auto mb-0 max-w-[80%] text-center font-semibold text-foreground text-lg">
                  <Trans>
                    {inviterName} has removed you from the document
                    <br />"{documentName}"
                  </Trans>
                </Text>
              </Section>
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

export default RecipientRemovedFromDocumentTemplate;
