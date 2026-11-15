import axios, { type AxiosInstance } from 'axios';
import type { Body, IBaseApiService } from './IBaseApiService';

export default class BaseAxiosClient implements IBaseApiService {
  public readonly axiosClient: AxiosInstance;

  constructor() {
    this.axiosClient = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
  }

  async delete<T = void>(uri: string): Promise<T> {
    return (await this.axiosClient.delete<T>(uri)).data;
  }

  async get<T = void>(uri: string): Promise<T> {
    return (await this.axiosClient.get<T>(uri)).data;
  }

  async patch<T = void>(body: Body, uri: string): Promise<T> {
    return (await this.axiosClient.patch<T>(uri, body)).data;
  }

  async post<T = void>(body: Body, uri: string): Promise<T> {
    return (await this.axiosClient.post<T>(uri, body)).data;
  }

  async put<T = void>(body: Body, uri: string): Promise<T> {
    return (await this.axiosClient.put<T>(uri, body)).data;
  }
}
