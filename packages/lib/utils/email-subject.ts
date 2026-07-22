/**
 * Truncates a document title for safe use inside an email subject line.
 *
 * Most inbox list views (Gmail, Outlook, mobile mail clients) only reliably
 * render the first ~60 visible characters of a subject before clipping it.
 * Every subject we build is `"<short prefix>: <title>"` (e.g. `Da firmare:`,
 * `Signature requested:`), so the prefix itself already eats a chunk of that
 * budget. To keep the combined subject comfortably inside the visible
 * window - across every prefix and every language we ship - the title
 * portion is budgeted much tighter than the subject as a whole, 30 code
 * points by default.
 *
 * @param title The raw document title, as stored on the envelope.
 * @param maxLength Maximum number of code points to keep before truncating.
 * @returns The trimmed (and possibly truncated) title, safe to interpolate
 * into a subject line.
 */
export function trimEmailTitle(title: string, maxLength = 30): string {
  const trimmed = title.trim();

  if (trimmed.length === 0) {
    return 'documento';
  }

  // Strip a known file extension so subjects read as "Contract" rather than
  // "Contract.pdf". Only drop it if something meaningful is left behind.
  const withoutExtension = trimmed.replace(/\.(pdf|docx|doc)$/i, '').trim();
  const base = withoutExtension.length > 0 ? withoutExtension : trimmed;

  // Measure and slice by code point (not UTF-16 code unit) so we never split
  // a surrogate pair or a multi-codepoint grapheme in two.
  const chars = Array.from(base);

  if (chars.length <= maxLength) {
    return base;
  }

  const cutChars = chars.slice(0, maxLength);

  // Prefer to backtrack to the last whitespace boundary so we don't cut a
  // word in half, but only when that boundary is near the end of the
  // budget (within the final 30%). Otherwise a single long word would
  // backtrack all the way to the start, so keep the hard cut instead.
  const backtrackWindow = Math.floor(maxLength * 0.3);

  let lastWhitespaceIndex = -1;

  for (let i = cutChars.length - 1; i >= 0; i--) {
    if (/\s/.test(cutChars[i])) {
      lastWhitespaceIndex = i;
      break;
    }
  }

  const shouldBacktrack = lastWhitespaceIndex !== -1 && maxLength - lastWhitespaceIndex <= backtrackWindow;

  const cut = shouldBacktrack ? cutChars.slice(0, lastWhitespaceIndex).join('') : cutChars.join('');

  // Drop any trailing whitespace or punctuation left dangling by the cut so
  // we don't end up with something like "Invoice,…".
  const cleaned = cut.replace(/[\s.,:;-]+$/, '');

  return `${cleaned}…`;
}
