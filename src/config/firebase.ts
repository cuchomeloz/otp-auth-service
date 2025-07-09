import * as admin from "firebase-admin";
import serviceAccount from "../../credentials/serviceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const firestore = admin.firestore();
