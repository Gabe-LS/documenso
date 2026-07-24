import { SUPPORT_EMAIL } from '@documenso/lib/constants/app';
import { Button } from '@documenso/ui/primitives/button';
import { Trans } from '@lingui/react/macro';
import { Link } from 'react-router';

export default function SignatureDisclosure() {
  return (
    <div>
      <article className="prose dark:prose-invert">
        <h1>
          <Trans>Electronic Signature Disclosure</Trans>
        </h1>

        <h2>
          <Trans context="Signature disclosure greeting">Welcome</Trans>
        </h2>
        <p>
          <Trans>
            This page explains in plain language how electronic signing works on this platform, its legal basis in the
            European Union and Italy, and your rights.
          </Trans>
        </p>

        <h2>
          <Trans>Signing Electronically</Trans>
        </h2>
        <p>
          <Trans>
            When you sign a document on this platform, you approve it digitally instead of on paper, and all related
            communications reach you by email.
          </Trans>
        </p>
        <p>
          <Trans>
            In the European Union, electronic signatures are governed by Regulation (EU) No 910/2014 (the 'eIDAS
            Regulation') and, in Italy, by the Digital Administration Code (Legislative Decree 82/2005).
          </Trans>
        </p>

        <h2>
          <Trans>Are Electronic Signatures Legally Valid?</Trans>
        </h2>
        <p>
          <Trans>
            The signature you apply through this platform is what EU law defines as an 'electronic signature', commonly
            called a 'simple electronic signature'. Opening the document does not sign it. The signature is applied only
            when, after filling in the required fields, you confirm the signing operation.
          </Trans>
        </p>
        <p>
          <Trans>
            Under Article 25(1) of the eIDAS Regulation, a simple electronic signature cannot be denied legal effect or
            admissibility as evidence solely because it is electronic or not qualified.
          </Trans>
        </p>
        <p>
          <Trans>Signatures of this kind are widely used across the EU for everyday commercial agreements.</Trans>
        </p>
        <p>
          <Trans>
            A 'qualified electronic signature', created with a qualified certificate and a qualified signature creation
            device, automatically has the same legal effect as a handwritten signature (Article 25(2) of the eIDAS
            Regulation).
          </Trans>
        </p>
        <p>
          <Trans>This platform, however, does not offer qualified signatures.</Trans>
        </p>
        <p>
          <Trans>
            For a simple electronic signature, a court assesses its evidential weight case by case under national law,
            based on the security and integrity of the signing process. To support that assessment, every completed
            document comes with a detailed record of the signing operations (audit trail) and is cryptographically
            sealed, so that later changes to the file can be detected. These records document the signing session linked
            to your email address and contribute, together with other available evidence, to attributing the signature.
          </Trans>
        </p>

        <h2>
          <Trans>What Signing Means</Trans>
        </h2>
        <p>
          <Trans>
            EU law requires Member States to allow contracts to be concluded electronically. Such contracts cannot be
            deprived of legal effect merely because they were concluded electronically (Directive 2000/31/EC, Article
            9(1)).
          </Trans>
        </p>
        <p>
          <Trans>
            Your signature expresses your acceptance of the document it is applied to. We therefore recommend reading it
            carefully before signing.
          </Trans>
        </p>

        <h2>
          <Trans>If You Have Second Thoughts</Trans>
        </h2>
        <p>
          <Trans>
            Before you confirm the final signing step, you can stop at any time. If you would rather sign in a different
            way, you can ask the sender whether an alternative is available. If you cannot reach the sender at the
            address that sent you the document, you can write to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            .
          </Trans>
        </p>

        <h2>
          <Trans>Personal Data</Trans>
        </h2>
        <p>
          <Trans>
            Personal data is a separate matter. Any consent required under data-protection law can be withdrawn as
            described in the applicable privacy notice, and withdrawing it does not cancel a signature you have already
            completed.
          </Trans>
        </p>

        <h2>
          <Trans>Keep a Copy of Your Documents</Trans>
        </h2>
        <p>
          <Trans>
            After signing, we recommend downloading and keeping the completed document. The completed document and its
            record of the signing operations (audit trail) also remain available on this platform for three years after
            completion. After that period, they may no longer be accessible online. The copy you keep is therefore your
            safest reference.
          </Trans>
        </p>

        <h2>
          <Trans>Your Confirmation</Trans>
        </h2>
        <p>
          <Trans>By proceeding to sign on this platform, you confirm that:</Trans>
        </p>
        <ul>
          <li>
            <Trans>this page was made available to you before signing and you had the opportunity to read it</Trans>
          </li>
          <li>
            <Trans>you choose to use the simple electronic signature described here</Trans>
          </li>
          <li>
            <Trans>you agree to receive documents and related communications electronically</Trans>
          </li>
        </ul>
        <p>
          <Trans>
            This page describes only the signing mechanism. It does not replace the contract you are signing, nor the
            sender's contractual or privacy notices.
          </Trans>
        </p>

        <h2>
          <Trans>Questions?</Trans>
        </h2>
        <p>
          <Trans>
            If you need further clarification about electronic signatures or the use of this platform, contact support
            at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
          </Trans>
        </p>
      </article>

      <div className="mt-8">
        <Button asChild>
          <Link to="/">
            <Trans>Back home</Trans>
          </Link>
        </Button>
      </div>
    </div>
  );
}
