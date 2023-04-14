/* eslint-disable no-magic-numbers */
export function addOpacityToHex(color: string, alpha: number) {
  const alphaFixed = Math.round(alpha * 255);
  let alphaHex = alphaFixed.toString(16);
  if (alphaHex.length == 1) {
    alphaHex = '0' + alphaHex;
  }

  return color + alphaHex;
}
