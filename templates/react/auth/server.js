import express from 'express';
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

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
}

app.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken(user);
  res.json({ token });
});

app.get('/me', authenticateToken, async (req, res) => {
  const { rows } = await pool.query('SELECT id, email FROM users WHERE id = $1', [req.user.id]);
  res.json(rows[0]);
});

export default app;
