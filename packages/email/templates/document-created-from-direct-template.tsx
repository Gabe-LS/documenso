import { RECIPIENT_ROLES_DESCRIPTION } from '@documenso/lib/constants/recipient-roles';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { RecipientRole } from '@prisma/client';

import {
  EmailButton,
  EmailButtonSection,
  EmailHeading,
  EmailLayout,
  EmailPill,
} from '../template-components/email-primitives';
import TemplateDocumentImage from '../template-components/template-document-image';

export type DocumentCreatedFromDirectTemplateEmailTemplateProps = {
  recipientName?: string;
  recipientRole?: RecipientRole;
  documentLink?: string;
  documentName?: string;
  assetBaseUrl?: string;
  reportUrl?: string;
};

export const DocumentCreatedFromDirectTemplateEmailTemplate = ({
  recipientName = 'John Doe',
  recipientRole = RecipientRole.SIGNER,
  documentLink = 'http://localhost:3000',
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  reportUrl,
}: DocumentCreatedFromDirectTemplateEmailTemplateProps) => {
  const { _ } = useLingui();

  const action = _(RECIPIENT_ROLES_DESCRIPTION[recipientRole].actioned).toLowerCase();

  const previewText = msg`Document created from direct template`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} reportUrl={reportUrl}>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        <Trans>
          {recipientName} {action} a document by using one of your direct links
        </Trans>
      </EmailHeading>

      <EmailPill>{documentName}</EmailPill>

      <EmailButtonSection>
        <EmailButton href={documentLink}>
          <Trans>View document</Trans>
        </EmailButton>
      </EmailButtonSection>
    </EmailLayout>
  );
};

export default DocumentCreatedFromDirectTemplateEmailTemplate;
