import { Trans } from '@lingui/react/macro';

import { EmailHeading, EmailLayout, EmailPill } from '../template-components/email-primitives';
import TemplateImage from '../template-components/template-image';

export type OrganisationJoinEmailProps = {
  assetBaseUrl: string;
  baseUrl: string;
  memberName: string;
  memberEmail: string;
  organisationName: string;
  organisationUrl: string;
};

export const OrganisationJoinEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://documenso.com',
  memberName = 'John Doe',
  memberEmail = 'johndoe@documenso.com',
  organisationName = 'Organisation Name',
  organisationUrl = 'demo',
}: OrganisationJoinEmailProps) => {
  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} isDocument={false}>
      <TemplateImage assetBaseUrl={assetBaseUrl} staticAsset="add-user.png" width={120} height={120} />

      <EmailHeading>
        <Trans>A new member has joined your organisation {organisationName}</Trans>
      </EmailHeading>

      <EmailPill>{memberName || memberEmail}</EmailPill>
    </EmailLayout>
  );
};

export default OrganisationJoinEmailTemplate;
