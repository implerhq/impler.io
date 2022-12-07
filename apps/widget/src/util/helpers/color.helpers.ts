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
