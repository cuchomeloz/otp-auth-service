import { generateOtpCode } from '../../src/utils/otpUtils';

describe('generateOtpCode', () => {
  it('should return a 6-digit numeric string', () => {
    const code = generateOtpCode();
    expect(code).toMatch(/^\d{6}$/);
  });

  it('should generate different codes on each call', () => {
    const code1 = generateOtpCode();
    const code2 = generateOtpCode();
    expect(code1).not.toEqual(code2);
  });
});
