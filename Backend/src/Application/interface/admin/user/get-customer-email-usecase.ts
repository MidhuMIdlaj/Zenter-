export interface IGetCustomerEmails {
  execute(): Promise<{ email: string; name: string }[]>;
}
