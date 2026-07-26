import { cn } from '@documenso/ui/lib/utils';

import { Trans } from '@lingui/react/macro';
import type { HTMLAttributes } from 'react';
import { Link } from 'react-router';

export type DocumentSigningDisclosureProps = HTMLAttributes<HTMLParagraphElement>;

export const DocumentSigningDisclosure = ({ className, ...props }: DocumentSigningDisclosureProps) => {
  return (
    <p className={cn('text-muted-foreground text-xs', className)} {...props}>
      <Trans>
        By proceeding, you consent to the use of your electronic signature to sign this document and acknowledge that
        the operation has legal effect and is binding on you. By completing it, you confirm that you have understood and
        accepted these conditions.
      </Trans>
      <span className="mt-2 block">
        <Trans>
          Read the full{' '}
          <Link className="text-documenso-700 underline" to="/articles/signature-disclosure" target="_blank">
            signature disclosure
          </Link>
          .
        </Trans>
      </span>
    </p>
  );
};
