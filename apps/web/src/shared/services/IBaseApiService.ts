export interface Body {
  [key: string]: Body | boolean | null | number | string | string[] | undefined;
}

export interface IBaseApiService {
  delete<T>(uri: string): Promise<T>;
  get<T>(uri: string): Promise<T>;
  patch<T>(body: Body, uri: string): Promise<T>;
  post<T>(body: Body, uri: string): Promise<T>;
  put<T>(body: Body, uri: string): Promise<T>;
}
