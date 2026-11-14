export interface IFetchUserByIdInput {
  id: string;
}
export interface IFetchUserByIdOutput {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IFetchUserForLoginInput {
  email: string;
}
export interface IFetchUserForLoginOutput {
  id: string;
  email: string;
  passwordHash: string;
}

export interface IPGUserRepository {
  fetchUserById(input: IFetchUserByIdInput): Promise<IFetchUserByIdOutput>;

  fetchUserForLogin(
    input: IFetchUserForLoginInput,
  ): Promise<IFetchUserForLoginOutput | null>;
}
