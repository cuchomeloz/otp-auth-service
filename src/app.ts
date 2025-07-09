import express from 'express';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import otpRoutes from './routes/optRoutes';
import protectedRoutes from './routes/protectedRoutes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
});

app.use('/api/otp', limiter);
app.use('/api/otp', otpRoutes);
app.use('/api/protected', protectedRoutes);

export default app;
