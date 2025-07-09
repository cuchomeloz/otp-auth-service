export const otpConfig = {
  ttlMinutes: parseInt(process.env.OTP_TTL_MINUTES || "5", 10),
  maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || "5", 10),
};
