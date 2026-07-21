import { formatTeamUrl } from '@documenso/lib/utils/teams';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { Body, Container, Hr, Html, Preview, Section, Text } from '../components';
import { TemplateBrandingLogo } from '../template-components/template-branding-logo';
import { TemplateEmailHead } from '../template-components/template-email-head';
import { TemplateFooter } from '../template-components/template-footer';
import TemplateImage from '../template-components/template-image';

export type TeamEmailRemovedTemplateProps = {
  assetBaseUrl: string;
  baseUrl: string;
  teamEmail: string;
  teamName: string;
  teamUrl: string;
};

export const TeamEmailRemovedTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://documenso.com',
  teamEmail = 'example@documenso.com',
  teamName = 'Team Name',
  teamUrl = 'demo',
}: TeamEmailRemovedTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`Team email removed for ${teamName} on Documenso`;

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
                staticAsset="mail-open-alert.png"
                width={120}
                height={123}
              />
            </Section>

            <Section className="p-2">
              <Text className="text-center font-semibold text-foreground text-lg">
                <Trans>Team email removed</Trans>
              </Text>

              <Text className="my-1 text-center text-base text-muted-foreground">
                <Trans>
                  The team email <span className="font-bold">{teamEmail}</span> has been removed from the following team
                </Trans>
              </Text>

              <div className="mx-auto mt-2 mb-6 inline-block rounded-lg bg-muted px-4 py-2 font-medium text-base text-muted-foreground">
                {formatTeamUrl(teamUrl, baseUrl)}
              </div>
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

export default TeamEmailRemovedTemplate;
