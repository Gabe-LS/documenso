import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import {
  EmailBodyText,
  EmailButton,
  EmailButtonSection,
  EmailFinePrint,
  EmailHeading,
  EmailLayout,
} from '../template-components/email-primitives';
import TemplateImage from '../template-components/template-image';

type OrganisationAccountLinkConfirmationTemplateProps = {
  type: 'create' | 'link';
  confirmationLink: string;
  organisationName: string;
  assetBaseUrl: string;
};

export const OrganisationAccountLinkConfirmationTemplate = ({
  type = 'link',
  confirmationLink = '<CONFIRMATION_LINK>',
  organisationName = '<ORGANISATION_NAME>',
  assetBaseUrl = 'http://localhost:3002',
}: OrganisationAccountLinkConfirmationTemplateProps) => {
  const { _ } = useLingui();

  const previewText =
    type === 'create'
      ? msg`A request has been made to create an account for you`
      : msg`A request has been made to link your Documenso account`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} isDocument={false}>
      <TemplateImage
        className="mx-auto h-[120px] w-[120px]"
        assetBaseUrl={assetBaseUrl}
        staticAsset="building-2.png"
        width={120}
        height={120}
      />

      <EmailHeading>
        {type === 'create' ? <Trans>Account creation request</Trans> : <Trans>Link your Documenso account</Trans>}
      </EmailHeading>

      <EmailBodyText>
        {type === 'create' ? (
          <Trans>
            <span className="font-bold">{organisationName}</span> has requested to create an account on your behalf.
          </Trans>
        ) : (
          <Trans>
            <span className="font-bold">{organisationName}</span> has requested to link your current Documenso
            account to their organisation.
          </Trans>
        )}
      </EmailBodyText>

      <EmailButtonSection>
        <EmailButton href={confirmationLink}>
          <Trans>Review request</Trans>
        </EmailButton>
      </EmailButtonSection>

      <EmailFinePrint>
        <Trans>Link expires in 30 minutes.</Trans>
      </EmailFinePrint>
    </EmailLayout>
  );
};

export default OrganisationAccountLinkConfirmationTemplate;
