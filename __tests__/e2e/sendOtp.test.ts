import request from 'supertest';
import app from '../../src/app';

jest.mock('../../src/services/providers/FactilizaWhatsAppProvider', () => {
  return {
    FactilizaWhatsAppProvider: jest.fn().mockImplementation(() => ({
      sendOtp: jest.fn().mockResolvedValue(undefined),
    })),
  };
});

describe('POST /api/otp/send', () => {
  it('should respond with OTP sent message', async () => {
    const res = await request(app)
      .post('/api/otp/send')
      .send({
        phoneNumber: '+51999999991',
        channel: 'whatsapp'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/OTP sent|OTP enviado/i);
  });

  it('should prevent OTP re-send before 60s', async () => {
    const res = await request(app)
      .post('/api/otp/send')
      .send({
        phoneNumber: '+51999999991',
        channel: 'whatsapp'
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body.error).toMatch(/esperar/i);
  });
});
