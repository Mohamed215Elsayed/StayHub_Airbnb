import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import type { EmailAdapterInterface } from "../interfaces/email-adapter.interface";
import { SendEmailDto } from "../dto/send-email.dto";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables, ISmtp } from "@common/configuration/environment.interface";
import * as nodemailer from "nodemailer";

const FALLBACK_FROM = '"StayHub" <no-reply@stayhub.com>';

@Injectable()
export class NodemailerEmailAdapter
  implements EmailAdapterInterface, OnModuleInit
{
  private readonly logger = new Logger(NodemailerEmailAdapter.name);
  private transporter!: nodemailer.Transporter;
  private defaultFrom = FALLBACK_FROM;

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  onModuleInit(): void {
    const smtp = this.configService.getOrThrow<ISmtp>("SMTP");

    this.defaultFrom = smtp.from?.trim() || FALLBACK_FROM;

    const transportOptions: nodemailer.TransportOptions = {
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      ...(smtp.service ? { service: smtp.service } : {}),
      ...(smtp.auth ? { auth: smtp.auth } : {}),
    };

    this.transporter = nodemailer.createTransport({
      ...transportOptions,
      defaults: { from: this.defaultFrom },
    });

    void this.verifyConnection();
  }

  async sendEmail(dto: SendEmailDto): Promise<void> {
    if (!dto.to) {
      throw new Error("Email recipient (to) is required");
    }

    const from = dto.from?.trim() || this.defaultFrom;

    try {
      const info = await this.transporter.sendMail({
        from,
        to: dto.to,
        subject: dto.subject,
        text: dto.text,
        html: dto.html,
      });

      this.logger.log(`Email sent to ${dto.to} (id: ${info.messageId})`);

      if (info.rejected.length > 0) {
        this.logger.warn(
          `Some recipients were rejected: ${info.rejected.join(", ")}`,
        );
      }
    } catch (err) {
      this.logger.error(
        `Failed to send email to ${dto.to}`,
        (err as Error)?.stack,
      );
      throw err;
    }
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log("SMTP server is ready to take our messages");
    } catch (err) {
      this.logger.warn(
        `SMTP connection verification failed: ${(err as Error)?.message}`,
      );
    }
  }
}
