import axios from "axios";
import { OtpProvider } from "./OtpProvider";

export class FactilizaWhatsAppProvider implements OtpProvider {
  constructor(private apiKey: string) {}

  async sendOtp(phoneNumber: string, message: string): Promise<void> {
    try {
      const response = await axios.post(
        `https://apiwsp.factiliza.com/v1/message/sendtext/${process.env.FACTILIZA_NAME_INSTANCE}`,
        {
          number: phoneNumber,
          text: message,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to send OTP via WhatsApp.");
      }
    } catch (error: any) {
      throw new Error(`Factiliza WhatsApp error: ${error.message}`);
    }
  }
}
