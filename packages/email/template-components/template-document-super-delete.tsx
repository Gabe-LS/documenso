import { Trans } from '@lingui/react/macro';

import { EmailBodyText, EmailCallout, EmailHeading } from './email-primitives';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentDeleteProps {
  reason: string;
  documentName: string;
  assetBaseUrl: string;
}

export const TemplateDocumentDelete = ({ reason, documentName, assetBaseUrl }: TemplateDocumentDeleteProps) => {
  return (
    <>
      <TemplateDocumentImage assetBaseUrl={assetBaseUrl} />

      <EmailHeading>
        <Trans>Your document has been deleted by an admin!</Trans>
      </EmailHeading>

      <EmailBodyText align="left" fullWidth>
        <Trans>"{documentName}" has been deleted by an admin.</Trans>
      </EmailBodyText>

      <EmailBodyText align="left" fullWidth>
        <Trans>
          This document can not be recovered, if you would like to dispute the reason for future documents please
          contact support.
        </Trans>
      </EmailBodyText>

      <EmailBodyText align="left" fullWidth>
        <Trans>The reason provided for deletion is the following:</Trans>
      </EmailBodyText>

      <EmailCallout align="left">{reason}</EmailCallout>
    </>
  );
};

export default TemplateDocumentDelete;
