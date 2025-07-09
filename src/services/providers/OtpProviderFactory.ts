import { OtpProvider } from "./OtpProvider";
import { TwilioProvider } from "./TwilioProvider";
import { FactilizaWhatsAppProvider } from "./FactilizaWhatsAppProvider";

export function getOtpProvider(channel: string): OtpProvider {
  switch (channel) {
    case "whatsapp":
      return new FactilizaWhatsAppProvider(process.env.FACTILIZA_API_KEY!);
    case "sms":
      return new TwilioProvider(
        process.env.TWILIO_SID!,
        process.env.TWILIO_AUTH_TOKEN!,
        process.env.TWILIO_PHONE_NUMBER!
      );
    default:
      throw new Error(`Unsupported OTP channel: ${channel}`);
  }
}
