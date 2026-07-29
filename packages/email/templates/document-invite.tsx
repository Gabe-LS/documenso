import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { OrganisationType, RecipientRole } from '@prisma/client';
import { match } from 'ts-pattern';

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

  // Role-aware: a viewer never signs and an approver approves rather than signs,
  // so a single preview would assert the wrong action for three of four roles.
  const previewText = match(role)
    .with(RecipientRole.APPROVER, () => msg`Approve or reject the document`)
    .with(RecipientRole.VIEWER, () => msg`View the document`)
    .with(RecipientRole.ASSISTANT, () => msg`Fill out the document`)
    .otherwise(() => msg`View and sign the document`);

  return (
    <EmailLayout
      assetBaseUrl={assetBaseUrl}
      preview={_(previewText)}
      reportUrl={reportUrl}
      secondaryContent={
        (organisationType === OrganisationType.PERSONAL || customBody) && (
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

            {customBody && <TemplateCustomMessageBody text={customBody} />}
          </>
        )
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
