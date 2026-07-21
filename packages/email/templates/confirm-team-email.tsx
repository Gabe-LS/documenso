import { formatTeamUrl } from '@documenso/lib/utils/teams';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { Body, Button, Container, Hr, Html, Link, Preview, Section, Text } from '../components';
import { TemplateBrandingLogo } from '../template-components/template-branding-logo';
import { TemplateEmailHead } from '../template-components/template-email-head';
import { TemplateFooter } from '../template-components/template-footer';
import TemplateImage from '../template-components/template-image';

export type ConfirmTeamEmailProps = {
  assetBaseUrl: string;
  baseUrl: string;
  teamName: string;
  teamUrl: string;
  token: string;
};

export const ConfirmTeamEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://documenso.com',
  teamName = 'Team Name',
  teamUrl = 'demo',
  token = '',
}: ConfirmTeamEmailProps) => {
  const { _ } = useLingui();

  const previewText = msg`Accept team email request for ${teamName} on Documenso`;

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
                className="mx-auto h-[123px] w-[120px]"
                assetBaseUrl={assetBaseUrl}
                staticAsset="mail-open.png"
                width={120}
                height={123}
              />
            </Section>

            <Section className="p-2">
              <Text className="text-center font-semibold text-foreground text-lg">
                <Trans>Verify your team email address</Trans>
              </Text>

              <Text className="text-center text-base text-muted-foreground">
                <Trans>
                  <span className="font-bold">{teamName}</span> has requested to use your email address for their team
                  on Documenso.
                </Trans>
              </Text>

              <div className="mx-auto mt-6 inline-block rounded-lg bg-muted px-4 py-2 font-medium text-base text-muted-foreground">
                {formatTeamUrl(teamUrl, baseUrl)}
              </div>

              <Section className="mt-6">
                <Text className="my-0 text-sm text-muted-foreground">
                  <Trans>
                    By accepting this request, you will be granting <strong>{teamName}</strong> access to:
                  </Trans>
                </Text>

                <ul className="mt-2 mb-0">
                  <li className="text-sm">
                    <Trans>View all documents sent to and from this email address</Trans>
                  </li>
                  <li className="mt-1 text-sm">
                    <Trans>Allow document recipients to reply directly to this email address</Trans>
                  </li>
                  <li className="mt-1 text-sm">
                    <Trans>Send documents on behalf of the team using the email address</Trans>
                  </li>
                </ul>

                <Text className="mt-2 text-sm text-muted-foreground">
                  <Trans>
                    You can revoke access at any time in your team settings on Documenso{' '}
                    <Link className="underline" href={`${baseUrl}/settings/teams`}>
                      here
                    </Link>
                    .
                  </Trans>
                </Text>
              </Section>

              <Section className="mt-8 mb-6 text-center">
                <Button
                  className="rounded-lg bg-primary px-6 py-3 text-center font-medium text-primary-foreground text-sm no-underline"
                  href={`${baseUrl}/team/verify/email/${token}`}
                >
                  <Trans>Accept</Trans>
                </Button>
              </Section>
            </Section>

            <Text className="text-center text-muted-foreground text-sm">
              <Trans>Link expires in 1 hour.</Trans>
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

export default ConfirmTeamEmailTemplate;
