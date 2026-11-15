import axios from 'axios';
import type IError from '@/shared/types/IError';

export default function errorHandler(errorData: IError, e: unknown) {
  if (axios.isAxiosError(e)) {
    errorData.code = e.response?.data.code ?? e.code;
    errorData.message = e.response?.data.message ?? e.message;
    errorData.statusCode = e.status;
  } else if (e instanceof Error) {
    errorData.code = e.name;
    errorData.message = e.message;
    errorData.statusCode = undefined;
  } else {
    errorData.code = 'UNKNOW_ERROR';
    errorData.message = 'Erro desconhecido';
    errorData.statusCode = undefined;
  }
}
