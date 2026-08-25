import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { MailTemplate } from '../enums/mail-template.enum';

interface TemplateMeta {
  file: string;
  subject: (ctx: Record<string, unknown>) => string;
}

const DEFAULT_APP_NAME = 'StayHub';

const TEMPLATES: Record<MailTemplate, TemplateMeta> = {
  [MailTemplate.OTP]: {
    file: 'otp-template.html',
    subject: (c) => `Your ${appName(c)} verification code`,
  },
  [MailTemplate.WELCOME]: {
    file: 'welcome-template.html',
    subject: (c) => `Welcome to ${appName(c)}, ${str(c.firstName, 'there')}!`,
  },
  [MailTemplate.PASSWORD_RESET]: {
    file: 'password-reset-template.html',
    subject: (c) => `Reset your ${appName(c)} password`,
  },
  [MailTemplate.EMAIL_VERIFICATION]: {
    file: 'email-verification-template.html',
    subject: (c) => `Verify your ${appName(c)} email`,
  },
  [MailTemplate.BOOKING_CONFIRMATION]: {
    file: 'booking-confirmation-template.html',
    subject: (c) => `Booking confirmed – ${str(c.propertyTitle, 'your stay')}`,
  },
  [MailTemplate.BOOKING_CANCELLATION]: {
    file: 'booking-cancellation-template.html',
    subject: (c) =>
      `Your booking was cancelled – ${str(c.propertyTitle, 'your stay')}`,
  },
  [MailTemplate.BOOKING_REMINDER]: {
    file: 'booking-reminder-template.html',
    subject: (c) =>
      `Reminder: your stay at ${str(c.propertyTitle, 'StayHub')} starts soon`,
  },
};

export interface RenderedMail {
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class MailTemplateService {
  private readonly logger = new Logger(MailTemplateService.name);
  private readonly cache = new Map<string, string>();

  render(
    template: MailTemplate,
    context: Record<string, unknown>,
  ): RenderedMail {
    const meta = TEMPLATES[template];
    if (!meta) {
      throw new Error(`Unknown mail template: ${template}`);
    }

    const enriched = this.withDefaults(context);
    const html = this.interpolate(this.readTemplate(meta.file), enriched);
    const subject = this.interpolate(meta.subject(enriched), enriched);

    return {
      subject,
      html,
      text: this.htmlToText(html),
    };
  }

  private withDefaults(
    context: Record<string, unknown>,
  ): Record<string, unknown> {
    return {
      appName: DEFAULT_APP_NAME,
      year: new Date().getFullYear(),
      ...context,
    };
  }

  private readTemplate(file: string): string {
    const cached = this.cache.get(file);
    if (cached) {
      return cached;
    }

    const absolute = join(__dirname, file);
    const content = readFileSync(absolute, 'utf-8');
    this.cache.set(file, content);
    return content;
  }

  private interpolate(
    template: string,
    context: Record<string, unknown>,
  ): string {
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
      const value = context[key];
      if (value === undefined || value === null) {
        return '';
      }
      return escapeHtml(String(value));
    });
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<br\s*\/?>(?=)/gi, '\n')
      .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}

function appName(ctx: Record<string, unknown>): string {
  return str(ctx.appName, DEFAULT_APP_NAME);
}

function str(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
