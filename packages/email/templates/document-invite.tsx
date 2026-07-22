import { RECIPIENT_ROLES_DESCRIPTION } from '@documenso/lib/constants/recipient-roles';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import type { RecipientRole } from '@prisma/client';
import { OrganisationType } from '@prisma/client';

import { Link } from '../components';
import { EmailBodyText, EmailLayout } from '../template-components/email-primitives';
import { TemplateCustomMessageBody } from '../template-components/template-custom-message-body';
import type { TemplateDocumentInviteProps } from '../template-components/template-document-invite';
import { TemplateDocumentInvite } from '../template-components/template-document-invite';

export type DocumentInviteEmailTemplateProps = Partial<TemplateDocumentInviteProps> & {
  customBody?: string;
  role: RecipientRole;
  selfSigner?: boolean;
  teamName?: string;
  teamEmail?: string;
  includeSenderDetails?: boolean;
  organisationType?: OrganisationType;
  reportUrl?: string;
};

export const DocumentInviteEmailTemplate = ({
  inviterName = 'Lucas Smith',
  inviterEmail = 'lucas@documenso.com',
  documentName = 'Open Source Pledge.pdf',
  signDocumentLink = 'https://documenso.com',
  assetBaseUrl = 'http://localhost:3002',
  customBody,
  role,
  selfSigner = false,
  teamName = '',
  includeSenderDetails,
  organisationType,
  reportUrl,
}: DocumentInviteEmailTemplateProps) => {
  const { _ } = useLingui();

  const action = _(RECIPIENT_ROLES_DESCRIPTION[role].actionVerb).toLowerCase();

  let previewText = msg`${inviterName} has invited you to ${action} ${documentName}`;

  if (organisationType === OrganisationType.ORGANISATION) {
    previewText = includeSenderDetails
      ? msg`${inviterName} on behalf of "${teamName}" has invited you to ${action} ${documentName}`
      : msg`${teamName} has invited you to ${action} ${documentName}`;
  }

  if (selfSigner) {
    previewText = msg`Please ${action} your document ${documentName}`;
  }

  return (
    <EmailLayout
      assetBaseUrl={assetBaseUrl}
      preview={_(previewText)}
      reportUrl={reportUrl}
      secondaryContent={
        <>
          {organisationType === OrganisationType.PERSONAL && (
            <EmailBodyText align="left" fullWidth className="font-semibold">
              <Trans>
                {inviterName}{' '}
                <Link className="font-normal text-foreground underline" href={`mailto:${inviterEmail}`}>
                  ({inviterEmail})
                </Link>
              </Trans>
            </EmailBodyText>
          )}

          <EmailBodyText align="left" fullWidth>
            {customBody ? (
              <TemplateCustomMessageBody text={customBody} />
            ) : (
              <Trans>
                {inviterName} has invited you to {action} the document "{documentName}".
              </Trans>
            )}
          </EmailBodyText>
        </>
      }
    >
      <TemplateDocumentInvite
        inviterName={inviterName}
        inviterEmail={inviterEmail}
        documentName={documentName}
        signDocumentLink={signDocumentLink}
        assetBaseUrl={assetBaseUrl}
        role={role}
        selfSigner={selfSigner}
        organisationType={organisationType}
        teamName={teamName}
        includeSenderDetails={includeSenderDetails}
      />
    </EmailLayout>
  );
};

export default DocumentInviteEmailTemplate;
