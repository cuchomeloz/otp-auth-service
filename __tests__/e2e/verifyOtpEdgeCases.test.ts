import request from 'supertest';
import app from '../../src/app';
import { firestore } from '../../src/config/firebase';

describe('POST /api/otp/verify edge cases', () => {
  const phoneNumber = '+51988888888';

  beforeAll(async () => {
    // Insertamos un OTP ya expirado manualmente
    const now = new Date();
    const expiredDate = new Date(now.getTime() - 10 * 60 * 1000); // 10 min atrás

    await firestore.collection('otp_requests').doc(phoneNumber).set({
      code: '123456',
      createdAt: expiredDate,
      expiresAt: expiredDate,
      attempts: 0
    });
  });

  it('should fail with expired OTP', async () => {
    const res = await request(app)
      .post('/api/otp/verify')
      .send({
        phoneNumber,
        code: '123456'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/expirado/i);
  });

  it('should fail after 5 incorrect attempts', async () => {
    const validCode = '111222';

    await firestore.collection('otp_requests').doc(phoneNumber).set({
      code: validCode,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60000),
      attempts: 5
    });

    // Intento 5 incorrecto
    const res1 = await request(app)
      .post('/api/otp/verify')
      .send({
        phoneNumber,
        code: '000000' // incorrecto
      });

    expect(res1.statusCode).toBe(400);
    expect(res1.body.error).toMatch(/Demasiados intentos|intentos/i);

    // Confirmamos que no permite más después del máximo
    const res2 = await request(app)
      .post('/api/otp/verify')
      .send({
        phoneNumber,
        code: validCode // aunque sea correcto
      });

    expect(res2.statusCode).toBe(400);
    expect(res2.body.error).toMatch(/intentos/i);
  });
});
