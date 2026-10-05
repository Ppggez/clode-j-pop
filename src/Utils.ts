function sumPrice(prices: number[]): number {
  let total = 0;
  for (const p of prices) total += p;
  return total;
}

function calcTax(total: number): number {
  return Math.round(total * 0.07 * 100) / 100;
}

export const Utils = { sumPrice, calcTax };