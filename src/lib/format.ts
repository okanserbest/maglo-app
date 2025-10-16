export function formatCurrency(
  amount: number,
  currency = 'TRY',
  locale: string | string[] = 'tr-TR'
) {
  try {
    return new Intl.NumberFormat(Array.isArray(locale) ? locale[0] : locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function formatDate(iso: string, locale = 'tr-TR', opts: Intl.DateTimeFormatOptions = {}) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    ...opts,
  }).format(d);
}

// Example output: "April 28, 2022 at 11:00"
export function formatDateAt(iso: string, locale: string | string[] = 'en-US') {
  const d = new Date(iso);
  // Month day, year
  const datePart = new Intl.DateTimeFormat(Array.isArray(locale) ? locale[0] : locale, {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(d);
  // HH:MM (24h)
  const timePart = new Intl.DateTimeFormat(Array.isArray(locale) ? locale[0] : locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
  return `${datePart} at ${timePart}`;
}

export function maskCardNumber(n: string) {
  // If already masked (contains ****), just convert regular spaces to NBSP to preserve them in HTML
  if (n.includes('****')) {
    return n.replace(/ /g, '\u00A0');
  }
  // Otherwise, mask and insert NBSPs between groups so spaces are not collapsed
  return n.replace(/(\d{4})\d+(\d{4})/, '$1\u00A0****\u00A0****\u00A0$2');
}
