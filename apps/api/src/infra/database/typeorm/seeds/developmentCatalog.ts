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
  { kind: 'expense', name: 'Alimentação', color: '#E85D4C', icon: 'utensils' },
  { kind: 'expense', name: 'Transporte', color: '#4C8FE8', icon: 'car' },
  { kind: 'expense', name: 'Moradia', color: '#C4A35A', icon: 'house' },
  { kind: 'expense', name: 'Lazer', color: '#9B59B6', icon: 'sparkles' },
  { kind: 'expense', name: 'Saúde', color: '#2ECC71', icon: 'heart' },
  { kind: 'revenue', name: 'Salário', color: '#27AE60', icon: 'wallet' },
  { kind: 'revenue', name: 'Freelance', color: '#16A085', icon: 'briefcase' },
  { kind: 'revenue', name: 'Investimentos', color: '#F39C12', icon: 'chart' },
];

export const USER_CATEGORY_SEEDS: CategorySeed[] = [
  { kind: 'expense', name: 'Assinaturas', color: '#6C5CE7', icon: 'repeat' },
  { kind: 'revenue', name: 'Reembolso', color: '#00B894', icon: 'rotate-ccw' },
];

const CATEGORY_AMOUNT_META: Record<string, CategoryAmountMeta> = {
  Alimentação: {
    min: 15,
    max: 85,
    descriptions: ['Almoço', 'Jantar', 'Mercado', 'Café'],
  },
  Transporte: {
    min: 5,
    max: 55,
    descriptions: ['Uber', 'Combustível', 'Metrô', 'Estacionamento'],
  },
  Moradia: {
    min: 80,
    max: 2200,
    descriptions: ['Aluguel', 'Conta de luz', 'Condomínio', 'Internet'],
  },
  Lazer: {
    min: 20,
    max: 220,
    descriptions: ['Cinema', 'Show', 'Passeio', 'Viagem'],
  },
  Saúde: {
    min: 30,
    max: 420,
    descriptions: ['Farmácia', 'Consulta', 'Exame', 'Academia'],
  },
  Assinaturas: {
    min: 9.9,
    max: 59.9,
    descriptions: ['Streaming', 'Música', 'Nuvem', 'Software'],
  },
  Salário: { min: 3500, max: 8200, descriptions: ['Salário mensal'] },
  Freelance: {
    min: 500,
    max: 4200,
    descriptions: ['Projeto', 'Consultoria', 'Hora técnica'],
  },
  Investimentos: {
    min: 50,
    max: 1600,
    descriptions: ['Dividendos', 'Rendimento', 'Juros'],
  },
  Reembolso: {
    min: 20,
    max: 480,
    descriptions: ['Reembolso', 'Estorno', 'Restituição'],
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
      globalScopedCategoryId: isGlobal ? category.id : null,
      userScopedCategoryId: isGlobal ? null : category.id,
      amount: interpolateAmount(meta.min, meta.max, index),
      occurredOn,
      description: `${description} #${String(index + 1)}`,
    };
  });
}
