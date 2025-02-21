const lookup = [
  { value: 1, symbol: "" },
  { value: 1e3, symbol: "K" },
  { value: 1e6, symbol: "M" },
  { value: 1e9, symbol: "B" },
  { value: 1e12, symbol: "T" },
  { value: 1e15, symbol: "P" },
  { value: 1e18, symbol: "E" },
];
const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

export const abbreviateNumber = (num: number, digits = 2) => {
  const reversedLookup = [...lookup].reverse();
  const item = reversedLookup.find((data) => num >= data.value);
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : Number(num).toFixed(digits);
};
