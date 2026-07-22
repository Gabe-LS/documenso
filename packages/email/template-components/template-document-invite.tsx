import { RECIPIENT_ROLES_DESCRIPTION } from '@documenso/lib/constants/recipient-roles';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { OrganisationType, RecipientRole } from '@prisma/client';
import { match, P } from 'ts-pattern';

import { EmailBodyText, EmailButton, EmailButtonSection, EmailHeading } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentInviteProps {
  inviterName: string;
  inviterEmail: string;
  documentName: string;
  signDocumentLink: string;
  assetBaseUrl: string;
  role: RecipientRole;
  selfSigner: boolean;
  teamName?: string;
  includeSenderDetails?: boolean;
  organisationType?: OrganisationType;
}

export const TemplateDocumentInvite = ({
  inviterName,
  documentName,
  signDocumentLink,
  assetBaseUrl,
  role,
  selfSigner,
  teamName,
  includeSenderDetails,
  organisationType,
}: TemplateDocumentInviteProps) => {
  const { _ } = useLingui();

  const { actionVerb } = RECIPIENT_ROLES_DESCRIPTION[role];

  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        {match({ selfSigner, organisationType, includeSenderDetails, teamName })
          .with({ selfSigner: true }, () => (
            <Trans>
              Please {_(actionVerb).toLowerCase()} your document
              <br />"{documentName}"
            </Trans>
          ))
          .with(
            {
              organisationType: OrganisationType.ORGANISATION,
              includeSenderDetails: true,
              teamName: P.string,
            },
            () => (
              <Trans>
                {inviterName} on behalf of "{teamName}" has invited you to {_(actionVerb).toLowerCase()}
                <br />"{documentName}"
              </Trans>
            ),
          )
          .with({ organisationType: OrganisationType.ORGANISATION, teamName: P.string }, () => (
            <Trans>
              {teamName} has invited you to {_(actionVerb).toLowerCase()}
              <br />"{documentName}"
            </Trans>
          ))
          .otherwise(() => (
            <Trans>
              {inviterName} has invited you to {_(actionVerb).toLowerCase()}
              <br />"{documentName}"
            </Trans>
          ))}
      </EmailHeading>

      <EmailBodyText>
        {match(role)
          .with(RecipientRole.SIGNER, () => <Trans>Continue by signing the document.</Trans>)
          .with(RecipientRole.VIEWER, () => <Trans>Continue by viewing the document.</Trans>)
          .with(RecipientRole.APPROVER, () => <Trans>Continue by approving the document.</Trans>)
          .with(RecipientRole.CC, () => '')
          .with(RecipientRole.ASSISTANT, () => <Trans>Continue by assisting with the document.</Trans>)
          .exhaustive()}
      </EmailBodyText>

      <EmailButtonSection>
        <EmailButton href={signDocumentLink}>
          {match(role)
            .with(RecipientRole.SIGNER, () => <Trans>View Document to sign</Trans>)
            .with(RecipientRole.VIEWER, () => <Trans>View Document</Trans>)
            .with(RecipientRole.APPROVER, () => <Trans>View Document to approve</Trans>)
            .with(RecipientRole.CC, () => '')
            .with(RecipientRole.ASSISTANT, () => <Trans>View Document to assist</Trans>)
            .exhaustive()}
        </EmailButton>
      </EmailButtonSection>
    </>
  );
};

export default TemplateDocumentInvite;
