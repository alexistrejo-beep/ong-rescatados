import { useCallback, useEffect, useState } from 'react';

const SESSION_KEY = 'huellitas_admin_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000;

function readSession() {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const session = JSON.parse(stored);
    if (!session.token || session.expiresAt <= Date.now()) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export default function useAdminAuth() {
  const [session, setSession] = useState(readSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) return undefined;
    const timeout = window.setTimeout(() => {
      sessionStorage.removeItem(SESSION_KEY);
      setSession(null);
    }, Math.max(0, session.expiresAt - Date.now()));
    return () => window.clearTimeout(timeout);
  }, [session]);

  const login = useCallback(async (password) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (!response.ok || !data.token) throw new Error(data.error || 'No se pudo validar el acceso.');
      const nextSession = { token: data.token, expiresAt: Date.now() + SESSION_DURATION };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      return true;
    } catch (requestError) {
      setError(requestError.message || 'No se pudo validar el acceso.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
    setError('');
  }, []);

  return { isAdmin: Boolean(session), loading, error, login, logout };
}
