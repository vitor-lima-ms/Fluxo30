export interface IFetchUserHomeSummaryInput {
  currentEnd: string;
  currentStart: string;
  previousEnd: string;
  previousStart: string;
  userId: string;
  yearToDateStart: string;
  yoyEnd: string;
  yoyStart: string;
}

export interface ILedgerPeriodTotals {
  currentMonthTotal: number;
  previousMonthTotal: number;
  sameMonthLastYearTotal: number;
  yearToDateTotal: number;
}

export interface IFetchUserHomeSummaryOutput {
  expenses: ILedgerPeriodTotals;
  revenues: ILedgerPeriodTotals;
}

export interface IPGHomeRepository {
  fetchUserHomeSummary(
    input: IFetchUserHomeSummaryInput,
  ): Promise<IFetchUserHomeSummaryOutput>;
}
