import { getFirestore } from 'firebase-admin/firestore';
import { firestore } from '../config/firebase';

const db = getFirestore();
const auditCollection = firestore.collection("otp_logs");

export async function logOtpEvent(data: {
  phone: string;
  event: "sent" | "verified" | "expired" | "failed";
  message?: string;
  ip?: string;
  userAgent?: string;
}) {
  await auditCollection.add({
    phone: data.phone,
    event: data.event,
    message: data.message || null,
    ip: data.ip || null,
    userAgent: data.userAgent || null,
    timestamp: new Date(),
  });
}
