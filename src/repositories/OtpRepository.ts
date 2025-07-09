import { getFirestore } from 'firebase-admin/firestore';
import { otpConfig } from '../config/otpConfig';
import { firestore } from "../config/firebase";

const db = getFirestore();
// const otpCollection = db.collection('otp_requests');
const otpCollection = firestore.collection("otp_requests");

export async function saveOtpCode(phone: string, code: string): Promise<void> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + otpConfig.ttlMinutes * 60 * 1000);

  await otpCollection.doc(phone).set({
    code,
    createdAt: now,
    expiresAt,
    attempts: 0,
  });
}

export async function verifyOtpCode(phone: string, inputCode: string) {
  const doc = await otpCollection.doc(phone).get();

  if (!doc.exists) return { success: false, message: 'Código no encontrado' };

  const data = doc.data()!;
  const now = new Date();

  if (data.attempts >= otpConfig.maxAttempts) {
    return { success: false, message: 'Demasiados intentos' };
  }

  if (now > data.expiresAt.toDate()) {
    return { success: false, message: 'Código expirado' };
  }

  if (data.code !== inputCode) {
    await otpCollection.doc(phone).update({ attempts: data.attempts + 1 });
    return { success: false, message: 'Código incorrecto' };
  }

  await otpCollection.doc(phone).delete(); // ⚠️ elimina el OTP usado
  return { success: true };
}
