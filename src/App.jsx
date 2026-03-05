import {
  ArrowDownToLine,
  Brain,
  HeartPulse,
  LogIn,
  Lock,
  MoonStar,
  ShieldCheck,
  Smartphone,
  UserPlus,
  Watch,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import ArchitectureFlow from './components/ArchitectureFlow';
import AuthAccessPanel from './components/AuthAccessPanel';
import BentoFeatureCard from './components/BentoFeatureCard';
import PhoneMockup from './components/PhoneMockup';
import WaitlistForm from './components/WaitlistForm';

function openAuthMode(mode) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('asap-auth-mode', { detail: mode }));
  }
}

function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-obsidian/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#hero" className="font-heading text-lg tracking-[0.16em] text-white">
          A.S.A.P.
        </a>

        <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          <a href="#features" className="transition hover:text-mint">
            Funciones
          </a>
          <a href="#acceso" className="transition hover:text-mint">
            Acceso
          </a>
          <a href="#privacy" className="transition hover:text-mint">
            Privacidad
          </a>
          <a href="#architecture" className="transition hover:text-mint">
            Arquitectura
          </a>
          <Link to="/dashboard" className="transition hover:text-mint">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#acceso"
            onClick={() => openAuthMode('login')}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-100 transition hover:bg-white/10"
          >
            <LogIn className="h-3.5 w-3.5" />
            Iniciar sesión
          </a>
          <a
            href="#acceso"
            onClick={() => openAuthMode('registro')}
            className="inline-flex items-center gap-2 rounded-full border border-mint/40 bg-mint/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-mint transition hover:bg-mint/25"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Registro
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="hero" className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-16 pt-10 md:px-8 lg:grid-cols-2 lg:items-center lg:pt-16">
      <div>
        <p className="reveal inline-flex items-center gap-2 rounded-full border border-mint/35 bg-mint/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-mint">
          Salud del sueño primero
        </p>

        <h1 className="reveal delay-1 mt-5 font-heading text-4xl leading-[1.05] text-white sm:text-5xl">
          Detecta riesgo de apnea antes y despierta con más confianza.
        </h1>

        <p className="reveal delay-2 mt-5 max-w-xl text-base leading-7 text-slate-300">
          A.S.A.P. es una plataforma mobile-first para personas reales, no para dashboards fríos. Ejecuta análisis
          respiratorio privado, recibe guía práctica del sueño y monitorea tus noches en una sola app.
        </p>

        <div className="reveal delay-3 mt-7 flex flex-wrap gap-3">
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 rounded-xl bg-mint px-5 py-3 text-sm font-bold text-black transition hover:bg-mintdeep"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Descargar app (próximamente)
          </a>

          <a
            href="#acceso"
            onClick={() => openAuthMode('login')}
            className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-black/35 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            <LogIn className="h-4 w-4" />
            Ya tengo cuenta
          </a>

          <a
            href="#acceso"
            onClick={() => openAuthMode('registro')}
            className="inline-flex items-center gap-2 rounded-xl border border-mint/35 bg-black/35 px-4 py-3 text-sm text-slate-100 transition hover:bg-mint/10"
          >
            <Lock className="h-4 w-4 text-mint" />
            Crear cuenta
          </a>
        </div>

        <div className="reveal delay-3 mt-7 grid max-w-lg grid-cols-1 gap-2 text-xs uppercase tracking-[0.12em] text-slate-300 sm:grid-cols-3">
          <p className="rounded-full border border-white/15 px-3 py-2 text-center">1. Más salud</p>
          <p className="rounded-full border border-white/15 px-3 py-2 text-center">2. Inteligencia ML clásica</p>
          <p className="rounded-full border border-white/15 px-3 py-2 text-center">3. Uso diario simple</p>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute -left-8 top-16 h-44 w-44 rounded-full bg-mint/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-56 w-56 rounded-full bg-mint/10 blur-3xl" />
        <PhoneMockup />
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8">
      <div className="mb-8 reveal">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mint">Funciones en bento grid</p>
        <h2 className="mt-3 font-heading text-3xl text-white">Desde ML clásico hasta coaching diario del sueño</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <BentoFeatureCard
          icon={Brain}
          tag="ML"
          title="Análisis con ML clásico"
          description="Un pipeline con Scikit-Learn 1.4.0 estima el riesgo de apnea desde metadatos respiratorios con salida clara e interpretable."
          className="delay-1"
        />

        <BentoFeatureCard
          icon={Watch}
          tag="IoT"
          title="Integración con oxímetro"
          description="Sincroniza señales SpO2 de wearables y oxímetros compatibles para enriquecer el contexto nocturno desde la app."
          className="delay-2"
        />

        <BentoFeatureCard
          icon={MoonStar}
          tag="Habits"
          title="Coaching de higiene del sueño"
          description="Recordatorios personalizados y rutinas nocturnas convierten los hallazgos en cambios de comportamiento medibles."
          className="delay-2"
        />

        <BentoFeatureCard
          icon={Smartphone}
          tag="Mobile"
          title="Diseñado para flujo smartphone"
          description="Todo está planteado mobile-first para una experiencia natural, rápida y útil en menos de un minuto al día."
          className="delay-3"
        />
      </div>
    </section>
  );
}

function AuthSection() {
  return (
    <section id="acceso" className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8">
      <div className="mb-8 reveal">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mint">Acceso de plataforma</p>
        <h2 className="mt-3 font-heading text-3xl text-white">Registro y login funcional</h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Crea cuenta, inicia sesión y consulta tu perfil autenticado usando JWT desde la misma landing.
        </p>
      </div>
      <AuthAccessPanel />
    </section>
  );
}

function PrivacySection() {
  return (
    <section id="privacy" className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8">
      <div className="glass-panel reveal rounded-3xl p-6 md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-mint/35 bg-mint/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-mint">
          <ShieldCheck className="h-4 w-4" />
          Transparencia técnica
        </div>

        <h2 className="mt-4 font-heading text-3xl text-white">La privacidad es el producto, no un checkbox.</h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          A.S.A.P. usa Scikit-Learn v1.4.0 para procesar señales respiratorias de audio localmente antes de cualquier
          sincronización opcional. Esta arquitectura mantiene el audio sensible bajo tu control, minimiza exposición y
          maximiza la confianza desde el primer día.
        </p>

        <div className="mt-6 grid gap-3 text-sm text-slate-200 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="font-semibold text-mint">Sin reventa de audio crudo</p>
            <p className="mt-2 text-slate-300">Los datos quedan limitados únicamente a analítica de salud.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="font-semibold text-mint">Pipeline auditable</p>
            <p className="mt-2 text-slate-300">La lógica y el scoring del modelo son explicables y versionados.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="font-semibold text-mint">Transporte seguro</p>
            <p className="mt-2 text-slate-300">Los endpoints de FastAPI se comunican por canales cifrados.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section id="architecture" className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8">
      <div className="mb-8 reveal">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mint">Arquitectura del sistema</p>
        <h2 className="mt-3 font-heading text-3xl text-white">Conexión simple, stack robusto</h2>
      </div>
      <ArchitectureFlow />
    </section>
  );
}

function WaitlistSection() {
  return (
    <section id="waitlist" className="mx-auto w-full max-w-6xl px-5 pb-20 pt-12 md:px-8">
      <div className="mb-8 reveal">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mint">Acceso temprano</p>
        <h2 className="mt-3 font-heading text-3xl text-white">Reserva tu invitación de lanzamiento</h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Únete a clínicos, deportistas y equipos de bienestar que ya prueban un enfoque privado para analítica de apnea.
        </p>
      </div>
      <WaitlistForm />
    </section>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-grain text-white">
      <AppHeader />
      <main>
        <Hero />
        <Features />
        <AuthSection />
        <PrivacySection />
        <ArchitectureSection />
        <WaitlistSection />
      </main>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-xs uppercase tracking-[0.16em] text-slate-400 md:px-8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-2">
          <HeartPulse className="h-4 w-4 text-mint" />
          <span>A.S.A.P. | Analítica del sueño con arquitectura de privacidad primero</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
