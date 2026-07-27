import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { EmailHeading, EmailLayout, EmailPill } from '../template-components/email-primitives';
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

  const previewText = msg`Review the remaining team members.`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} isDocument={false}>
      <TemplateImage assetBaseUrl={assetBaseUrl} staticAsset="delete-user.png" width={102} height={87} />

      <EmailHeading>
        <Trans>A member has left your organisation {organisationName}</Trans>
      </EmailHeading>

      <EmailPill>{memberName || memberEmail}</EmailPill>
    </EmailLayout>
  );
};

export default OrganisationLeaveEmailTemplate;
