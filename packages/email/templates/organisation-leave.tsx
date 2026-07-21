import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { Body, Container, Hr, Html, Preview, Section, Text } from '../components';
import { TemplateBrandingLogo } from '../template-components/template-branding-logo';
import { TemplateEmailHead } from '../template-components/template-email-head';
import { TemplateFooter } from '../template-components/template-footer';
import TemplateImage from '../template-components/template-image';

export type OrganisationLeaveEmailProps = {
  assetBaseUrl: string;
  baseUrl: string;
  memberName: string;
  memberEmail: string;
  organisationName: string;
  organisationUrl: string;
};

export const OrganisationLeaveEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://documenso.com',
  memberName = 'John Doe',
  memberEmail = 'johndoe@documenso.com',
  organisationName = 'Organisation Name',
  organisationUrl = 'demo',
}: OrganisationLeaveEmailProps) => {
  const { _ } = useLingui();

  const previewText = msg`A member has left your organisation on Documenso`;

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
                className="mx-auto h-[87px] w-[102px]"
                assetBaseUrl={assetBaseUrl}
                staticAsset="delete-user.png"
                width={102}
                height={87}
              />
            </Section>

            <Section className="p-2">
              <Text className="text-center font-semibold text-foreground text-lg">
                <Trans>A member has left your organisation {organisationName}</Trans>
              </Text>

              <div className="mx-auto my-2 inline-block rounded-lg bg-muted px-4 py-2 font-medium text-base text-muted-foreground">
                {memberName || memberEmail}
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

export default OrganisationLeaveEmailTemplate;
