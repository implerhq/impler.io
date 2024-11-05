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
