declare module 'node:util' {
  interface ThrottleOptions {
    concurrency?: number;
    maxPending?: number;
    overflow?: 'drop' | 'queue';
    signal?: AbortSignal;
    strict?: boolean;
  }

  interface ThrottledFunction<T extends (...args: never[]) => unknown> {
    (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>>;
    readonly activeCount: number;
    cancel(reason?: unknown): void;
    hasImmediateCapacity(): boolean;
    readonly pending: Promise<unknown> | null;
    readonly pendingCount: number;
    ref(): this;
    unref(): this;
  }

  function throttle<T extends (...args: never[]) => unknown>(
    fn: T,
    limit: number,
    interval: number,
    options?: ThrottleOptions,
  ): ThrottledFunction<T>;
}
