export const numberToString = (x: number | string): string => {
  const number = x.toString();
  if (number.includes("e-")) {
    const mantissaExponentSplit = number.split("e-");
    const exponent = parseInt(mantissaExponentSplit[1], 10);
    const [beforeDecimal, afterDecimal] = mantissaExponentSplit[0].split(".");
    const beforeDecimalLength = beforeDecimal.length;
    const zeroes = "0".repeat(exponent - beforeDecimalLength);
    return `${"0"}.${zeroes}${beforeDecimal}${afterDecimal && afterDecimal}`;
  }
  if (number.includes("e+")) {
    const valueExponentSplit = number.split("e+");
    const exponent = parseInt(valueExponentSplit[1], 10);
    const [beforeDecimal, afterDecimal] = valueExponentSplit[0].split(".");
    const afterDecimalLength = afterDecimal ? afterDecimal.length : 0;
    if (afterDecimalLength > exponent) {
      return `${beforeDecimal}${afterDecimal}`;
    }
    const zeroes = "0".repeat(exponent - afterDecimalLength);
    return `${beforeDecimal}${afterDecimal ? afterDecimal : ""}${zeroes}`;
  }
  return number;
};
