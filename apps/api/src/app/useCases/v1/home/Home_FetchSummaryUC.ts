import {
  buildAverageComparison,
  buildTotalComparison,
  type IAmountComparison,
  type IAverageComparison,
  roundMoney,
} from '#app/helpers/v1/home/buildAmountComparison';
import type {
  ILedgerPeriodTotals,
  IPGHomeRepository,
} from '#app/repositories/v1/database/main/home/PGHomeRepository';
import { inject, injectable } from 'tsyringe';

interface IInput {
  userId: string;
}

interface ILedgerSummary {
  currentMonthTotal: number;
  currentYearMonthlyAverage: IAverageComparison;
  previousMonth: IAmountComparison;
  sameMonthLastYear: IAmountComparison;
}

interface IOutput {
  expenses: ILedgerSummary;
  referenceMonth: string;
  revenues: ILedgerSummary;
}

interface IMonthWindows {
  currentEnd: string;
  currentStart: string;
  monthNumber: number;
  previousEnd: string;
  previousStart: string;
  referenceMonth: string;
  yearToDateStart: string;
  yoyEnd: string;
  yoyStart: string;
}

@injectable()
export default class Home_FetchSummaryUC {
  constructor(
    @inject('PGHomeRepository')
    private readonly pgHomeRepository: IPGHomeRepository,
  ) {}

  public async execute({ userId }: IInput): Promise<IOutput> {
    const windows = this.buildSaoPauloMonthWindows();
    const { expenses, revenues } =
      await this.pgHomeRepository.fetchUserHomeSummary({
        currentEnd: windows.currentEnd,
        currentStart: windows.currentStart,
        previousEnd: windows.previousEnd,
        previousStart: windows.previousStart,
        userId,
        yearToDateStart: windows.yearToDateStart,
        yoyEnd: windows.yoyEnd,
        yoyStart: windows.yoyStart,
      });

    return {
      expenses: this.toLedgerSummary(expenses, windows.monthNumber),
      referenceMonth: windows.referenceMonth,
      revenues: this.toLedgerSummary(revenues, windows.monthNumber),
    };
  }

  private buildSaoPauloMonthWindows(): IMonthWindows {
    const now = Temporal.Now.zonedDateTimeISO('America/Sao_Paulo');
    const currentStart = Temporal.PlainDate.from({
      day: 1,
      month: now.month,
      year: now.year,
    });
    const currentEnd = currentStart.add({ months: 1 }).subtract({ days: 1 });
    const previousStart = currentStart.subtract({ months: 1 });
    const previousEnd = currentStart.subtract({ days: 1 });
    const yoyStart = currentStart.subtract({ years: 1 });
    const yoyEnd = yoyStart.add({ months: 1 }).subtract({ days: 1 });
    const yearToDateStart = Temporal.PlainDate.from({
      day: 1,
      month: 1,
      year: now.year,
    });

    return {
      currentEnd: currentEnd.toString(),
      currentStart: currentStart.toString(),
      monthNumber: now.month,
      previousEnd: previousEnd.toString(),
      previousStart: previousStart.toString(),
      referenceMonth: currentStart.toString().slice(0, 7),
      yearToDateStart: yearToDateStart.toString(),
      yoyEnd: yoyEnd.toString(),
      yoyStart: yoyStart.toString(),
    };
  }

  private toLedgerSummary(
    totals: ILedgerPeriodTotals,
    monthNumber: number,
  ): ILedgerSummary {
    const currentMonthTotal = roundMoney(totals.currentMonthTotal);
    const average = roundMoney(totals.yearToDateTotal / monthNumber);

    return {
      currentMonthTotal,
      currentYearMonthlyAverage: buildAverageComparison(
        currentMonthTotal,
        average,
      ),
      previousMonth: buildTotalComparison(
        currentMonthTotal,
        totals.previousMonthTotal,
      ),
      sameMonthLastYear: buildTotalComparison(
        currentMonthTotal,
        totals.sameMonthLastYearTotal,
      ),
    };
  }
}
