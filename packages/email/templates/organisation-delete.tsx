import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { Body, Container, Hr, Html, Preview, Section, Text } from '../components';
import { TemplateBrandingLogo } from '../template-components/template-branding-logo';
import { TemplateEmailHead } from '../template-components/template-email-head';
import { TemplateFooter } from '../template-components/template-footer';
import TemplateImage from '../template-components/template-image';

export type OrganisationDeleteEmailProps = {
  assetBaseUrl: string;
  organisationName: string;
  /**
   * Whether the deletion was performed by an administrator (as opposed to the owner).
   * Slightly changes the wording in the email.
   */
  deletedByAdmin?: boolean;
};

export const OrganisationDeleteEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  organisationName = 'Organisation Name Placeholder',
  deletedByAdmin = false,
}: OrganisationDeleteEmailProps) => {
  const { _ } = useLingui();

  const previewText = msg`Your organisation has been deleted`;

  const title = msg`Your organisation has been deleted`;

  const description = deletedByAdmin
    ? msg`The following organisation has been deleted by an administrator. You and your members will no longer be able to access this organisation, its teams, or its associated data.`
    : msg`The following organisation has been deleted. You and your members will no longer be able to access this organisation, its teams, or its associated data.`;

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
                className="mx-auto h-[106px] w-[120px]"
                assetBaseUrl={assetBaseUrl}
                staticAsset="delete-team.png"
                width={120}
                height={106}
              />
            </Section>

            <Section className="p-2">
              <Text className="text-center font-semibold text-foreground text-lg">{_(title)}</Text>

              <Text className="my-1 text-center text-base text-muted-foreground">{_(description)}</Text>

              <div className="mx-auto my-2 inline-block rounded-lg bg-muted px-4 py-2 font-medium text-base text-muted-foreground">
                {organisationName}
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

export default OrganisationDeleteEmailTemplate;
