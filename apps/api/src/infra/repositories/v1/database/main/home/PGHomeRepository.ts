import AppError from '#app/errors/AppError';
import { DataSource } from 'typeorm';
import PGFluxo30DataSource from '#infra/database/typeorm/PGFluxo30DataSource';
import type {
  IFetchUserHomeSummaryInput,
  IFetchUserHomeSummaryOutput,
  ILedgerPeriodTotals,
  IPGHomeRepository,
} from '#app/repositories/v1/database/main/home/PGHomeRepository';
import { inject, injectable } from 'tsyringe';

interface IRawLedgerPeriodTotals {
  currentMonthTotal: string | number | null;
  previousMonthTotal: string | number | null;
  sameMonthLastYearTotal: string | number | null;
  yearToDateTotal: string | number | null;
}

@injectable()
export default class PGHomeRepository implements IPGHomeRepository {
  private readonly pgConnection: DataSource;

  constructor(
    @inject('PGFluxo30DataSource') pgFluxo30DataSource: PGFluxo30DataSource,
  ) {
    this.pgConnection = pgFluxo30DataSource.getConnection();
  }

  public async fetchUserHomeSummary(
    input: IFetchUserHomeSummaryInput,
  ): Promise<IFetchUserHomeSummaryOutput> {
    try {
      const [expenses, revenues] = await Promise.all([
        this.fetchLedgerPeriodTotals('expenses', input),
        this.fetchLedgerPeriodTotals('revenues', input),
      ]);

      return { expenses, revenues };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError({
        errorCode: 'ERROR_ON_FETCH_HOME_SUMMARY',
        internalMessage: error,
        message: 'Erro ao buscar o resumo da home',
      });
    }
  }

  private async fetchLedgerPeriodTotals(
    table: 'expenses' | 'revenues',
    {
      currentEnd,
      currentStart,
      previousEnd,
      previousStart,
      userId,
      yearToDateStart,
      yoyEnd,
      yoyStart,
    }: IFetchUserHomeSummaryInput,
  ): Promise<ILedgerPeriodTotals> {
    const qb = this.pgConnection.createQueryBuilder();
    qb.select(
      'COALESCE(SUM(l.amount) FILTER (WHERE l.occurred_on >= :currentStart AND l.occurred_on <= :currentEnd), 0)',
      'currentMonthTotal',
    );
    qb.addSelect(
      'COALESCE(SUM(l.amount) FILTER (WHERE l.occurred_on >= :previousStart AND l.occurred_on <= :previousEnd), 0)',
      'previousMonthTotal',
    );
    qb.addSelect(
      'COALESCE(SUM(l.amount) FILTER (WHERE l.occurred_on >= :yoyStart AND l.occurred_on <= :yoyEnd), 0)',
      'sameMonthLastYearTotal',
    );
    qb.addSelect(
      'COALESCE(SUM(l.amount) FILTER (WHERE l.occurred_on >= :yearToDateStart AND l.occurred_on <= :currentEnd), 0)',
      'yearToDateTotal',
    );
    qb.from(table, 'l');
    qb.where('l.user_id = :userId', { userId });
    qb.andWhere('l.deleted_at IS NULL');
    qb.andWhere('l.occurred_on >= :yoyStart');
    qb.andWhere('l.occurred_on <= :currentEnd');
    qb.setParameters({
      currentEnd,
      currentStart,
      previousEnd,
      previousStart,
      yearToDateStart,
      yoyEnd,
      yoyStart,
    });

    const raw = await qb.getRawOne<IRawLedgerPeriodTotals>();

    return {
      currentMonthTotal: this.toMoney(raw?.currentMonthTotal),
      previousMonthTotal: this.toMoney(raw?.previousMonthTotal),
      sameMonthLastYearTotal: this.toMoney(raw?.sameMonthLastYearTotal),
      yearToDateTotal: this.toMoney(raw?.yearToDateTotal),
    };
  }

  private toMoney(value: string | number | null | undefined): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return 0;

    return Math.round(parsed * 100) / 100;
  }
}
