import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, LogIn, UserPlus } from 'lucide-react';

import { fetchUserProfile, loginUser, registerUser } from '../services/waitlistApi';

const TOKEN_STORAGE_KEY = 'asap_access_token';
const LOGIN_TIME_STORAGE_KEY = 'asap_login_at';

function getStoredToken() {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.localStorage.getItem(TOKEN_STORAGE_KEY) || '';
}

function getStoredLoginAt() {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.localStorage.getItem(LOGIN_TIME_STORAGE_KEY) || '';
}

function formatLoginDate(rawDate) {
  if (!rawDate) {
    return 'Sin registro';
  }

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) {
    return 'Sin registro';
  }

  return date.toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function AuthAccessPanel() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('registro');
  const [form, setForm] = useState({
    nombre_completo: '',
    email: '',
    password: '',
  });
  const [token, setToken] = useState(getStoredToken);
  const [perfil, setPerfil] = useState(null);
  const [loginAt, setLoginAt] = useState(getStoredLoginAt);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    function onAuthMode(event) {
      const requestedMode = event.detail;
      if (requestedMode === 'registro' || requestedMode === 'login') {
        setMode(requestedMode);
      }
    }

    window.addEventListener('asap-auth-mode', onAuthMode);
    return () => window.removeEventListener('asap-auth-mode', onAuthMode);
  }, []);

  useEffect(() => {
    if (!token || perfil || typeof window === 'undefined') {
      return;
    }

    async function loadInitialProfile() {
      try {
        const profileData = await fetchUserProfile(token);
        setPerfil(profileData);
      } catch {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        window.localStorage.removeItem(LOGIN_TIME_STORAGE_KEY);
        setToken('');
        setLoginAt('');
      }
    }

    loadInitialProfile();
  }, [token, perfil]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMensaje('');

    try {
      const payload =
        mode === 'registro'
          ? {
              nombre_completo: form.nombre_completo,
              email: form.email,
              password: form.password,
            }
          : {
              email: form.email,
              password: form.password,
            };

      const response = mode === 'registro' ? await registerUser(payload) : await loginUser(payload);

      setToken(response.access_token);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
      }

      const now = new Date().toISOString();
      setLoginAt(now);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOGIN_TIME_STORAGE_KEY, now);
      }

      setPerfil(response.usuario);
      setMensaje(response.mensaje || 'Autenticación exitosa. Te llevamos al dashboard.');
      setForm((prev) => ({
        ...prev,
        password: '',
      }));

      navigate('/dashboard');
    } catch (submitError) {
      setError(submitError.message || 'No fue posible autenticar en este momento.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadProfile() {
    if (!token) {
      return;
    }

    setLoading(true);
    setError('');
    setMensaje('');

    try {
      const data = await fetchUserProfile(token);
      setPerfil(data);
      setMensaje('Perfil cargado correctamente.');
    } catch (profileError) {
      setError(profileError.message || 'No fue posible cargar el perfil.');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken('');
    setPerfil(null);
    setLoginAt('');
    setMensaje('Sesión cerrada.');
    setError('');
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.localStorage.removeItem(LOGIN_TIME_STORAGE_KEY);
    }
  }

  return (
    <div className="glass-panel reveal delay-2 rounded-3xl p-6 md:p-8">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-mint/35 bg-mint/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-mint">
        <KeyRound className="h-3.5 w-3.5" />
        Acceso Seguro
      </div>

      <h3 className="font-heading text-2xl text-white">Registro e inicio de sesión</h3>
      <p className="mt-2 text-sm text-slate-300">Accede con JWT para consumir endpoints protegidos de la plataforma.</p>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => setMode('registro')}
          className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
            mode === 'registro' ? 'bg-mint text-black' : 'border border-white/20 text-slate-200'
          }`}
        >
          Registro
        </button>
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
            mode === 'login' ? 'bg-mint text-black' : 'border border-white/20 text-slate-200'
          }`}
        >
          Login
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {mode === 'registro' ? (
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-slate-300">Nombre completo</span>
            <input
              required
              name="nombre_completo"
              type="text"
              value={form.nombre_completo}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-mint"
              placeholder="Tu nombre"
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-slate-300">Correo</span>
          <input
            required
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-mint"
            placeholder="tu@correo.com"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-slate-300">Contraseña</span>
          <input
            required
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-mint"
            placeholder="Mínimo 8 caracteres"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-mint px-5 py-3 text-sm font-bold text-black transition hover:bg-mintdeep"
        >
          {mode === 'registro' ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
          {loading ? 'Procesando...' : mode === 'registro' ? 'Crear cuenta' : 'Iniciar sesión'}
        </button>
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleLoadProfile}
          disabled={!isAuthenticated || loading}
          className="rounded-lg border border-mint/35 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-mint transition hover:bg-mint/10 disabled:opacity-40"
        >
          Refrescar perfil
        </button>
        <button
          type="button"
          onClick={handleLogout}
          disabled={!isAuthenticated}
          className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:bg-white/10 disabled:opacity-40"
        >
          Cerrar sesión
        </button>
      </div>

      {mensaje ? <p className="mt-4 text-sm text-mint">{mensaje}</p> : null}
      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

      {isAuthenticated ? (
        <section className="mt-6 rounded-xl border border-mint/35 bg-mint/10 p-4 text-sm text-slate-100">
          <h4 className="font-heading text-lg text-white">Dashboard rápido</h4>
          <p className="mt-1 text-slate-200">Ya ingresaste a la plataforma. Puedes abrir el dashboard completo.</p>

          <div className="mt-4 grid gap-2 rounded-lg border border-white/10 bg-black/30 p-3 text-sm sm:grid-cols-2">
            <p>
              <strong>Estado:</strong> Autenticado
            </p>
            <p>
              <strong>Ingreso:</strong> {formatLoginDate(loginAt)}
            </p>
            <p>
              <strong>Usuario:</strong> {perfil?.nombre_completo || 'Cargando...'}
            </p>
            <p>
              <strong>Correo:</strong> {perfil?.email || 'Cargando...'}
            </p>
          </div>

          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-mint">Modo beta: dashboard mínimo funcional</p>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-mint/40 bg-mint/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-mint transition hover:bg-mint/25"
          >
            Ir al dashboard
          </button>
        </section>
      ) : (
        <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
          Inicia sesión para ver tu dashboard de acceso.
        </div>
      )}
    </div>
  );
}
