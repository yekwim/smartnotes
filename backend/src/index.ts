import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import v1Router from './router/v1Router';

const app = express();

app.use(helmet({
  hidePoweredBy: true,
  xContentTypeOptions: true,
  hsts: true
}));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(globalLimiter);

app.use('/v1', v1Router);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`SmartNotes API rodando na porta ${PORT}`);
});