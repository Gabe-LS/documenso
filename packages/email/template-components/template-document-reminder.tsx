import { RECIPIENT_ROLES_DESCRIPTION } from '@documenso/lib/constants/recipient-roles';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { RecipientRole } from '@prisma/client';
import { match } from 'ts-pattern';

import { EmailBodyText, EmailButton, EmailButtonSection, EmailHeading } from './email-primitives';
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

      <EmailBodyText>
        <Trans>Hi {recipientName},</Trans>
      </EmailBodyText>

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
            .with(RecipientRole.SIGNER, () => <Trans>Sign Document</Trans>)
            .with(RecipientRole.VIEWER, () => <Trans>View Document</Trans>)
            .with(RecipientRole.APPROVER, () => <Trans>Approve Document</Trans>)
            .with(RecipientRole.CC, () => '')
            .with(RecipientRole.ASSISTANT, () => <Trans>Assist Document</Trans>)
            .exhaustive()}
        </EmailButton>
      </EmailButtonSection>
    </>
  );
};

export default TemplateDocumentReminder;
