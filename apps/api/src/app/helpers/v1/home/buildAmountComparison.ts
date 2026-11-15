export interface IAmountComparison {
  delta: number;
  deltaPercent: number | null;
  total: number;
}

export interface IAverageComparison {
  average: number;
  delta: number;
  deltaPercent: number | null;
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function buildAverageComparison(
  current: number,
  average: number,
): IAverageComparison {
  const roundedAverage = roundMoney(average);
  const delta = roundMoney(current - roundedAverage);

  return {
    average: roundedAverage,
    delta,
    deltaPercent:
      roundedAverage === 0 ? null : roundMoney((delta / roundedAverage) * 100),
  };
}

export function buildTotalComparison(
  current: number,
  base: number,
): IAmountComparison {
  const roundedBase = roundMoney(base);
  const delta = roundMoney(current - roundedBase);

  return {
    delta,
    deltaPercent:
      roundedBase === 0 ? null : roundMoney((delta / roundedBase) * 100),
    total: roundedBase,
  };
}
