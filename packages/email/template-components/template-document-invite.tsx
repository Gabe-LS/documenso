import { RECIPIENT_ROLES_DESCRIPTION } from '@documenso/lib/constants/recipient-roles';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { OrganisationType, RecipientRole } from '@prisma/client';
import { match, P } from 'ts-pattern';

import { EmailButton, EmailButtonSection, EmailHeading } from './email-primitives';
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

  // Viewers get the "sharing" frame (matching their "Shared with you" subject)
  // rather than the invitation frame; the sharer is the team when the document
  // went out through an organisation, otherwise the person.
  const sharerName = organisationType === OrganisationType.ORGANISATION && teamName ? teamName : inviterName;

  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        {role === RecipientRole.VIEWER && !selfSigner ? (
          <Trans>
            {sharerName} has shared with you
            <br />"{documentName}"
          </Trans>
        ) : (
          match({ selfSigner, organisationType, includeSenderDetails, teamName })
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
            ))
        )}
      </EmailHeading>

      <EmailButtonSection>
        <EmailButton href={signDocumentLink}>
          {match(role)
            .with(RecipientRole.SIGNER, () => <Trans>View and sign</Trans>)
            .with(RecipientRole.VIEWER, () => <Trans context="Viewer invite email CTA">View</Trans>)
            .with(RecipientRole.APPROVER, () => <Trans>View and approve</Trans>)
            .with(RecipientRole.CC, () => '')
            .with(RecipientRole.ASSISTANT, () => <Trans>View and assist</Trans>)
            .exhaustive()}
        </EmailButton>
      </EmailButtonSection>
    </>
  );
};

export default TemplateDocumentInvite;
