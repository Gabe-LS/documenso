import { Plural, Trans } from '@lingui/react/macro';

import { Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';

export type TemplateAccessAuth2FAProps = {
  documentTitle: string;
  code: string;
  userEmail: string;
  userName: string;
  expiresInMinutes: number;
  assetBaseUrl?: string;
};

export const TemplateAccessAuth2FA = ({
  documentTitle,
  code,
  userName,
  expiresInMinutes,
  assetBaseUrl = 'http://localhost:3002',
}: TemplateAccessAuth2FAProps) => {
  return (
    <div>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section className="mt-8">
        <Text className="mx-auto mb-0 text-center font-semibold text-foreground text-lg">
          <Trans>Verification Code Required</Trans>
        </Text>

        <Text className="mt-2 text-center text-foreground">
          <Trans>
            Hi {userName}, you need to enter a verification code to complete the document "{documentTitle}".
          </Trans>
        </Text>

        <Section className="mt-6 rounded-lg bg-muted p-6 text-center">
          <Text className="mb-2 font-medium text-muted-foreground text-sm">
            <Trans>Your verification code:</Trans>
          </Text>
          <Text className="font-bold text-2xl text-foreground tracking-wider">{code}</Text>
        </Section>

        <Text className="mt-4 text-center text-muted-foreground text-sm">
          <Plural
            value={expiresInMinutes}
            one="This code will expire in # minute."
            other="This code will expire in # minutes."
          />
        </Text>

        <Text className="mt-4 text-center text-muted-foreground text-sm">
          <Trans>If you didn't request this verification code, you can safely ignore this email.</Trans>
        </Text>
      </Section>
    </div>
  );
};
