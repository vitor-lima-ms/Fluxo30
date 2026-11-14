import RequestLogMiddleware from '#infra/http/middlewares/RequestLogMiddleware';
import v1Middlewares from '#infra/http/middlewares/v1/index';

export default {
  JwtMiddleware: v1Middlewares.JwtMiddleware,
  RequestLogMiddleware,
  User_LoginRequest: v1Middlewares.User_LoginRequest,
};
