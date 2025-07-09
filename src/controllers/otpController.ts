import { Request, Response } from 'express';
import { OptService } from '../services/OtpService';
import { getOtpProvider } from '../services/providers/OtpProviderFactory';
import { verifyOtpCode } from '../repositories/OtpRepository';
import { logOtpEvent } from '../services/OtpAuditService';
import { generateAccessToken } from '../utils/jwtUtils';

export const sendOtp = async (req: Request, res: Response) => {
  const { phoneNumber, channel = 'whatsapp' } = req.body;

  try {
    const provider = getOtpProvider(channel);
    const otpService = new OptService(provider);

    const code = await otpService.sendOtp(phoneNumber);
    await logOtpEvent({ phone: phoneNumber, event: 'sent' });
    res
      .status(200)
      .json({
        message: `OTP sent via ${channel}`,
        code: process.env.NODE_ENV === 'test' ? code : undefined,
      });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { phoneNumber, code } = req.body;

  try {
    const result = await verifyOtpCode(phoneNumber, code);

    if (result.success) {
      await logOtpEvent({
        phone: phoneNumber,
        event: 'verified',
        ip: req.ip,
        userAgent: req.headers['user-agent'] as string,
      });
      const token = generateAccessToken({ phone: phoneNumber });
      return res.status(200).json({
        message: 'OTP verificado correctamente',
        accessToken: token,
      });
    } else {
      await logOtpEvent({
        phone: phoneNumber,
        event: result.message === 'Código expirado' ? 'expired' : 'failed',
        message: result.message,
        ip: req.ip,
        userAgent: req.headers['user-agent'] as string,
      });

      return res.status(400).json({ error: result.message });
    }
  } catch (error: any) {
    await logOtpEvent({
      phone: phoneNumber,
      event: 'failed',
      message: error.message,
      ip: req.ip,
      userAgent: req.headers['user-agent'] as string,
    });

    return res.status(500).json({ error: error.message });
  }
};
