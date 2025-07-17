import { variables, colors } from '@config';
import { logger } from '@util';

function getColorNumber(i: number, color: number, shadesCount: number) {
  return Math.round(Math.max(Math.min((i * color) / shadesCount, variables.maxColorNumber), variables.baseIndex));
}
function getRGBColor(color: string): string | null {
  const colorType = detectColorFormat(color);
  switch (colorType) {
    case 'HEX':
      return hexToRgb(color);
    case 'RGB':
      return color;
    default:
      logger.logError(logger.ErrorTypesEnum.INVALID_COLOR, `Primary color ${color} is not supported`);

      return null;
  }
}
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? `rgb(${parseInt(result[variables.firstIndex], variables.hexNumber)},${parseInt(
        result[variables.secondIndex],
        variables.hexNumber
      )},${parseInt(result[variables.thirdIndex], variables.hexNumber)})`
    : null;
}
function detectColorFormat(color: string): 'HEX' | 'RGB' | undefined {
  if (color.startsWith('#')) {
    return 'HEX';
  } else if (color.startsWith('rgb')) {
    return 'RGB';
  }
}
function extractColorsFromColorString(color: string): any[] {
  return color.split('(')[variables.firstIndex].split(')')[variables.baseIndex].split(',');
}
export function generateShades(color: string, shadesCount = variables.defaultShadesCount) {
  const rgbColor = getRGBColor(color) || getRGBColor(colors.primary);

  if (rgbColor) {
    const [red, green, blue, a = variables.defaultAlpha] = extractColorsFromColorString(rgbColor);
    const shades: string[] = [];
    for (let i = 1; i <= shadesCount * variables.shadesMultipler; i++) {
      shades.push(
        `rgba(${getColorNumber(i, red, shadesCount)},${getColorNumber(i, green, shadesCount)},${getColorNumber(
          i,
          blue,
          shadesCount
        )},${a})`
      );
    }

    return shades.reverse();
  }
}

// Helper function to determine if a color is dark
export function isColorDark(color: string): boolean {
  // Remove # if present
  const hex = color.replace('#', '');

  // Convert to RGB
  const red = parseInt(hex.substr(0, 2), 16);
  const green = parseInt(hex.substr(2, 2), 16);
  const blue = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance using the relative luminance formula
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance < 0.5;
}

// Helper function to get contrasting text color
export function getContrastingTextColor(backgroundColor: string): string {
  return isColorDark(backgroundColor) ? '#ffffff' : '#000000';
}

// Helper function to get a lighter version of the text color for secondary text
export function getSecondaryTextColor(backgroundColor: string): string {
  return isColorDark(backgroundColor) ? '#e0e0e0' : '#666666';
}
