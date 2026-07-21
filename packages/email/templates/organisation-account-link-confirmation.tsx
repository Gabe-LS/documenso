import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { Body, Button, Container, Hr, Html, Preview, Section, Text } from '../components';
import { TemplateBrandingLogo } from '../template-components/template-branding-logo';
import { TemplateEmailHead } from '../template-components/template-email-head';
import { TemplateFooter } from '../template-components/template-footer';
import TemplateImage from '../template-components/template-image';

type OrganisationAccountLinkConfirmationTemplateProps = {
  type: 'create' | 'link';
  confirmationLink: string;
  organisationName: string;
  assetBaseUrl: string;
};

export const OrganisationAccountLinkConfirmationTemplate = ({
  type = 'link',
  confirmationLink = '<CONFIRMATION_LINK>',
  organisationName = '<ORGANISATION_NAME>',
  assetBaseUrl = 'http://localhost:3002',
}: OrganisationAccountLinkConfirmationTemplateProps) => {
  const { _ } = useLingui();

  const previewText =
    type === 'create'
      ? msg`A request has been made to create an account for you`
      : msg`A request has been made to link your Documenso account`;

  return (
    <Html>
      <TemplateEmailHead />
      <Body className="mx-auto my-auto bg-background font-sans">
        <Preview>{_(previewText)}</Preview>

        <Section>
          <Container className="mx-auto mt-8 mb-2 max-w-xl rounded-lg border border-border border-solid p-4">
            <TemplateBrandingLogo assetBaseUrl={assetBaseUrl} className="mb-4 h-6" />

            <Section>
              <TemplateImage
                className="mx-auto h-12 w-12"
                assetBaseUrl={assetBaseUrl}
                staticAsset="building-2.png"
                width={48}
                height={48}
              />
            </Section>

            <Section className="p-2">
              <Text className="text-center font-semibold text-foreground text-lg">
                {type === 'create' ? (
                  <Trans>Account creation request</Trans>
                ) : (
                  <Trans>Link your Documenso account</Trans>
                )}
              </Text>

              <Text className="text-center text-base text-muted-foreground">
                {type === 'create' ? (
                  <Trans>
                    <span className="font-bold">{organisationName}</span> has requested to create an account on your
                    behalf.
                  </Trans>
                ) : (
                  <Trans>
                    <span className="font-bold">{organisationName}</span> has requested to link your current Documenso
                    account to their organisation.
                  </Trans>
                )}
              </Text>

              <Section className="mt-8 mb-6 text-center">
                <Button
                  className="rounded-lg bg-primary px-6 py-3 text-center font-medium text-primary-foreground text-sm no-underline"
                  href={confirmationLink}
                >
                  <Trans>Review request</Trans>
                </Button>
              </Section>
            </Section>

            <Text className="text-center text-muted-foreground text-sm">
              <Trans>Link expires in 30 minutes.</Trans>
            </Text>
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

export default OrganisationAccountLinkConfirmationTemplate;
