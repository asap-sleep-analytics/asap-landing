import { Activity, Lock, MoonStar, ShieldCheck } from 'lucide-react';

function Metric({ label, value, trend }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-heading text-xl text-white">{value}</p>
      <p className="text-xs text-mint">{trend}</p>
    </div>
  );
}

export default function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[270px] rounded-[2.6rem] border border-white/20 bg-[#0a100f] p-2 shadow-mint reveal delay-2">
      <div className="mx-auto mb-2 h-5 w-28 rounded-full bg-white/10" />

      <div className="rounded-[2.1rem] border border-white/10 bg-gradient-to-b from-[#0f1b18] to-[#060908] p-4">
        <div className="flex items-center justify-between text-slate-300">
          <p className="text-sm font-semibold">Sesión nocturna</p>
          <Lock className="h-4 w-4 text-mint" />
        </div>

        <div className="mt-4 rounded-2xl border border-mint/25 bg-mint/10 p-3 text-mint">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Privacidad Primero</p>
          </div>
          <p className="mt-2 text-xs text-mint/90">Procesamiento local de audio activo con Scikit-Learn 1.4.0.</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Metric label="Índice de riesgo" value="18%" trend="Estable" />
          <Metric label="SpO2 prom" value="94" trend="IoT sincronizado" />
          <Metric label="Puntaje sueño" value="82" trend="Sube 6%" />
          <Metric label="Consejos" value="3" trend="Nuevos" />
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <MoonStar className="h-4 w-4 text-mint" />
            <span>Guía de descanso</span>
          </div>
          <Activity className="h-4 w-4 text-mint" />
        </div>
      </div>
    </div>
  );
}
