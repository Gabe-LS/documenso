import { formatTeamUrl } from '@documenso/lib/utils/teams';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { EmailBodyText, EmailHeading, EmailLayout, EmailPill } from '../template-components/email-primitives';
import TemplateImage from '../template-components/template-image';

export type TeamDeleteEmailProps = {
  assetBaseUrl: string;
  baseUrl: string;
  teamUrl: string;
};

export const TeamDeleteEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://documenso.com',
  teamUrl = 'demo',
}: TeamDeleteEmailProps) => {
  const { _ } = useLingui();

  const previewText = msg`Your access to the team has ended`;

  const title = msg`A team you were a part of has been deleted`;

  const description = msg`The following team has been deleted. You will no longer be able to access this team and its documents`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} isDocument={false}>
      <TemplateImage
        className="mx-auto h-[106px] w-[120px]"
        assetBaseUrl={assetBaseUrl}
        staticAsset="delete-team.png"
        width={120}
        height={106}
      />

      <EmailHeading>{_(title)}</EmailHeading>

      <EmailBodyText>{_(description)}</EmailBodyText>

      <EmailPill>{formatTeamUrl(teamUrl, baseUrl)}</EmailPill>
    </EmailLayout>
  );
};

export default TeamDeleteEmailTemplate;
