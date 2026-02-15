import { format, formatDistanceToNow } from 'date-fns';

/**
 * Returns true if the value is a valid Date with a valid time.
 */
function isValidDate(d: unknown): d is Date {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

/**
 * Safe format: uses date-fns format when date is valid, otherwise returns fallback.
 * Prevents crashes from corrupted/invalid dates from storage.
 */
export function safeFormat(
  date: unknown,
  formatStr: string,
  fallback = '—',
): string {
  if (!isValidDate(date)) return fallback;
  try {
    return format(date, formatStr);
  } catch {
    return fallback;
  }
}

/**
 * Safe formatDistanceToNow: same idea for relative time.
 */
export function safeFormatDistanceToNow(
  date: unknown,
  options?: { addSuffix?: boolean },
  fallback = '—',
): string {
  if (!isValidDate(date)) return fallback;
  try {
    return formatDistanceToNow(date, options ?? {});
  } catch {
    return fallback;
  }
}

/**
 * Safe getTime() for sorting: returns number or 0 for invalid dates.
 */
export function safeGetTime(date: unknown): number {
  if (!isValidDate(date)) return 0;
  return date.getTime();
}
