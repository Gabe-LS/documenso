import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import {
  EmailBodyText,
  EmailButton,
  EmailButtonSection,
  EmailHeading,
  EmailLayout,
  EmailPill,
} from '../template-components/email-primitives';
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
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} isDocument={false}>
      <TemplateImage
        className="mx-auto h-[120px] w-[120px]"
        assetBaseUrl={assetBaseUrl}
        staticAsset="add-user.png"
        width={120}
        height={120}
      />

      <EmailHeading>
        <Trans>Join {organisationName} on Documenso</Trans>
      </EmailHeading>

      <EmailPill>{organisationName}</EmailPill>

      <EmailBodyText>
        <Trans>
          by <span className="font-semibold">{senderName}</span>
        </Trans>
      </EmailBodyText>

      <EmailButtonSection>
        <EmailButton href={`${baseUrl}/organisation/invite/${token}`}>
          <Trans>Accept</Trans>
        </EmailButton>
        <EmailButton variant="muted" href={`${baseUrl}/organisation/decline/${token}`}>
          <Trans>Decline</Trans>
        </EmailButton>
      </EmailButtonSection>
    </EmailLayout>
  );
};

export default OrganisationInviteEmailTemplate;
