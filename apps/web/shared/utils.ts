import { REGULAR_EXPRESSIONS } from '@config';
import { MANTINE_COLORS } from '@mantine/core';

/* eslint-disable no-magic-numbers */
export function addOpacityToHex(color: string, alpha: number) {
  const alphaFixed = Math.round(alpha * 255);
  let alphaHex = alphaFixed.toString(16);
  if (alphaHex.length == 1) {
    alphaHex = '0' + alphaHex;
  }

  return color + alphaHex;
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeFirstLetterOfName(str: string) {
  return str.split(' ')[0].charAt(0).toUpperCase() + str.split(' ')[0].slice(1);
}

export const getColorForText = (text: string) => {
  const colors = MANTINE_COLORS;

  // Generate a hash from the input text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use the absolute value of the hash to select a color
  const colorIndex = Math.abs(hash) % colors.length;

  return colors[colorIndex];
};

export function validateEmails(emails: any): string | true {
  if (!Array.isArray(emails)) {
    console.error('Expected an array of emails, but received:', emails);

    return 'Invalid email format';
  }

  const invalidEmails = emails.filter((email) => !REGULAR_EXPRESSIONS.EMAIL.test(email));
  const duplicateEmails = emails.filter((email, index) => emails.indexOf(email) !== index);

  if (invalidEmails.length > 0) {
    return `Invalid email addresses: ${invalidEmails.join(', ')}`;
  }

  if (duplicateEmails.length > 0) {
    return `Duplicate email addresses: ${duplicateEmails.join(', ')}`;
  }

  return true;
}

export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookiePart = parts.pop();
    if (cookiePart) {
      return cookiePart.split(';').shift();
    }
  }

  return undefined;
}

export function deleteCookie(cookieName: string) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function setInvitationRedirectCookie(invitationId: string, token: string) {
  const redirectUrl = `/team-members?invitationId=${encodeURIComponent(invitationId)}&token=${encodeURIComponent(
    token
  )}`;

  document.cookie = `${redirectUrl}=${encodeURIComponent(redirectUrl)}; path=/;`;
}

interface QueryParams {
  [key: string]: string;
}

export function setRedirectCookie({
  baseUrl,
  queryParams,
  cookieName,
  path = '/',
}: {
  baseUrl: string;
  queryParams: QueryParams;
  cookieName: string;
  path?: string;
}): { url: string; cookieName: string } {
  const url = new URL(baseUrl);

  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.set(key, encodeURIComponent(value));
  });

  document.cookie = `${cookieName}=${encodeURIComponent(url.toString())}; path=${path};`;

  return {
    url: url.toString(),
    cookieName,
  };
}

export function getPlanType(CODE?: string): string | undefined {
  switch (CODE) {
    case 'MONTHLY':
      return 'Month';
    case 'WEEKLY':
      return 'Week';
    case 'YEARLY':
      return 'Year';
    default:
      return undefined;
  }
}

export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'success':
    case 'completed':
    case 'done':
      return 'green';
    case 'failed':
    case 'error':
      return 'red';
    case 'pending':
    case 'processing':
      return 'yellow';
    default:
      return 'blue';
  }
};

export const getStatusSymbol = (status: string): React.ReactNode | string => {
  switch (status?.toLowerCase()) {
    case 'success':
    case 'completed':
      return '✓';
    case 'failed':
    case 'error':
      return '✗';
    case 'pending':
    case 'processing':
      return '⏳';
    default:
      return '•';
  }
};

export const renderJSONContent = (content: unknown) => {
  try {
    const jsonString =
      typeof content === 'string' ? JSON.stringify(JSON.parse(content), null, 2) : JSON.stringify(content, null, 2);

    return jsonString;
  } catch (error) {
    return typeof content === 'string' ? content : JSON.stringify(content);
  }
};

export function validateDateFormatString(format: string) {
  if (!format || typeof format !== 'string') {
    return { isValid: false, error: 'Format must be a non-empty string' };
  }

  /*
   * Valid tokens and separators
   * const validSeparators = ['/', '-', '.', ' ', ':', ','];
   */

  // Check for valid structure
  const formatRegex = /^(YYYY|YY|MM|DD|M|D|[\/\-.\s:,])+$/;
  if (!formatRegex.test(format)) {
    return {
      isValid: false,
      error: 'Format contains invalid characters. Use YYYY, YY, MM, DD, M, D and separators (/, -, ., space, :, ,)',
    };
  }

  // Check if format contains at least one valid token
  const hasValidToken = /(YYYY|YY|MM|DD|M|D)/.test(format);
  if (!hasValidToken) {
    return { isValid: false, error: 'Format must contain at least one valid date token (YYYY, YY, MM, DD, M, D)' };
  }

  // Extract all tokens by replacing them one by one
  let tempFormat = format;
  let yearCount = 0;
  let monthCount = 0;
  let dayCount = 0;

  // Count YYYY tokens
  while (tempFormat.includes('YYYY')) {
    yearCount++;
    tempFormat = tempFormat.replace('YYYY', '');
  }

  // Count YY tokens (only if YYYY wasn't found)
  while (tempFormat.includes('YY')) {
    yearCount++;
    tempFormat = tempFormat.replace('YY', '');
  }

  // Reset for month/day counting
  tempFormat = format.replace(/YYYY/g, '').replace(/YY/g, '');

  // Count MM tokens
  while (tempFormat.includes('MM')) {
    monthCount++;
    tempFormat = tempFormat.replace('MM', '');
  }

  // Count M tokens (single M, not part of MM)
  const singleMMatches = tempFormat.match(/(?<!M)M(?!M)/g);
  monthCount += singleMMatches?.length ?? 0;

  // Reset for day counting
  tempFormat = format
    .replace(/YYYY/g, '')
    .replace(/YY/g, '')
    .replace(/MM/g, '')
    .replace(/(?<!M)M(?!M)/g, '');

  // Count DD tokens
  while (tempFormat.includes('DD')) {
    dayCount++;
    tempFormat = tempFormat.replace('DD', '');
  }

  // Count D tokens (single D, not part of DD)
  const singleDMatches = tempFormat.match(/(?<!D)D(?!D)/g);
  dayCount += singleDMatches?.length ?? 0;

  // Validate counts
  if (yearCount > 1) {
    return { isValid: false, error: 'Format cannot have multiple year tokens' };
  }

  if (monthCount > 1) {
    return { isValid: false, error: 'Format cannot have multiple month tokens' };
  }

  if (dayCount > 1) {
    return { isValid: false, error: 'Format cannot have multiple day tokens' };
  }

  // Check that tokens aren't directly adjacent without separator
  if (/YYYYMM|YYYYDD|MMDD|DDMM|MMYY|DDYY|YYMM|YYDD/i.test(format)) {
    return { isValid: false, error: 'Date tokens must be separated by valid separators' };
  }

  return { isValid: true, error: null };
}
