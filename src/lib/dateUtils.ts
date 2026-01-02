/**
 * Date utility functions for displaying dates in GMT+1 timezone
 */

const GMT_PLUS_1_TIMEZONE = "Europe/Paris"; // GMT+1 (CET) / GMT+2 (CEST)

/**
 * Format a date string or Date object to a localized string in GMT+1
 */
export function formatDateGMT1(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return dateObj.toLocaleString("en-US", {
    timeZone: GMT_PLUS_1_TIMEZONE,
    ...options,
  });
}

/**
 * Format a date string or Date object to a date string in GMT+1
 */
export function formatDateOnlyGMT1(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return dateObj.toLocaleDateString("en-US", {
    timeZone: GMT_PLUS_1_TIMEZONE,
    ...options,
  });
}

/**
 * Format a date string or Date object to a time string in GMT+1
 */
export function formatTimeOnlyGMT1(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString("en-US", {
    timeZone: GMT_PLUS_1_TIMEZONE,
    ...options,
  });
}

/**
 * Format date and time with default options for GMT+1
 */
export function formatDateTimeGMT1(date: string | Date): string {
  return formatDateGMT1(date, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format date only with default options for GMT+1
 */
export function formatDateShortGMT1(date: string | Date): string {
  return formatDateOnlyGMT1(date, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format date with long month name for GMT+1
 */
export function formatDateLongGMT1(date: string | Date): string {
  return formatDateOnlyGMT1(date, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format time only with default options for GMT+1
 */
export function formatTimeGMT1(date: string | Date): string {
  return formatTimeOnlyGMT1(date, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

