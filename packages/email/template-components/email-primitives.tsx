import { Children, type CSSProperties, type ReactNode } from 'react';

import { Body, Button, Column, Container, Hr, Html, Img, Preview, Section, Text } from '../components';
import { TemplateBrandingLogo } from './template-branding-logo';
import { TemplateEmailHead } from './template-email-head';
import { TemplateFooter } from './template-footer';

/**
 * Email design system — every template is built from these primitives.
 *
 * This is the ONLY place the shared visual language (skeleton, heading,
 * body copy, buttons, callouts, pills, fine print) is declared. Changing a
 * font size, colour, width, or margin for every email means editing exactly
 * one file: this one.
 *
 * --- Text colour palette (exactly three text colours, no more) ---
 *
 * Roles are assigned by HIERARCHY, not by component identity: `text-foreground`
 * marks the things a reader's eye should land on first; `text-muted-foreground`
 * marks everything that supports those anchors; `text-primary-foreground` is a
 * contrast utility, not a hierarchy tier.
 *
 * 1. `text-foreground` — hierarchy anchors: the headline (`EmailHeading`),
 *    inline links (paired with `underline` — a link is always something to
 *    act on, so it reads as an anchor even mid-sentence), the `outline`
 *    button's label (an action a reader must be able to find), and the 2FA
 *    verification code (`EmailCodeBox`) — the single piece of data the email
 *    exists to deliver. Reserved for things a reader should notice first or
 *    is expected to act on.
 * 2. `text-muted-foreground` — supporting copy and de-emphasized actions:
 *    body text (`EmailBodyText`), callouts (`EmailCallout`), pills
 *    (`EmailPill`), fine print (`EmailFinePrint`), list items (`EmailList`),
 *    the footer (including its `text-xs` address line), the `muted` button
 *    variant's label, and the `EmailCodeBox` label slot. The `muted` button
 *    variant is deliberately gray even though it's clickable: it's used for
 *    secondary/negative actions (e.g. "Decline") that should never compete
 *    visually with the primary action — de-emphasis is the point, not an
 *    oversight. Likewise the bulk-send error list is gray rather than red:
 *    this system has no "error" text colour (see below), so the fact that an
 *    entry is an error is carried by the surrounding wording ("The following
 *    errors occurred:"), not by tinting the text.
 * 3. `text-primary-foreground` — ONLY the label text inside the primary
 *    (`bg-primary`) button variant. It exists purely for contrast against
 *    the button's solid background and must never appear as free-standing
 *    text.
 *
 * Status/emotion (rejected, expired, alert, error) is conveyed through
 * imagery (the red/green icon set) and wording, never through a fourth text
 * colour — there is no `text-destructive`, `text-warning`, or similar in any
 * template. If you're tempted to reach for one, that's a signal the copy or
 * the icon should carry the meaning instead. Any deviation from these three
 * colours found outside this file is a bug, not a style choice.
 */

const cn = (...classes: Array<string | undefined | false | null>) => classes.filter(Boolean).join(' ');

/**
 * `text-wrap: balance` on centered text so multi-line headings and centered
 * paragraphs wrap into visually even lines instead of leaving a short
 * orphan line. Progressive enhancement: clients that don't understand it
 * (Outlook, older Gmail) simply ignore the declaration.
 */
const BALANCED_TEXT_STYLE: CSSProperties = { textWrap: 'balance' };

export type EmailLayoutProps = {
  assetBaseUrl: string;
  preview: string;
  children: ReactNode;
  isDocument?: boolean;
  reportUrl?: string;
  /**
   * Secondary, unbordered content rendered BELOW the main bordered card but
   * above the footer divider — e.g. sender identity lines, custom message
   * bodies, or "didn't request this" notes. Falsy values (e.g.
   * `customBody && <...>`) render nothing, matching the original
   * conditionally-rendered second container.
   */
  secondaryContent?: ReactNode;
};

/**
 * The canonical skeleton every email renders through: `<Html>` → head →
 * `<Body>` → preview text → bordered content container (with the branding
 * logo) → `{children}` → optional secondary container → divider → footer
 * container.
 */
export const EmailLayout = ({
  assetBaseUrl,
  preview,
  children,
  isDocument,
  reportUrl,
  secondaryContent,
}: EmailLayoutProps) => {
  return (
    <Html>
      <TemplateEmailHead />

      <Body className="mx-auto my-auto bg-background font-sans">
        <Preview>{preview}</Preview>

        <Section>
          <Container className="mx-auto mt-8 mb-2 max-w-2xl rounded-lg border border-border border-solid p-6">
            <TemplateBrandingLogo assetBaseUrl={assetBaseUrl} className="mb-4 h-6" />

            {children}
          </Container>

          {secondaryContent && <Container className="mx-auto mt-12 max-w-2xl">{secondaryContent}</Container>}

          <Hr className="mx-auto mt-8 max-w-2xl" />

          <Container className="mx-auto max-w-2xl">
            <TemplateFooter isDocument={isDocument} reportUrl={reportUrl} />
          </Container>
        </Section>
      </Body>
    </Html>
  );
};

export type EmailHeadingProps = {
  children: ReactNode;
  className?: string;
  /** Text alignment. Defaults to `center`, matching the main card's headline. */
  align?: 'center' | 'left';
};

/**
 * The single headline of an email. Every template's main heading goes
 * through this component.
 */
export const EmailHeading = ({ children, className, align = 'center' }: EmailHeadingProps) => {
  return (
    <Text
      className={cn(
        'mx-auto mb-0 max-w-[80%] break-words font-semibold text-foreground text-lg',
        align === 'center' ? 'text-center' : 'text-left',
        className,
      )}
      style={align === 'center' ? BALANCED_TEXT_STYLE : undefined}
    >
      {children}
    </Text>
  );
};

export type EmailBodyTextProps = {
  children: ReactNode;
  className?: string;
  /** Text alignment. Defaults to `center`, matching the main card's copy. */
  align?: 'center' | 'left';
  /**
   * When `false` (default), the paragraph is boxed to `mx-auto max-w-[80%]`
   * like the rest of the centered card copy. Set `true` to drop the
   * max-width for full-bleed left-aligned paragraphs (e.g. secondary
   * content, long-form notices).
   */
  fullWidth?: boolean;
};

/**
 * Canonical body-copy classes ("text-base text-muted-foreground") shared by
 * `EmailBodyText` and `TemplateCustomMessageBody` — the two places that
 * render freeform paragraph copy. Keep this the single source of truth so
 * the two never drift apart.
 */
export const EMAIL_BODY_TEXT_CLASSES = 'text-base text-muted-foreground';

/**
 * Standard body copy paragraph.
 */
export const EmailBodyText = ({ children, className, align = 'center', fullWidth = false }: EmailBodyTextProps) => {
  return (
    <Text
      className={cn(
        'my-1 break-words',
        EMAIL_BODY_TEXT_CLASSES,
        align === 'center' ? 'text-center' : 'text-left',
        !fullWidth && 'mx-auto max-w-[80%]',
        className,
      )}
      style={align === 'center' ? BALANCED_TEXT_STYLE : undefined}
    >
      {children}
    </Text>
  );
};

export type EmailCalloutProps = {
  children: ReactNode;
  /** Text alignment. Defaults to `center`, matching the main card's copy. */
  align?: 'center' | 'left';
};

/**
 * Muted, italic aside used for things like "Reason: ..." quotes.
 */
export const EmailCallout = ({ children, align = 'center' }: EmailCalloutProps) => {
  return (
    <Text
      className={cn(
        'mt-4 text-base text-muted-foreground italic',
        align === 'center' ? 'text-center' : 'text-left',
      )}
      style={align === 'center' ? BALANCED_TEXT_STYLE : undefined}
    >
      {children}
    </Text>
  );
};

export type EmailSectionLabelProps = {
  children: ReactNode;
  className?: string;
  /**
   * Text alignment. Defaults to `left` — a section label sits among
   * left-aligned supporting copy, not the card's single centered headline.
   */
  align?: 'center' | 'left';
};

/**
 * A mid-email section divider label (e.g. "Summary:", "The following errors
 * occurred:") that introduces a subsection of body copy. Visually smaller
 * than `EmailHeading` and NOT a substitute for it: an email has exactly one
 * `EmailHeading` — its single headline — while `EmailSectionLabel` marks
 * internal subsections within that email's body copy.
 */
export const EmailSectionLabel = ({ children, className, align = 'left' }: EmailSectionLabelProps) => {
  return (
    <Text
      className={cn(
        'mt-4 mb-1 font-semibold text-base text-foreground',
        align === 'center' ? 'text-center' : 'text-left',
        className,
      )}
    >
      {children}
    </Text>
  );
};

export type EmailButtonVariant = 'primary' | 'outline' | 'muted';

const EMAIL_BUTTON_VARIANT_CLASSES: Record<EmailButtonVariant, string> = {
  primary: 'rounded-lg bg-primary px-6 py-3 text-center font-medium text-primary-foreground text-sm no-underline',
  outline:
    'rounded-lg border border-border border-solid px-4 py-2 text-center font-medium text-foreground text-sm no-underline',
  muted: 'rounded-lg bg-muted px-6 py-3 text-center font-medium text-muted-foreground text-sm no-underline',
};

export type EmailButtonProps = {
  href: string;
  children: ReactNode;
  variant?: EmailButtonVariant;
  className?: string;
  /** Optional inline icon rendered before the label (e.g. a download glyph). */
  iconSrc?: string;
  iconAlt?: string;
  /** Width/height in px for the icon. Defaults to 20 (h-5 w-5). */
  iconSize?: number;
};

/**
 * The only place a `<Button>`'s classes are declared. `variant` picks which
 * of the three canonical button looks to render.
 */
export const EmailButton = ({
  href,
  children,
  variant = 'primary',
  className,
  iconSrc,
  iconAlt = '',
  iconSize = 20,
}: EmailButtonProps) => {
  return (
    <Button href={href} className={cn(EMAIL_BUTTON_VARIANT_CLASSES[variant], className)}>
      {iconSrc && (
        <Img src={iconSrc} alt={iconAlt} width={iconSize} height={iconSize} className="mr-2 inline align-middle" />
      )}
      {children}
    </Button>
  );
};

export type EmailButtonSectionProps = {
  children: ReactNode;
};

/**
 * Wraps one or more `EmailButton`s with the canonical spacing/centering. When
 * given multiple buttons (a "group"), each is wrapped in an inline-block span
 * with horizontal spacing so the row is spaced by the primitive — no call
 * site should add its own `ml-*`/`mr-*` between buttons.
 */
export const EmailButtonSection = ({ children }: EmailButtonSectionProps) => {
  const items = Children.toArray(children).filter(Boolean);

  return (
    <Section className="mt-8 mb-6 text-center">
      {items.length > 1
        ? items.map((child, index) => (
            <span key={index} className="mx-2 inline-block">
              {child}
            </span>
          ))
        : children}
    </Section>
  );
};

export type EmailPillProps = {
  children: ReactNode;
};

/**
 * The rounded "pill" used to call out a single value (an org name, a team
 * URL, a document name, ...).
 */
export const EmailPill = ({ children }: EmailPillProps) => {
  return (
    <div className="mx-auto my-2 inline-block break-words rounded-lg bg-muted px-4 py-2 text-center font-medium text-base text-muted-foreground">
      {children}
    </div>
  );
};

export type EmailFinePrintProps = {
  children: ReactNode;
  /**
   * Set `true` when the content is a raw, unbroken token like a URL — swaps
   * in `break-all` instead of the default word wrapping so a long link
   * breaks mid-word rather than overflowing the card.
   */
  breakAll?: boolean;
};

/**
 * Small, muted print below the main content (e.g. "Link expires in ...").
 */
export const EmailFinePrint = ({ children, breakAll = false }: EmailFinePrintProps) => {
  return (
    <Text className={cn('mt-4 text-center text-muted-foreground text-sm', breakAll && 'break-all')}>{children}</Text>
  );
};

export type EmailIconLabelProps = {
  assetBaseUrl: string;
  /** Static asset filename under `/static/`, e.g. "completed.png". */
  icon: string;
  children: ReactNode;
};

/**
 * The small centered "icon + label" status row used above a document's main
 * heading (e.g. a checkmark next to "Completed", a clock next to "Waiting
 * for others"). One canonical copy instead of four near-identical ones.
 */
export const EmailIconLabel = ({ assetBaseUrl, icon, children }: EmailIconLabelProps) => {
  const iconUrl = new URL(`/static/${icon}`, assetBaseUrl).toString();

  return (
    <Section className="mb-4">
      <Column align="center">
        <Text className="font-semibold text-base text-muted-foreground">
          <Img src={iconUrl} className="-mt-0.5 mr-2 inline h-7 w-7 align-middle" alt="" width={28} height={28} />
          {children}
        </Text>
      </Column>
    </Section>
  );
};

export type EmailListProps = {
  children: ReactNode;
};

/**
 * Canonical bulleted list used for enumerable copy (permissions granted,
 * per-row results, ...). Pair with `EmailListItem` — no template should
 * render a raw `<ul>`/`<li>`.
 */
export const EmailList = ({ children }: EmailListProps) => {
  return <ul className="my-2 list-inside list-disc pl-6 text-left">{children}</ul>;
};

export type EmailListItemProps = {
  children: ReactNode;
};

export const EmailListItem = ({ children }: EmailListItemProps) => {
  return <li className="mt-1 text-muted-foreground text-sm">{children}</li>;
};

export type EmailCodeBoxProps = {
  /** The label shown above the code, e.g. "Your verification code:". */
  label: ReactNode;
  /** The code itself. */
  children: ReactNode;
};

/**
 * The verification-code display: a muted rounded box with a small label and
 * a large code line. `text-2xl` is deliberate here — unlike body copy, this
 * is a code a reader has to read and re-type, often across the room from
 * their screen or from a second device, so it's sized for display legibility
 * rather than as running text. It's still comfortably above the 12px floor.
 * The code uses `text-foreground`: it's the email's primary content, not
 * supporting copy, so it gets the "hierarchy anchor" colour rather than the
 * muted one.
 */
export const EmailCodeBox = ({ label, children }: EmailCodeBoxProps) => {
  return (
    <Section className="mt-6 rounded-lg bg-muted p-6 text-center">
      <Text className="mb-2 font-medium text-muted-foreground text-sm">{label}</Text>
      <Text className="font-bold text-2xl text-foreground tracking-wider">{children}</Text>
    </Section>
  );
};
