import { REGULAR_EXPRESSIONS } from '@config';

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
