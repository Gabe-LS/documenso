import { RECIPIENT_ROLES_DESCRIPTION } from '@documenso/lib/constants/recipient-roles';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { RecipientRole } from '@prisma/client';

import { Body, Button, Container, Hr, Html, Preview, Section, Text } from '../components';
import { TemplateBrandingLogo } from '../template-components/template-branding-logo';
import TemplateDocumentImage from '../template-components/template-document-image';
import { TemplateEmailHead } from '../template-components/template-email-head';
import { TemplateFooter } from '../template-components/template-footer';

export type DocumentCreatedFromDirectTemplateEmailTemplateProps = {
  recipientName?: string;
  recipientRole?: RecipientRole;
  documentLink?: string;
  documentName?: string;
  assetBaseUrl?: string;
  reportUrl?: string;
};

export const DocumentCreatedFromDirectTemplateEmailTemplate = ({
  recipientName = 'John Doe',
  recipientRole = RecipientRole.SIGNER,
  documentLink = 'http://localhost:3000',
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  reportUrl,
}: DocumentCreatedFromDirectTemplateEmailTemplateProps) => {
  const { _ } = useLingui();

  const action = _(RECIPIENT_ROLES_DESCRIPTION[recipientRole].actioned).toLowerCase();

  const previewText = msg`Document created from direct template`;

  return (
    <Html>
      <TemplateEmailHead />
      <Body className="mx-auto my-auto bg-background font-sans">
        <Preview>{_(previewText)}</Preview>

        <Section>
          <Container className="mx-auto mt-8 mb-2 max-w-xl rounded-lg border border-border border-solid p-4">
            <Section className="p-2">
              <TemplateBrandingLogo assetBaseUrl={assetBaseUrl} className="mb-4 h-6" />

              <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

              <Section>
                <Text className="mb-0 text-center font-semibold text-foreground text-lg">
                  <Trans>
                    {recipientName} {action} a document by using one of your direct links
                  </Trans>
                </Text>

                <div className="mx-auto my-2 inline-block rounded-lg bg-muted px-4 py-2 text-muted-foreground text-sm">
                  {documentName}
                </div>

                <Section className="my-6 text-center">
                  <Button
                    className="rounded-lg bg-primary px-6 py-3 text-center font-medium text-primary-foreground text-sm no-underline"
                    href={documentLink}
                  >
                    <Trans>View document</Trans>
                  </Button>
                </Section>
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

export default DocumentCreatedFromDirectTemplateEmailTemplate;
