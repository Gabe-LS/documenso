import { RECIPIENT_ROLES_DESCRIPTION } from '@documenso/lib/constants/recipient-roles';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { RecipientRole } from '@prisma/client';
import { match } from 'ts-pattern';

import { EmailButton, EmailButtonSection, EmailHeading } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentReminderProps {
  recipientName: string;
  documentName: string;
  signDocumentLink: string;
  assetBaseUrl: string;
  role: RecipientRole;
  inviterName: string;
}

export const TemplateDocumentReminder = ({
  recipientName,
  documentName,
  signDocumentLink,
  assetBaseUrl,
  role,
  inviterName,
}: TemplateDocumentReminderProps) => {
  const { _ } = useLingui();

  const { actionVerb } = RECIPIENT_ROLES_DESCRIPTION[role];
  const action = _(actionVerb).toLowerCase();

  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        <Trans>
          Reminder: {inviterName} has asked you to {action} "{documentName}"
        </Trans>
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

export default TemplateDocumentReminder;
