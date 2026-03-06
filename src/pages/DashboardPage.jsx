import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  BellRing,
  LogOut,
  Mic,
  MoonStar,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import {
  calibrateSleepEnvironment,
  fetchDashboardSummary,
  finishSleepSession,
  listSleepSessions,
  startSleepSession,
} from '../services/waitlistApi';

const TOKEN_STORAGE_KEY = 'asap_access_token';
const ACTIVE_SESSION_STORAGE_KEY = 'asap_active_sleep_session';

function getStoredToken() {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.localStorage.getItem(TOKEN_STORAGE_KEY) || '';
}

function getStoredActiveSession() {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY) || '';
}

function MetricCard({ icon: Icon, label, value, sub }) {
  return (
    <article className="rounded-xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center gap-2 text-mint">
        <Icon className="h-4 w-4" />
        <p className="text-xs uppercase tracking-[0.14em]">{label}</p>
      </div>
      <p className="mt-2 font-heading text-2xl text-white">{value}</p>
      {sub ? <p className="mt-1 text-xs text-slate-300">{sub}</p> : null}
    </article>
  );
}

function ContinuityChart({ points }) {
  if (!points || points.length === 0) {
    return <p className="text-sm text-slate-300">Aún no hay datos de continuidad para graficar.</p>;
  }

  return (
    <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="flex min-h-24 items-end gap-1 overflow-x-auto">
        {points.map((point) => {
          const interruption = point.estado === 'interrupcion';
          return (
            <div key={`${point.minuto}-${point.estado}`} className="flex flex-col items-center gap-1">
              <div
                className={`w-2 rounded-sm ${interruption ? 'h-6 bg-rose-300/90' : 'h-14 bg-mint/85'}`}
                title={`Min ${point.minuto}: ${point.estado}`}
              />
              <span className="text-[10px] text-slate-400">{point.minuto}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-slate-300">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded bg-mint/85" />
          Sueño continuo
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded bg-rose-300/90" />
          Interrupciones
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState(getStoredToken);
  const [activeSessionId, setActiveSessionId] = useState(getStoredActiveSession);
  const [data, setData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const [ambientNoiseLevel, setAmbientNoiseLevel] = useState(38);
  const [calibration, setCalibration] = useState(null);

  const [snoreCount, setSnoreCount] = useState(8);
  const [apneaEvents, setApneaEvents] = useState(2);
  const [avgOxygen, setAvgOxygen] = useState(95);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);
  const isMonitoring = useMemo(() => Boolean(activeSessionId), [activeSessionId]);

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

  async function loadSessions() {
    if (!token) {
      return;
    }

    try {
      const history = await listSleepSessions(token, 8);
      setSessions(history);
    } catch {
      // No bloquea dashboard; historial es complementario.
    }
  }

  useEffect(() => {
    loadDashboard();
    loadSessions();
  }, [token]);

  function handleLogout() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.localStorage.removeItem('asap_login_at');
      window.localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    }
    setToken('');
    setActiveSessionId('');
    navigate('/');
  }

  async function handleCalibrate() {
    setActionMessage('');
    setError('');
    try {
      const result = await calibrateSleepEnvironment(Number(ambientNoiseLevel));
      setCalibration(result);
      setActionMessage(result.mensaje);
    } catch (calibrationError) {
      setError(calibrationError.message || 'No fue posible calibrar el micrófono.');
    }
  }

  async function handleStartMonitoring() {
    if (!token) {
      return;
    }
    setActionMessage('');
    setError('');

    try {
      const started = await startSleepSession(token, {
        ambient_noise_level: Number(ambientNoiseLevel),
      });
      const sessionId = started.sesion.session_id;
      setActiveSessionId(sessionId);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, sessionId);
      }
      setActionMessage(started.mensaje);
      await loadSessions();
    } catch (startError) {
      setError(startError.message || 'No fue posible iniciar monitoreo.');
    }
  }

  async function handleFinishMonitoring() {
    if (!token || !activeSessionId) {
      return;
    }

    setActionMessage('');
    setError('');
    try {
      const finished = await finishSleepSession(token, activeSessionId, {
        snore_count: Number(snoreCount),
        apnea_events: Number(apneaEvents),
        avg_oxygen: Number(avgOxygen),
        ambient_noise_level: Number(ambientNoiseLevel),
      });

      setActionMessage(finished.mensaje);
      setActiveSessionId('');
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
      }

      await loadDashboard();
      await loadSessions();
    } catch (finishError) {
      setError(finishError.message || 'No fue posible finalizar monitoreo.');
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-grain px-5 py-12 text-white md:px-8">
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-black/35 p-6 text-center">
          <p className="text-sm uppercase tracking-[0.16em] text-mint">Acceso requerido</p>
          <h1 className="mt-3 font-heading text-3xl text-white">Debes iniciar sesión</h1>
          <p className="mt-3 text-slate-300">No encontramos un token activo. Entra por login para ver tu dashboard.</p>
          <Link
            to="/"
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
        {actionMessage ? <p className="rounded-xl border border-mint/30 bg-mint/10 p-3 text-mint">{actionMessage}</p> : null}

        {data ? (
          <>
            <section className="rounded-2xl border border-mint/30 bg-mint/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-mint">Estado del usuario</p>
                  <h2 className="mt-2 font-heading text-2xl text-white">Hola, {data.usuario.nombre_completo}</h2>
                  <p className="mt-1 text-sm text-slate-100">Correo: {data.usuario.email}</p>
                  <p className="mt-1 text-xs text-slate-200">
                    Perfil: Ronquido {data.usuario.ronca_habitualmente ? 'sí' : 'no'} | Cansancio diurno{' '}
                    {data.usuario.cansancio_diurno ? 'sí' : 'no'}
                  </p>
                </div>
                <ShieldCheck className="h-6 w-6 text-mint" />
              </div>
            </section>

            <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <MetricCard
                icon={MoonStar}
                label="Sleep Score"
                value={data.indicadores.sleep_score}
                sub="Escala 0 - 100"
              />
              <MetricCard
                icon={BarChart3}
                label="Eventos Apnea/Ronquido"
                value={data.indicadores.eventos_apnea_ronquido.total}
                sub={`Apnea: ${data.indicadores.eventos_apnea_ronquido.apnea} | Ronquido: ${data.indicadores.eventos_apnea_ronquido.ronquidos}`}
              />
              <MetricCard icon={BellRing} label="Alertas Push" value="Beta" sub="Notificaciones en próxima iteración" />
            </section>

            <section className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <h3 className="font-heading text-xl text-white">Gráfica de continuidad nocturna</h3>
              <ContinuityChart points={data.indicadores.continuidad} />
            </section>

            <section className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-heading text-xl text-white">Sesión nocturna</h3>
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs uppercase tracking-[0.14em] text-slate-400"
                >
                  <Sparkles className="h-4 w-4" />
                  Premium (Coming Soon)
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-mint">Calibración de micrófono</p>
                  <label className="mt-3 block text-sm text-slate-200">
                    Ruido ambiente (dB)
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={ambientNoiseLevel}
                      onChange={(event) => setAmbientNoiseLevel(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-white outline-none focus:border-mint"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleCalibrate}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-mint/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-mint transition hover:bg-mint/10"
                  >
                    <Mic className="h-4 w-4" />
                    Calibrar
                  </button>
                  {calibration ? <p className="mt-3 text-sm text-slate-200">{calibration.recomendacion}</p> : null}
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-mint">Monitoreo</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    <label className="text-sm text-slate-200">
                      Ronquidos
                      <input
                        type="number"
                        min="0"
                        value={snoreCount}
                        onChange={(event) => setSnoreCount(event.target.value)}
                        className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-2 py-2 text-white outline-none focus:border-mint"
                      />
                    </label>
                    <label className="text-sm text-slate-200">
                      Apnea
                      <input
                        type="number"
                        min="0"
                        value={apneaEvents}
                        onChange={(event) => setApneaEvents(event.target.value)}
                        className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-2 py-2 text-white outline-none focus:border-mint"
                      />
                    </label>
                    <label className="text-sm text-slate-200">
                      SpO2 prom
                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={avgOxygen}
                        onChange={(event) => setAvgOxygen(event.target.value)}
                        className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-2 py-2 text-white outline-none focus:border-mint"
                      />
                    </label>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleStartMonitoring}
                      disabled={isMonitoring}
                      className="inline-flex items-center gap-2 rounded-lg bg-mint px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-mintdeep disabled:opacity-40"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Iniciar monitoreo
                    </button>
                    <button
                      type="button"
                      onClick={handleFinishMonitoring}
                      disabled={!isMonitoring}
                      className="inline-flex items-center gap-2 rounded-lg border border-mint/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-mint transition hover:bg-mint/10 disabled:opacity-40"
                    >
                      <PauseCircle className="h-4 w-4" />
                      Finalizar monitoreo
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-slate-300">
                    Estado: {isMonitoring ? `Monitoreando (sesión ${activeSessionId.slice(0, 8)}...)` : 'Sin sesión activa'}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <h3 className="font-heading text-xl text-white">Sugerencias iniciales</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-200">
                {data.sugerencias.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="mt-4 text-xs text-slate-400">{data.disclaimer_medico}</p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <h3 className="font-heading text-xl text-white">Historial reciente</h3>
              {sessions.length === 0 ? (
                <p className="mt-2 text-sm text-slate-300">Sin sesiones registradas aún.</p>
              ) : (
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-slate-200">
                    <thead className="text-xs uppercase tracking-[0.12em] text-slate-400">
                      <tr>
                        <th className="px-2 py-2">Inicio</th>
                        <th className="px-2 py-2">Fin</th>
                        <th className="px-2 py-2">Score</th>
                        <th className="px-2 py-2">Eventos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((session) => (
                        <tr key={session.session_id} className="border-t border-white/10">
                          <td className="px-2 py-2">{new Date(session.start_time).toLocaleString('es-CO')}</td>
                          <td className="px-2 py-2">
                            {session.end_time ? new Date(session.end_time).toLocaleString('es-CO') : 'Activa'}
                          </td>
                          <td className="px-2 py-2">{session.sleep_score ?? '-'}</td>
                          <td className="px-2 py-2">{(session.snore_count || 0) + (session.apnea_events || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
