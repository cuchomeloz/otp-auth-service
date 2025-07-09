import request from 'supertest';
import app from '../../src/app';

jest.mock('../../src/services/providers/FactilizaWhatsAppProvider', () => {
  return {
    FactilizaWhatsAppProvider: jest.fn().mockImplementation(() => ({
      sendOtp: jest.fn().mockResolvedValue(undefined),
    })),
  };
});


describe('POST /api/otp/verify', () => {
  const phoneNumber = '+51999999991';

  it('should verify a valid OTP', async () => {
    // Enviar un OTP
    const sendRes = await request(app)
      .post('/api/otp/send')
      .send({
        phoneNumber,
        channel: 'whatsapp'
      });

    expect(sendRes.statusCode).toBe(200);
    expect(sendRes.body.code).toMatch(/^\d{6}$/);

    console.log("OTP CODE RECEIVED:", sendRes.body.code);
    const otpCode = sendRes.body.code;


    // Verificar el OTP recibido
    const verifyRes = await request(app)
    .post('/api/otp/verify')
    .send({
      phoneNumber,
      code: otpCode
    });

    console.log("VERIFY RESPONSE:", verifyRes.body);
    expect(verifyRes.statusCode).toBe(200);
    expect(verifyRes.body.message).toMatch(/verificado/i);
    expect(verifyRes.body.accessToken).toBeDefined();
  });

  it('should fail with incorrect OTP', async () => {
    const res = await request(app)
      .post('/api/otp/verify')
      .send({
        phoneNumber,
        code: '000000'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/incorrecto|no encontrado|expirado/i);
  });
});
