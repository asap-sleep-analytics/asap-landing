import { useState } from 'react';
import { Lock } from 'lucide-react';

import { resendWaitlistConfirmation, submitWaitlistLead } from '../services/waitlistApi';

export default function WaitlistForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    device: 'ios',
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState('');
  const [confirmationPreviewUrl, setConfirmationPreviewUrl] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('');
    setError('');
    setResendMessage('');
    setConfirmationPreviewUrl('');
    setIsSubmitting(true);

    try {
      const emailUsed = form.email;
      const result = await submitWaitlistLead({
        ...form,
        source: 'landing-page',
      });
      setStatus(result?.message || 'Gracias. Ya estás en la lista de espera. Te contactaremos pronto.');
      setConfirmationPreviewUrl(result?.confirmation_url_preview || '');
      setLastSubmittedEmail(emailUsed);
      setForm({
        name: '',
        email: '',
        device: 'ios',
      });
    } catch (submitError) {
      setError(submitError.message || 'No fue posible enviar el formulario en este momento.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendConfirmation() {
    if (!lastSubmittedEmail) {
      return;
    }

    setError('');
    setResendMessage('');
    setIsResending(true);

    try {
      const result = await resendWaitlistConfirmation(lastSubmittedEmail);
      setResendMessage(result?.message || 'Correo de confirmación reenviado.');
      setConfirmationPreviewUrl(result?.confirmation_url_preview || '');
    } catch (resendError) {
      setError(resendError.message || 'No fue posible reenviar la confirmación en este momento.');
    } finally {
      setIsResending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel reveal delay-2 rounded-3xl p-6 md:p-8">
      <p className="inline-flex items-center gap-2 rounded-full border border-mint/35 bg-mint/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-mint">
        <Lock className="h-3.5 w-3.5" />
        Registro Privado
      </p>

      <h3 className="mt-4 font-heading text-2xl text-white">Únete a la lista de espera de A.S.A.P.</h3>
      <p className="mt-2 text-sm text-slate-300">Los primeros usuarios reciben analítica premium y acompañamiento privado.</p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-slate-300">Nombre</span>
          <input
            required
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-mint"
            placeholder="Tu nombre completo"
          />
        </label>

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
          <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-slate-300">Dispositivo principal</span>
          <select
            name="device"
            value={form.device}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-mint"
          >
            <option value="ios">iPhone</option>
            <option value="android">Android</option>
            <option value="both">Ambos</option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-mint px-5 py-3 text-sm font-bold text-black transition hover:bg-mintdeep"
      >
        {isSubmitting ? 'Enviando...' : 'Reservar mi cupo'}
      </button>

      {status ? <p className="mt-4 text-sm text-mint">{status}</p> : null}
      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      {lastSubmittedEmail ? (
        <button
          type="button"
          onClick={handleResendConfirmation}
          disabled={isResending}
          className="mt-4 inline-flex items-center justify-center rounded-lg border border-mint/40 bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-mint transition hover:bg-mint/10"
        >
          {isResending ? 'Reenviando...' : 'Reenviar confirmación'}
        </button>
      ) : null}
      {resendMessage ? <p className="mt-3 text-sm text-mint">{resendMessage}</p> : null}
      {confirmationPreviewUrl ? (
        <p className="mt-4 text-sm text-slate-200">
          Confirmar en local:
          <a
            href={confirmationPreviewUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-2 break-all text-mint underline"
          >
            {confirmationPreviewUrl}
          </a>
        </p>
      ) : null}
    </form>
  );
}
