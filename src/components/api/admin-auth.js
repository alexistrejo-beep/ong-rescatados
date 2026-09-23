import crypto from 'node:crypto';

export default function handler(req, res, environmentPassword = process.env.ADMIN_PASSWORD) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const configuredPassword = environmentPassword;
  const submittedPassword = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!configuredPassword || !submittedPassword) return res.status(401).json({ error: 'Credenciales inválidas.' });

  const expected = Buffer.from(configuredPassword);
  const received = Buffer.from(submittedPassword);
  const valid = expected.length === received.length && crypto.timingSafeEqual(expected, received);
  if (!valid) return res.status(401).json({ error: 'Credenciales inválidas.' });

  return res.status(200).json({ token: crypto.randomBytes(32).toString('hex') });
}