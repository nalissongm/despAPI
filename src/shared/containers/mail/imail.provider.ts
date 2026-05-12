// src/shared/containers/mail/imail.provider.ts

export interface ISendMailDTO {
  to: string;
  from?: string;
  subject: string;
  body: string;
}

export abstract class IMailProvider {
  abstract sendMail(data: ISendMailDTO): Promise<void>;
  abstract verifyConnection(): Promise<void>;
}
