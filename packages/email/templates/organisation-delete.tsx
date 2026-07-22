import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { EmailBodyText, EmailHeading, EmailLayout, EmailPill } from '../template-components/email-primitives';
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

  const title = msg`Your organisation has been deleted`;

  const description = deletedByAdmin
    ? msg`The following organisation has been deleted by an administrator. You and your members will no longer be able to access this organisation, its teams, or its associated data.`
    : msg`The following organisation has been deleted. You and your members will no longer be able to access this organisation, its teams, or its associated data.`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} isDocument={false}>
      <TemplateImage assetBaseUrl={assetBaseUrl} staticAsset="delete-team.png" width={120} height={106} />

      <EmailHeading>{_(title)}</EmailHeading>

      <EmailBodyText>{_(description)}</EmailBodyText>

      <EmailPill>{organisationName}</EmailPill>
    </EmailLayout>
  );
};

export default OrganisationDeleteEmailTemplate;
