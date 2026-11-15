import type IError from '@/shared/types/IError';
import { useTheme } from 'vuetify';

export default interface IBaseData<T = Record<string, unknown>> {
  dialog: boolean;
  error: IError;
  loading: boolean;
  mainData: T;
  snackbar: boolean;
  theme: ReturnType<typeof useTheme>;
}
