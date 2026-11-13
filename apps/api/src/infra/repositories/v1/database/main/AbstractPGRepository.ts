import { DataSource } from 'typeorm';

interface IColumnsAndFiltersValues {
  columnName: string;
  comparisonOperator: string;
  filterValue: boolean | number | string | undefined;
}

export default abstract class AbstractPGRepository {
  public applyFilters(
    columnsAndFiltersValues: IColumnsAndFiltersValues[],
    qb: ReturnType<DataSource['createQueryBuilder']>,
  ): void {
    for (const {
      columnName,
      comparisonOperator,
      filterValue,
    } of columnsAndFiltersValues) {
      // false e 0 são valores aceitáveis. Apenas if (filterValue) os removeriam
      if (filterValue !== undefined)
        qb.andWhere(`${columnName} ${comparisonOperator} :${columnName}`, {
          [columnName]: filterValue,
        });
    }
  }
}
