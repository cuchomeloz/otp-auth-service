export interface OtpProvider {
  sendOtp(phoneNumber: string, message: string): Promise<void>;
}
