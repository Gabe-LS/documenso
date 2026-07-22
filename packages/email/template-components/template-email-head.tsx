import { Font, Head } from '../components';

/**
 * The single source of truth for the email font stack. `TemplateEmailHead`
 * declares it to the email client via `<Font>`, and `render.tsx` extends the
 * Tailwind theme's `fontFamily.sans` with the same array so that `font-sans`
 * (used on `<Body>`) resolves to this exact stack. Change the font by
 * editing this one constant.
 */
export const EMAIL_FONT_STACK = ['Inter', 'Helvetica', 'Arial', 'sans-serif'] as const;

/**
 * Shared `<Head>` for every email template.
 *
 * - Pins the colour scheme to light so Gmail/Apple Mail/Outlook dark-mode
 *   "smart" recolouring doesn't invert our explicit brand colours.
 * - Declares a font fallback stack. No `webFont` is configured (most clients
 *   don't support `@font-face` in email anyway), so this simply hints at
 *   "Inter" for clients that have it locally and falls back to system fonts.
 */
export const TemplateEmailHead = () => {
  const [fontFamily, ...fallbackFontFamily] = EMAIL_FONT_STACK;

  return (
    <Head>
      <meta name="color-scheme" content="light" />
      <meta name="supported-color-schemes" content="light" />

      <Font fontFamily={fontFamily} fallbackFontFamily={[...fallbackFontFamily]} />
    </Head>
  );
};

export default TemplateEmailHead;
