// src/shared/containers/mail/dummy.mail.provider.ts

import { Injectable } from '@nestjs/common';
import { IMailProvider, ISendMailDTO } from './imail.provider';

@Injectable()
export class DummyMailProvider implements IMailProvider {
  async verifyConnection(): Promise<void> {
    console.log('Dummy mail provider connection verified.');
    return Promise.resolve();
  }
  /**
   * A dummy mail sender that logs the email to the console.
   * Useful for development and testing environments.
   * @param data The email data.
   */
  sendMail(data: ISendMailDTO): Promise<void> {
    console.log('--- DUMMY MAIL SENDER ---');
    console.log(`To: ${data.to}`);
    console.log(`Subject: ${data.subject}`);
    console.log(`Body: ${data.body}`);
    console.log('-------------------------');
    return Promise.resolve();
  }
}
