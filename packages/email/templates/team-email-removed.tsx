import { formatTeamUrl } from '@documenso/lib/utils/teams';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { EmailBodyText, EmailHeading, EmailLayout, EmailPill } from '../template-components/email-primitives';
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
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} isDocument={false}>
      <TemplateImage
        className="mx-auto h-[123px] w-[120px]"
        assetBaseUrl={assetBaseUrl}
        staticAsset="mail-open-alert.png"
        width={120}
        height={123}
      />

      <EmailHeading>
        <Trans>Team email removed</Trans>
      </EmailHeading>

      <EmailBodyText>
        <Trans>
          The team email <span className="font-bold">{teamEmail}</span> has been removed from the following team
        </Trans>
      </EmailBodyText>

      <EmailPill>{formatTeamUrl(teamUrl, baseUrl)}</EmailPill>
    </EmailLayout>
  );
};

export default TeamEmailRemovedTemplate;
