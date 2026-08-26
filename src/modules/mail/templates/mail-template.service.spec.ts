import { MailTemplateService } from './mail-template.service';
import { MailTemplate } from '../enums/mail-template.enum';

describe('MailTemplateService', () => {
  const service = new MailTemplateService();

  const fullContext: Record<string, unknown> = {
    firstName: 'Jane',
    otp: '482913',
    expirationMinutes: 10,
    loginUrl: 'http://stayhub.test/login?next=home',
    resetUrl: 'http://stayhub.test/reset?token=abc',
    verificationUrl: 'http://stayhub.test/verify?token=abc',
    propertyTitle: 'Cozy Loft',
    checkIn: '2026-01-01',
    checkOut: '2026-01-05',
    guests: '2',
    totalPrice: '120',
    currency: 'USD',
    bookingId: 'B-123',
    refundAmount: '120 USD',
  };

  it('renders every template without throwing', () => {
    for (const template of Object.values(MailTemplate)) {
      const result = service.render(template, fullContext);
      expect(result.html.length).toBeGreaterThan(100);
      expect(result.subject.length).toBeGreaterThan(0);
      expect(result.text.length).toBeGreaterThan(0);
    }
  });

  it('substitutes the OTP placeholder', () => {
    const result = service.render(MailTemplate.OTP, { otp: '482913' });
    expect(result.html).toContain('482913');
    expect(result.subject).toContain('verification code');
  });

  it('escapes HTML in context values to prevent injection', () => {
    const result = service.render(MailTemplate.WELCOME, {
      firstName: '<script>alert(1)</script>',
    });
    expect(result.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(result.html).not.toContain('<script>alert(1)</script>');
  });

  it('preserves URLs (encoded ampersands) in href attributes', () => {
    const result = service.render(MailTemplate.WELCOME, {
      loginUrl: 'http://stayhub.test/login?next=home&x=1',
    });
    expect(result.html).toContain(
      'http://stayhub.test/login?next=home&amp;x=1',
    );
  });

  it('replaces missing placeholders with empty string', () => {
    const result = service.render(MailTemplate.OTP, {});
    expect(result.html).not.toContain('{{otp}}');
    expect(result.html).not.toMatch(/\{\{\s*\w+\s*\}\}/);
  });

  it('throws on an unknown template type', () => {
    expect(() => service.render('nope' as MailTemplate, {})).toThrow();
  });
});
