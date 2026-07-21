import { Trans } from '@lingui/react/macro';

import { Button, Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentRejectedProps {
  documentName: string;
  recipientName: string;
  rejectionReason?: string;
  documentUrl: string;
  assetBaseUrl?: string;
}

export function TemplateDocumentRejected({
  documentName,
  recipientName: signerName,
  rejectionReason,
  documentUrl,
  assetBaseUrl = 'http://localhost:3002',
}: TemplateDocumentRejectedProps) {
  return (
    <div className="mt-4">
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Text className="mb-0 text-center font-semibold text-foreground text-lg">
        <Trans>Document Rejected</Trans>
      </Text>

      <Text className="mb-4 text-base">
        <Trans>
          {signerName} has rejected the document "{documentName}".
        </Trans>
      </Text>

      {rejectionReason && (
        <Text className="mt-4 text-center text-base text-muted-foreground italic">
          <Trans>Reason for rejection: {rejectionReason}</Trans>
        </Text>
      )}

      <Text className="mb-6 text-base">
        <Trans>You can view the document and its status by clicking the button below.</Trans>
      </Text>

      <Section className="mt-8 mb-6 text-center">
        <Button
          href={documentUrl}
          className="rounded-lg bg-primary px-6 py-3 text-center font-medium text-primary-foreground text-sm no-underline"
        >
          <Trans>View Document</Trans>
        </Button>
      </Section>
    </div>
  );
}
