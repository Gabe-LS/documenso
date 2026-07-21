import { Trans } from '@lingui/react/macro';

import { Container, Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';

interface TemplateDocumentRejectionConfirmedProps {
  recipientName: string;
  documentName: string;
  documentOwnerName: string;
  reason?: string;
  assetBaseUrl?: string;
}

export function TemplateDocumentRejectionConfirmed({
  recipientName,
  documentName,
  documentOwnerName,
  reason,
  assetBaseUrl = 'http://localhost:3002',
}: TemplateDocumentRejectionConfirmedProps) {
  return (
    <Container>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section>
        <Text className="mb-0 text-center font-semibold text-foreground text-lg">
          <Trans>Rejection Confirmed</Trans>
        </Text>

        <Text className="text-base text-foreground">
          <Trans>
            This email confirms that you have rejected the document{' '}
            <strong className="font-bold">"{documentName}"</strong> sent by {documentOwnerName}.
          </Trans>
        </Text>

        {reason && (
          <Text className="mt-4 text-center text-base text-muted-foreground italic">
            <Trans>Rejection reason: {reason}</Trans>
          </Text>
        )}

        <Text className="text-base">
          <Trans>
            The document owner has been notified of this rejection. No further action is required from you at this time.
            The document owner may contact you with any questions regarding this rejection.
          </Trans>
        </Text>
      </Section>
    </Container>
  );
}
