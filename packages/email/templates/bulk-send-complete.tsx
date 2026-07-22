import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import {
  EmailBodyText,
  EmailHeading,
  EmailLayout,
  EmailList,
  EmailListItem,
  EmailSectionLabel,
} from '../template-components/email-primitives';

export interface BulkSendCompleteEmailProps {
  userName: string;
  templateName: string;
  totalProcessed: number;
  successCount: number;
  failedCount: number;
  errors: string[];
  assetBaseUrl?: string;
}

export const BulkSendCompleteEmail = ({
  userName,
  templateName,
  totalProcessed,
  successCount,
  failedCount,
  errors,
  assetBaseUrl = 'http://localhost:3002',
}: BulkSendCompleteEmailProps) => {
  const { _ } = useLingui();

  const previewText = msg`Bulk send operation complete for template "${templateName}"`;

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} isDocument={false}>
      <EmailHeading>
        <Trans>Bulk send complete</Trans>
      </EmailHeading>

      <EmailBodyText align="left" fullWidth>
        <Trans>Hi {userName},</Trans>
      </EmailBodyText>

      <EmailBodyText align="left" fullWidth>
        <Trans>Your bulk send operation for template "{templateName}" has completed.</Trans>
      </EmailBodyText>

      <EmailSectionLabel>
        <Trans>Summary:</Trans>
      </EmailSectionLabel>

      <EmailList>
        <EmailListItem>
          <Trans>Total rows processed: {totalProcessed}</Trans>
        </EmailListItem>
        <EmailListItem>
          <Trans>Successfully created: {successCount}</Trans>
        </EmailListItem>
        <EmailListItem>
          <Trans>Failed: {failedCount}</Trans>
        </EmailListItem>
      </EmailList>

      {errors && errors.length > 0 && (
        <>
          <EmailSectionLabel>
            <Trans>The following errors occurred:</Trans>
          </EmailSectionLabel>

          <EmailList>
            {errors.map((error, index) => (
              <EmailListItem key={index}>{error}</EmailListItem>
            ))}
          </EmailList>
        </>
      )}

      <EmailBodyText align="left" fullWidth>
        <Trans>
          You can view the created documents in your dashboard under the "Documents created from template" section.
        </Trans>
      </EmailBodyText>
    </EmailLayout>
  );
};
