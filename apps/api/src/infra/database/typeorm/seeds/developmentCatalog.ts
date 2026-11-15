export const DEVELOPMENT_SEED_NAME = 'development-catalog';
export const EXPENSE_SEED_COUNT = 474;
export const REVENUE_SEED_COUNT = 457;

export type CategoryKind = 'expense' | 'revenue';
export type CategoryScope = 'global' | 'user';

export interface CategorySeed {
  kind: CategoryKind;
  name: string;
  color: string;
  icon: string;
}

export interface ResolvedCategory {
  id: string;
  kind: CategoryKind;
  name: string;
  scope: CategoryScope;
}

export interface LedgerSeedRow {
  globalScopedCategoryId: string | null;
  userScopedCategoryId: string | null;
  amount: string;
  occurredOn: string;
  description: string;
}

interface CategoryAmountMeta {
  min: number;
  max: number;
  descriptions: string[];
}

export const GLOBAL_CATEGORY_SEEDS: CategorySeed[] = [
  { color: '#E85D4C', icon: 'utensils', kind: 'expense', name: 'Alimentação' },
  { color: '#4C8FE8', icon: 'car', kind: 'expense', name: 'Transporte' },
  { color: '#C4A35A', icon: 'house', kind: 'expense', name: 'Moradia' },
  { color: '#9B59B6', icon: 'sparkles', kind: 'expense', name: 'Lazer' },
  { color: '#2ECC71', icon: 'heart', kind: 'expense', name: 'Saúde' },
  { color: '#27AE60', icon: 'wallet', kind: 'revenue', name: 'Salário' },
  { color: '#16A085', icon: 'briefcase', kind: 'revenue', name: 'Freelance' },
  { color: '#F39C12', icon: 'chart', kind: 'revenue', name: 'Investimentos' },
];

export const USER_CATEGORY_SEEDS: CategorySeed[] = [
  { color: '#6C5CE7', icon: 'repeat', kind: 'expense', name: 'Assinaturas' },
  { color: '#00B894', icon: 'rotate-ccw', kind: 'revenue', name: 'Reembolso' },
];

const CATEGORY_AMOUNT_META: Record<string, CategoryAmountMeta> = {
  Alimentação: {
    descriptions: ['Almoço', 'Jantar', 'Mercado', 'Café'],
    max: 85,
    min: 15,
  },
  Assinaturas: {
    descriptions: ['Streaming', 'Música', 'Nuvem', 'Software'],
    max: 59.9,
    min: 9.9,
  },
  Freelance: {
    descriptions: ['Projeto', 'Consultoria', 'Hora técnica'],
    max: 4200,
    min: 500,
  },
  Investimentos: {
    descriptions: ['Dividendos', 'Rendimento', 'Juros'],
    max: 1600,
    min: 50,
  },
  Lazer: {
    descriptions: ['Cinema', 'Show', 'Passeio', 'Viagem'],
    max: 220,
    min: 20,
  },
  Moradia: {
    descriptions: ['Aluguel', 'Conta de luz', 'Condomínio', 'Internet'],
    max: 2200,
    min: 80,
  },
  Reembolso: {
    descriptions: ['Reembolso', 'Estorno', 'Restituição'],
    max: 480,
    min: 20,
  },
  Salário: { descriptions: ['Salário mensal'], max: 8200, min: 3500 },
  Saúde: {
    descriptions: ['Farmácia', 'Consulta', 'Exame', 'Academia'],
    max: 420,
    min: 30,
  },
  Transporte: {
    descriptions: ['Uber', 'Combustível', 'Metrô', 'Estacionamento'],
    max: 55,
    min: 5,
  },
};

function isoDateUtc(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function spreadDates(count: number): string[] {
  const end = new Date();
  const start = new Date(end);
  start.setUTCFullYear(start.getUTCFullYear() - 2);

  if (count <= 1) return [isoDateUtc(end)];

  const spanMs = end.getTime() - start.getTime();

  return Array.from({ length: count }, (_, index) => {
    const occurredAt = new Date(
      start.getTime() + (spanMs * index) / (count - 1),
    );
    return isoDateUtc(occurredAt);
  });
}

function interpolateAmount(min: number, max: number, index: number): string {
  const t = ((index * 37) % 1000) / 999;
  return (min + t * (max - min)).toFixed(2);
}

export function buildLedgerRows(
  kind: CategoryKind,
  count: number,
  categories: ResolvedCategory[],
): LedgerSeedRow[] {
  const pool = categories.filter((category) => category.kind === kind);
  if (pool.length === 0) {
    throw new Error(`[PG] Seed catalog has no ${kind} categories`);
  }

  const dates = spreadDates(count);

  return dates.map((occurredOn, index) => {
    const category = pool[index % pool.length];
    if (!category) {
      throw new Error(`[PG] Seed catalog missing ${kind} category`);
    }

    const meta = CATEGORY_AMOUNT_META[category.name];
    if (!meta) {
      throw new Error(
        `[PG] Seed catalog missing amount meta for ${category.name}`,
      );
    }

    const description = meta.descriptions[index % meta.descriptions.length];
    if (!description) {
      throw new Error(
        `[PG] Seed catalog missing description for ${category.name}`,
      );
    }

    const isGlobal = category.scope === 'global';

    return {
      amount: interpolateAmount(meta.min, meta.max, index),
      description: `${description} #${String(index + 1)}`,
      globalScopedCategoryId: isGlobal ? category.id : null,
      occurredOn,
      userScopedCategoryId: isGlobal ? null : category.id,
    };
  });
}
