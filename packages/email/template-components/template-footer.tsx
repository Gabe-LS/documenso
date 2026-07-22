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
        <Text className="my-4 text-[13px] text-muted-foreground">
          <Trans>
            Did not expect this email?{' '}
            <Link className="text-muted-foreground underline" href={reportUrl}>
              Click here to report the sender
            </Link>
            . Never sign a document you don't recognize or weren't expecting.
          </Trans>
        </Text>
      )}

      {branding.brandingEnabled && branding.brandingCompanyDetails && (
        <Text className="my-4 text-[13px] text-muted-foreground">
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
        <Text className="my-4 text-[13px] text-muted-foreground">
          <Link
            href={safeBrandingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground underline"
          >
            {safeBrandingUrl}
          </Link>
        </Text>
      )}

      {isDocument && !branding.brandingHidePoweredBy && (
        <Text className="my-4 text-center text-[12px] text-muted-foreground">
          <Trans>
            This document was sent using{' '}
            <Link className="text-muted-foreground underline" href="https://documen.so/mail-footer">
              Documenso
            </Link>
            .
          </Trans>
        </Text>
      )}

      {/*
        Upstream renders Documenso, Inc.'s San Francisco postal address here
        when branding is disabled. On a self-hosted instance that address
        belongs to a third party the recipient has no relationship with, so
        we render nothing instead. To show your own company details, enable
        branding in the organisation settings.
      */}
    </Section>
  );
};

export default TemplateFooter;
