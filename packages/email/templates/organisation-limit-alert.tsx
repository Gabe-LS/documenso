import { SUPPORT_EMAIL } from '@documenso/lib/constants/app';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { match } from 'ts-pattern';

import { Link } from '../components';
import { EmailBodyText, EmailHeading, EmailLayout, EmailPill } from '../template-components/email-primitives';

export type OrganisationLimitAlertEmailProps = {
  assetBaseUrl: string;
  organisationName: string;
  counter: 'document' | 'email' | 'api';
  kind: 'rateLimit' | 'quota' | 'quotaNearing';
  period: string;
};

export const OrganisationLimitAlertEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  organisationName = 'Organisation Name',
  counter = 'email',
  kind = 'quota',
  period = '2026-05',
}: OrganisationLimitAlertEmailProps) => {
  const { _ } = useLingui();

  const previewText = match(kind)
    .with('quota', () =>
      match(counter)
        .with('document', () => msg`You've exceeded your plan's document limit`)
        .with('email', () => msg`Your plan's email limit has been exceeded`)
        .with('api', () => msg`You've exceeded your plan's API request limit`)
        .exhaustive(),
    )
    .with('rateLimit', () =>
      match(counter)
        .with('document', () => msg`Document creation is temporarily throttled`)
        .with('email', () => msg`Email sending is temporarily throttled`)
        .with('api', () => msg`API requests are temporarily throttled`)
        .exhaustive(),
    )
    .with('quotaNearing', () =>
      match(counter)
        .with('document', () => msg`You're approaching your plan's document limit`)
        .with('email', () => msg`You're approaching your plan's email limit`)
        .with('api', () => msg`You're approaching your plan's API request limit`)
        .exhaustive(),
    )
    .exhaustive();

  return (
    <EmailLayout assetBaseUrl={assetBaseUrl} preview={_(previewText)} isDocument={false}>
      <EmailHeading>
        {kind === 'quotaNearing' ? (
          <Trans>Approaching Your Plan Limits</Trans>
        ) : (
          <Trans>Organisation Review Required</Trans>
        )}
      </EmailHeading>

      <EmailPill>{organisationName}</EmailPill>

      {match(kind)
        .with('quota', () => (
          <EmailBodyText>
            {match(counter)
              .with('document', () => (
                <Trans>
                  We've noticed document activity on your account that exceeds the fair use limits of your current plan.
                  As a precaution, new document activity has been temporarily paused pending review.
                </Trans>
              ))
              .with('email', () => (
                <Trans>
                  We've noticed email sending activity on your account that exceeds the fair use limits of your current
                  plan. As a precaution, new email activity has been temporarily paused pending review.
                </Trans>
              ))
              .with('api', () => (
                <Trans>
                  We've noticed API activity on your account that exceeds the fair use limits of your current plan. As a
                  precaution, new API activity has been temporarily paused pending review.
                </Trans>
              ))
              .exhaustive()}
          </EmailBodyText>
        ))
        .with('rateLimit', () => (
          <EmailBodyText>
            {match(counter)
              .with('document', () => (
                <Trans>
                  Your organisation is generating documents faster than normal, so some requests are being temporarily
                  throttled.
                </Trans>
              ))
              .with('email', () => (
                <Trans>
                  Your organisation is generating emails faster than normal, so some requests are being temporarily
                  throttled.
                </Trans>
              ))
              .with('api', () => (
                <Trans>
                  Your organisation is generating API requests faster than normal, so some requests are being
                  temporarily throttled.
                </Trans>
              ))
              .exhaustive()}
          </EmailBodyText>
        ))
        .with('quotaNearing', () => (
          <EmailBodyText>
            {match(counter)
              .with('document', () => (
                <Trans>
                  Your organisation is nearing its fair use limits for creating documents on your current plan. Once the
                  limit is reached, new document activity will be temporarily paused.
                </Trans>
              ))
              .with('email', () => (
                <Trans>
                  Your organisation is nearing its fair use limits for sending email on your current plan. Once the
                  limit is reached, new email activity will be temporarily paused.
                </Trans>
              ))
              .with('api', () => (
                <Trans>
                  Your organisation is nearing its fair use limits for making API requests on your current plan. Once
                  the limit is reached, new API activity will be temporarily paused.
                </Trans>
              ))
              .exhaustive()}
          </EmailBodyText>
        ))
        .exhaustive()}

      <EmailBodyText>
        {kind === 'quotaNearing' ? (
          <Trans>
            If you expect to need higher limits, please contact support at{' '}
            <Link className="text-foreground underline" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </Link>{' '}
            and we will review your account.
          </Trans>
        ) : (
          <Trans>
            Please contact support at{' '}
            <Link className="text-foreground underline" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </Link>{' '}
            and we will review your account.
          </Trans>
        )}
      </EmailBodyText>
    </EmailLayout>
  );
};

export default OrganisationLimitAlertEmailTemplate;
