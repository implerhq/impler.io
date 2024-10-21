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
