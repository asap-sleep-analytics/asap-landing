import { ArrowRight, BrainCircuit, ServerCog, Smartphone } from 'lucide-react';

function Node({ icon: Icon, title, subtitle }) {
  return (
    <div className="glass-panel flex w-full flex-col items-center rounded-2xl p-5 text-center md:w-64">
      <Icon className="h-6 w-6 text-mint" />
      <h4 className="mt-3 font-heading text-lg text-white">{title}</h4>
      <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
    </div>
  );
}

export default function ArchitectureFlow() {
  return (
    <div className="glass-panel reveal rounded-3xl p-6 md:p-8">
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
        <Node
          icon={Smartphone}
          title="App móvil"
          subtitle="React Native + Expo SDK 50 captura metadatos desde el teléfono y wearables."
        />

        <ArrowRight className="h-5 w-5 rotate-90 text-mint md:rotate-0" />

        <Node
          icon={ServerCog}
          title="FastAPI API"
          subtitle="FastAPI 0.109.0 valida payloads y orquesta el análisis de forma segura."
        />

        <ArrowRight className="h-5 w-5 rotate-90 text-mint md:rotate-0" />

        <Node
          icon={BrainCircuit}
          title="Núcleo ML"
          subtitle="Scikit-Learn 1.4.0 impulsa señales de ML clásico para detectar riesgo de apnea."
        />
      </div>
    </div>
  );
}
