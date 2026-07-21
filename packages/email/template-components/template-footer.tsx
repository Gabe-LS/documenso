import { Trans } from '@lingui/react/macro';
import { Fragment } from 'react';

import { Link, Section, Text } from '../components';
import { useBranding } from '../providers/branding';
import { getSafeBrandingUrl } from '../utils/branding-url';

export type TemplateFooterProps = {
  isDocument?: boolean;
  reportUrl?: string;
};

export const TemplateFooter = ({ isDocument = true, reportUrl }: TemplateFooterProps) => {
  const branding = useBranding();

  const safeBrandingUrl = branding.brandingEnabled ? getSafeBrandingUrl(branding.brandingUrl) : null;

  return (
    <Section>
      {reportUrl && (
        <Text className="my-2 text-muted-foreground text-sm">
          <Trans>
            Did not expect this email?{' '}
            <Link className="text-foreground underline" href={reportUrl}>
              Click here to report the sender
            </Link>
            . Never sign a document you don't recognize or weren't expecting.
          </Trans>
        </Text>
      )}

      {isDocument && !branding.brandingHidePoweredBy && (
        <Text className="my-2 text-muted-foreground text-sm">
          <Trans>
            This document was sent using{' '}
            <Link className="text-foreground underline" href="https://documen.so/mail-footer">
              Documenso
            </Link>
            .
          </Trans>
        </Text>
      )}

      {branding.brandingEnabled && branding.brandingCompanyDetails && (
        <Text className="mt-4 mb-2 text-muted-foreground text-xs">
          {branding.brandingCompanyDetails.split('\n').map((line, idx) => {
            return (
              <Fragment key={idx}>
                {idx > 0 && <br />}
                {line}
              </Fragment>
            );
          })}
        </Text>
      )}

      {branding.brandingEnabled && safeBrandingUrl && (
        <Text className="mt-2 mb-4 text-muted-foreground text-xs">
          <Link href={safeBrandingUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {safeBrandingUrl}
          </Link>
        </Text>
      )}

      {!branding.brandingEnabled && (
        <Text className="mt-4 mb-6 text-muted-foreground text-xs">
          Documenso, Inc.
          <br />
          2261 Market Street, #5211, San Francisco, CA 94114, USA
        </Text>
      )}
    </Section>
  );
};

export default TemplateFooter;
