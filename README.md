# 🛡️ OTP Auth Service - DEVANTA_CODE

Este es un microservicio de autenticación OTP (One-Time Password) desarrollado en **Node.js + TypeScript** para la app **MotoCuy**, orientado a verificar usuarios mediante **WhatsApp** y, opcionalmente, **SMS**.

## 🚀 Funcionalidades

- Generación de OTP de 6 dígitos
- Envío de OTP por WhatsApp (Factiliza)
- Validación de código OTP
- Expiración automática (TTL en Firestore)
- Límite de intentos configurables
- Prevención de reenvíos rápidos (timeout de 60s)
- Logs de auditoría (sent, verified, failed, expired)
- Generación de AccessToken (JWT) tras verificación
- Endpoints protegidos con middleware de autenticación
- Tests unitarios y E2E con Jest + Supertest

---
## 📦 Instalación
### ⚙️ Variables de entorno
Copia `.env.example` y personalízalo:

```bash
cp .env.example .env
```

---
## 🧪 Tests

```bash
npm run test
```

Incluye:
- Unit tests (`generateOtpCode`)
- E2E tests (`/send`, `/verify`, intentos y expiración)

## 🛠 Tecnologías usadas

- Node.js + TypeScript
- Express.js
- Firebase Admin SDK (Firestore)
- Twilio / Factiliza (proveedores OTP)
- JWT
- Jest + Supertest

---

## 🧱 Endpoints

### `POST /api/otp/send`

Envia un código OTP por WhatsApp o SMS.

```json
{
  "phoneNumber": "+51999999999",
  "channel": "whatsapp" // o "sms"
}
```

### `POST /api/otp/verify`

Verifica el código enviado y retorna un accessToken.

```json
{
  "phoneNumber": "+51999999999",
  "code": "123456"
}
```

---
## 🧑‍💻 Autor

Desarrollado por **Ñ** para el backend del sistema de autenticación de **MotoCuy** 🛵
