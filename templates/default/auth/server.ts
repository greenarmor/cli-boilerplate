import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import rateLimit from 'express-rate-limit';

const pool = new Pool({
  // TODO: configure your database connection
});

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// Rate limiter for login endpoint: max 5 requests per minute per IP
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { error: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for /me endpoint: max 30 requests per 15 minutes per IP
const meLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

interface UserPayload {
  id: number;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

function generateToken(user: UserPayload): string {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET) as UserPayload;
    next();
  } catch {
    res.sendStatus(401);
  }
}

app.post('/login', loginLimiter, async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  const { rows } = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken(user);
  res.json({ token });
});

app.get('/me', authenticateToken, meLimiter, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { rows } = await pool.query('SELECT id, email FROM users WHERE id = $1', [req.user!.id]);
  res.json(rows[0]);
});

export default app;
