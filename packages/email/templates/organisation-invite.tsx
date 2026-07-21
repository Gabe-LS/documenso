import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { Body, Button, Container, Hr, Html, Preview, Section, Text } from '../components';
import { TemplateBrandingLogo } from '../template-components/template-branding-logo';
import { TemplateEmailHead } from '../template-components/template-email-head';
import { TemplateFooter } from '../template-components/template-footer';
import TemplateImage from '../template-components/template-image';

export type OrganisationInviteEmailProps = {
  assetBaseUrl: string;
  baseUrl: string;
  senderName: string;
  organisationName: string;
  token: string;
};

export const OrganisationInviteEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://documenso.com',
  senderName = 'John Doe',
  organisationName = 'Organisation Name',
  token = '',
}: OrganisationInviteEmailProps) => {
  const { _ } = useLingui();

  const previewText = msg`Accept invitation to join an organisation on Documenso`;

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
                className="mx-auto h-[120px] w-[120px]"
                assetBaseUrl={assetBaseUrl}
                staticAsset="add-user.png"
                width={120}
                height={120}
              />
            </Section>

            <Section className="p-2">
              <Text className="text-center font-semibold text-foreground text-lg">
                <Trans>Join {organisationName} on Documenso</Trans>
              </Text>

              <Text className="my-1 text-center text-base text-muted-foreground">
                <Trans>You have been invited to join the following organisation</Trans>
              </Text>

              <div className="mx-auto my-2 inline-block rounded-lg bg-muted px-4 py-2 font-medium text-base text-muted-foreground">
                {organisationName}
              </div>

              <Text className="my-1 text-center text-base text-muted-foreground">
                <Trans>
                  by <span className="text-foreground">{senderName}</span>
                </Trans>
              </Text>

              <Section className="mt-8 mb-6 text-center">
                <Button
                  className="rounded-lg bg-primary px-6 py-3 text-center font-medium text-primary-foreground text-sm no-underline"
                  href={`${baseUrl}/organisation/invite/${token}`}
                >
                  <Trans>Accept</Trans>
                </Button>
                <Button
                  className="ml-4 rounded-lg bg-muted px-6 py-3 text-center font-medium text-muted-foreground text-sm no-underline"
                  href={`${baseUrl}/organisation/decline/${token}`}
                >
                  <Trans>Decline</Trans>
                </Button>
              </Section>
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

export default OrganisationInviteEmailTemplate;
