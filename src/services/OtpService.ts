import { OtpProvider } from './providers/OtpProvider';
import { generateOtpCode } from '../utils/otpUtils';
import { otpConfig } from '../config/otpConfig';
import {
  deleteOtpCode,
  getLastOtpByPhone,
  saveOtpCode,
} from '../repositories/OtpRepository';

export class OptService {
  constructor(private provider: OtpProvider) {}

  async sendOtp(phoneNumber: string): Promise<string> {
    const lastOtp = await getLastOtpByPhone(phoneNumber);

    if (lastOtp?.createdAt?.toDate) {
      const now = new Date();
      const createdAt = lastOtp.createdAt.toDate();
      const diffMs = now.getTime() - createdAt.getTime();

      if (diffMs < 60000) {
        const secondsLeft = Math.ceil((60000 - diffMs) / 1000);
        throw new Error(
          `Debes esperar ${secondsLeft} segundos antes de reenviar el OTP.`
        );
      }
    }

    await deleteOtpCode(phoneNumber);

    const code = generateOtpCode();
    const link = `${process.env.OTP_BASE_URL}?code=${code}`;
    const message =
      `*Tu código MotoCuy:* \`\`\`${code}\`\`\`\n` +
      `_Este código expira en ${otpConfig.ttlMinutes} minutos._\n` +
      `_Por tu seguridad, no compartas este código con nadie._`;

    await this.provider.sendOtp(phoneNumber, message);
    await saveOtpCode(phoneNumber, code);

    return code;
  }
}
