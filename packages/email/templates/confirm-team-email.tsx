import { formatTeamUrl } from '@documenso/lib/utils/teams';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { Link } from '../components';
import {
  EmailBodyText,
  EmailButton,
  EmailButtonSection,
  EmailFinePrint,
  EmailHeading,
  EmailLayout,
  EmailList,
  EmailListItem,
  EmailPill,
} from '../template-components/email-primitives';
import TemplateImage from '../template-components/template-image';

export type ConfirmTeamEmailProps = {
  assetBaseUrl: string;
  baseUrl: string;
  teamName: string;
  teamUrl: string;
  token: string;
};

export const ConfirmTeamEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://documenso.com',
  teamName = 'Team Name',
  teamUrl = 'demo',
  token = '',
}: ConfirmTeamEmailProps) => {
  const { _ } = useLingui();

  const previewText = msg`Accept team email request for ${teamName} on Documenso`;

  return (
    <EmailLayout
      assetBaseUrl={assetBaseUrl}
      preview={_(previewText)}
      isDocument={false}
      secondaryContent={
        <>
          <EmailBodyText align="left" fullWidth>
            <Trans>
              By accepting this request, you will be granting <strong>{teamName}</strong> access to:
            </Trans>
          </EmailBodyText>

          <EmailList>
            <EmailListItem>
              <Trans>View all documents sent to and from this email address</Trans>
            </EmailListItem>
            <EmailListItem>
              <Trans>Allow document recipients to reply directly to this email address</Trans>
            </EmailListItem>
            <EmailListItem>
              <Trans>Send documents on behalf of the team using the email address</Trans>
            </EmailListItem>
          </EmailList>

          <EmailBodyText align="left" fullWidth>
            <Trans>
              You can revoke access at any time in your team settings on Documenso{' '}
              <Link className="text-foreground underline" href={`${baseUrl}/settings/teams`}>
                here
              </Link>
              .
            </Trans>
          </EmailBodyText>
        </>
      }
    >
      <TemplateImage assetBaseUrl={assetBaseUrl} staticAsset="mail-open.png" width={120} height={123} />

      <EmailHeading>
        <Trans>Verify your team email address</Trans>
      </EmailHeading>

      <EmailBodyText>
        <Trans>
          <span className="font-semibold">{teamName}</span> has requested to use your email address for their team on
          Documenso.
        </Trans>
      </EmailBodyText>

      <EmailPill>{formatTeamUrl(teamUrl, baseUrl)}</EmailPill>

      <EmailButtonSection>
        <EmailButton href={`${baseUrl}/team/verify/email/${token}`}>
          <Trans>Accept</Trans>
        </EmailButton>
      </EmailButtonSection>

      <EmailFinePrint>
        <Trans>Link expires in 1 hour.</Trans>
      </EmailFinePrint>
    </EmailLayout>
  );
};

export default ConfirmTeamEmailTemplate;
