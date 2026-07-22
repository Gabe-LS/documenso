import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { EmailHeading, EmailLayout } from '../template-components/email-primitives';
import TemplateDocumentImage from '../template-components/template-document-image';

export type RecipientRemovedFromDocumentEmailTemplateProps = {
  inviterName?: string;
  documentName?: string;
  assetBaseUrl?: string;
  reportUrl?: string;
};

export const RecipientRemovedFromDocumentTemplate = ({
  inviterName = 'Lucas Smith',
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  reportUrl,
}: RecipientRemovedFromDocumentEmailTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`${inviterName} has removed you from the document ${documentName}.`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} reportUrl={reportUrl}>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        <Trans>
          {inviterName} has removed you from the document
          <br />"{documentName}"
        </Trans>
      </EmailHeading>
    </EmailLayout>
  );
};

export default RecipientRemovedFromDocumentTemplate;
