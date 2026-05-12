import { Injectable } from '@nestjs/common';
import { IMailProvider, ISendMailDTO } from './imail.provider';
import {createTransport} from 'nodemailer';

@Injectable()
export class SMTPMailProvider implements IMailProvider {
  private config = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  };
  private transporter: ReturnType<typeof createTransport>;
  
  constructor() {
    this.transporter = createTransport(this.config);
    this.verifyConnection();
  }


  async verifyConnection(): Promise<void> {
    try {      
      await this.transporter.verify();
      console.log('SMTP connection verified successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to verify SMTP connection: ${message}`);
    }

  }

  /**
   * A dummy mail sender that logs the email to the console.
   * Useful for development and testing environments.
   * @param data The email data.
   */
  async sendMail(data: ISendMailDTO): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: data.from,
        to: data.to,
        subject: data.subject,
        text: data.body
      });

      await this.transporter.sendMail(info);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}