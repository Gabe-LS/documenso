import { Font, Head } from '../components';

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
  return (
    <Head>
      <meta name="color-scheme" content="light" />
      <meta name="supported-color-schemes" content="light" />

      <Font
        fontFamily="Inter"
        fallbackFontFamily={['Helvetica', 'Arial', 'sans-serif']}
      />
    </Head>
  );
};

export default TemplateEmailHead;
