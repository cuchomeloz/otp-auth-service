import { OtpProvider } from './providers/OtpProvider';
import { generateOtpCode } from '../utils/otpUtils';
import { otpConfig } from '../config/otpConfig';

export class OptService {
  constructor(private provider: OtpProvider) {}

  async sendOtp(phoneNumber: string): Promise<string> {
    const code = generateOtpCode();
    const link = `${process.env.OTP_BASE_URL}?code=${code}`;
    const message =
      `*Tu código MotoCuy:* \`\`\`${code}\`\`\`\n` +
      `_Este código expira en ${otpConfig.ttlMinutes} minutos._\n` +
      `_Por tu seguridad, no compartas este código con nadie._`;

    await this.provider.sendOtp(phoneNumber, message);
    return code;
  }
}
