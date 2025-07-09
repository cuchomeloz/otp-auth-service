import { Twilio } from "twilio";
import { OtpProvider } from "./OtpProvider";

export class WhatsAppProvider implements OtpProvider {
  private client: Twilio;

  constructor(accountSid: string, authToken: string, private fromWhatsAppNumber: string) {
    this.client = new Twilio(accountSid, authToken);
  }

  async sendOtp(phoneNumber: string, message: string): Promise<void> {
    await this.client.messages.create({
      body: message,
      from: `whatsapp:${this.fromWhatsAppNumber}`,
      to: `whatsapp:${phoneNumber}`,
    });
  }
}
