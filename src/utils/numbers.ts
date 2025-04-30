const lookup = [
  { value: 1, symbol: '' },
  { value: 1e3, symbol: 'K' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'B' },
  { value: 1e12, symbol: 'T' },
  { value: 1e15, symbol: 'P' },
  { value: 1e18, symbol: 'E' },
];
const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

export const abbreviateNumber = (num: number, digits = 2) => {
  const reversedLookup = [...lookup].reverse();
  const item = reversedLookup.find((data) => num >= data.value);
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : Number(num).toFixed(digits);
};

export const formatNumber = (num: number, decimals = 1) => {
  if (typeof num !== 'number' || isNaN(num)) return '0';

  const absNum = Math.abs(num);
  if (absNum === 0) return '0';

  const suffixes = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
  const tier = Math.floor(Math.log10(absNum) / 3);

  // Handle numbers smaller than 1000
  if (tier < 0) return num.toFixed(decimals);

  const suffix = suffixes[tier] || '';
  const scaled = num / Math.pow(10, tier * 3);

  return scaled.toFixed(decimals).replace(/\.0+$/, '') + suffix;
};

export function truncateNumber(number: number | string, digits: number = 6) {
  const numStr = numberToString(number);
  const [whole, decimal] = numStr.split('.');
  if (!decimal || +numStr <= 0) return whole;

  const firstNonZeroIndex = decimal.search(/[1-9]/);

  if (
    firstNonZeroIndex === -1 ||
    (Number(whole) > 0 && firstNonZeroIndex > digits)
  ) {
    return whole;
  }

  const sliceTo =
    firstNonZeroIndex < digits
      ? digits
      : firstNonZeroIndex <= digits
        ? firstNonZeroIndex + 1
        : digits + 1;

  const truncatedNumber = `${whole}.${decimal.slice(0, sliceTo)}`;

  return Number(truncatedNumber) === 0 ? '0' : truncatedNumber;
}

export const numberToString = (x: number | string): string => {
  const number = x.toString();
  if (number.includes('e-')) {
    const mantissaExponentSplit = number.split('e-');
    const exponent = parseInt(mantissaExponentSplit[1], 10);
    const [beforeDecimal, afterDecimal] = mantissaExponentSplit[0].split('.');
    const beforeDecimalLength = beforeDecimal.length;
    const zeroes = '0'.repeat(exponent - beforeDecimalLength);
    return `${'0'}.${zeroes}${beforeDecimal}${afterDecimal && afterDecimal}`;
  }
  if (number.includes('e+')) {
    const valueExponentSplit = number.split('e+');
    const exponent = parseInt(valueExponentSplit[1], 10);
    const [beforeDecimal, afterDecimal] = valueExponentSplit[0].split('.');
    const afterDecimalLength = afterDecimal ? afterDecimal.length : 0;
    if (afterDecimalLength > exponent) {
      return `${beforeDecimal}${afterDecimal}`;
    }
    const zeroes = '0'.repeat(exponent - afterDecimalLength);
    return `${beforeDecimal}${afterDecimal ? afterDecimal : ''}${zeroes}`;
  }
  return number;
};
