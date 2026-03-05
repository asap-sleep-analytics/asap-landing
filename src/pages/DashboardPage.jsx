import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, LogOut, RefreshCw, ShieldCheck, UserCircle2, Users } from 'lucide-react';

import { fetchDashboardSummary } from '../services/waitlistApi';

const TOKEN_STORAGE_KEY = 'asap_access_token';

function getStoredToken() {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.localStorage.getItem(TOKEN_STORAGE_KEY) || '';
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <article className="rounded-xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center gap-2 text-mint">
        <Icon className="h-4 w-4" />
        <p className="text-xs uppercase tracking-[0.14em]">{label}</p>
      </div>
      <p className="mt-2 font-heading text-2xl text-white">{value}</p>
    </article>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState(getStoredToken);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  async function loadDashboard() {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const summary = await fetchDashboardSummary(token);
      setData(summary);
    } catch (loadError) {
      setError(loadError.message || 'No fue posible cargar el dashboard.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [token]);

  function handleLogout() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.localStorage.removeItem('asap_login_at');
    }
    setToken('');
    navigate('/');
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-grain px-5 py-12 text-white md:px-8">
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-black/35 p-6 text-center">
          <p className="text-sm uppercase tracking-[0.16em] text-mint">Acceso requerido</p>
          <h1 className="mt-3 font-heading text-3xl text-white">Debes iniciar sesión</h1>
          <p className="mt-3 text-slate-300">No encontramos un token activo. Entra por login para ver tu dashboard.</p>
          <Link
            to="/#acceso"
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-mint/40 bg-mint/15 px-4 py-3 text-sm font-semibold text-mint transition hover:bg-mint/25"
          >
            <ArrowLeft className="h-4 w-4" />
            Ir a login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grain px-5 py-8 text-white md:px-8">
      <header className="mx-auto mb-6 flex w-full max-w-6xl flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-mint">A.S.A.P.</p>
          <h1 className="font-heading text-3xl text-white">Dashboard</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/30 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <button
            type="button"
            onClick={loadDashboard}
            className="inline-flex items-center gap-2 rounded-xl border border-mint/35 px-4 py-2 text-sm text-mint transition hover:bg-mint/10"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-4">
        {loading ? <p className="text-slate-300">Cargando dashboard...</p> : null}
        {error ? <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-rose-200">{error}</p> : null}

        {data ? (
          <>
            <section className="rounded-2xl border border-mint/30 bg-mint/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-mint">Sesión activa</p>
                  <h2 className="mt-2 font-heading text-2xl text-white">Hola, {data.usuario.nombre_completo}</h2>
                  <p className="mt-1 text-sm text-slate-100">Correo: {data.usuario.email}</p>
                </div>
                <ShieldCheck className="h-6 w-6 text-mint" />
              </div>
            </section>

            <section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard icon={Users} label="Usuarios" value={data.metricas.total_usuarios} />
              <MetricCard icon={BarChart3} label="Leads" value={data.metricas.total_leads} />
              <MetricCard icon={ShieldCheck} label="Confirmados" value={data.metricas.leads_confirmados} />
              <MetricCard icon={UserCircle2} label="Pendientes" value={data.metricas.leads_pendientes} />
            </section>

            <section className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <h3 className="font-heading text-xl text-white">Sugerencias iniciales</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-200">
                {data.sugerencias.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
