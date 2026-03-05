export default function BentoFeatureCard({ icon: Icon, title, description, tag, className = '' }) {
  return (
    <article className={`glass-panel rounded-3xl p-6 reveal ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <Icon className="h-6 w-6 text-mint" />
        <span className="rounded-full border border-mint/35 bg-mint/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-mint">
          {tag}
        </span>
      </div>

      <h3 className="mt-4 font-heading text-xl text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    </article>
  );
}
