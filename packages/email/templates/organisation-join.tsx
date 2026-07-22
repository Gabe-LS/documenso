import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
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
  const { _ } = useLingui();

  const previewText = msg`A member has joined your organisation on Documenso`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} isDocument={false}>
      <TemplateImage
        className="mx-auto h-[120px] w-[120px]"
        assetBaseUrl={assetBaseUrl}
        staticAsset="add-user.png"
        width={120}
        height={120}
      />

      <EmailHeading>
        <Trans>A new member has joined your organisation {organisationName}</Trans>
      </EmailHeading>

      <EmailPill>{memberName || memberEmail}</EmailPill>
    </EmailLayout>
  );
};

export default OrganisationJoinEmailTemplate;
