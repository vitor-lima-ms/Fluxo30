interface IAppErrorInput {
  message: string;
  errorCode: string;
  internalMessage?: unknown;
}

export default class AppError extends Error {
  public readonly errorCode: string;
  public readonly internalMessage?: string;

  constructor({ message, errorCode, internalMessage }: IAppErrorInput) {
    super(message);
    this.errorCode = errorCode;
    this.internalMessage =
      internalMessage instanceof Error ?
        internalMessage.message
      : String(internalMessage);
  }
}
