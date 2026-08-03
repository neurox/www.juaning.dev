import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { t } from '@/lib/i18n';

interface ContactFormProps {
  locale: string;
}

export default function ContactForm({ locale }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@4/dark.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    document.head.appendChild(script);

    const recaptcha = document.createElement('script');
    recaptcha.src = 'https://www.google.com/recaptcha/api.js';
    document.head.appendChild(recaptcha);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // @ts-expect-error grecaptcha is loaded globally
    const recaptchaResponse = window.grecaptcha?.getResponse();

    if (!recaptchaResponse) {
      // @ts-expect-error Swal is loaded globally
      window.Swal?.fire({
        icon: 'error',
        title: 'VERIFICATION FAILED',
        text: t(locale, 'contact_form_recaptcha_err'),
        confirmButtonText: 'RETRY',
      });
      setIsSubmitting(false);
      return;
    }

    const form = formRef.current;
    const formData = {
      name: (form?.elements.namedItem('name') as HTMLInputElement)?.value,
      email: (form?.elements.namedItem('email') as HTMLInputElement)?.value,
      _subject: (form?.elements.namedItem('subject') as HTMLInputElement)?.value || 'New message from JUANING.dev',
      message: (form?.elements.namedItem('message') as HTMLTextAreaElement)?.value,
      'g-recaptcha-response': recaptchaResponse,
    };

    try {
      const response = await fetch('https://formsubmit.co/ajax/3885100f965890e3080f4e8483bbf1eb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success === 'true' || response.ok) {
        // @ts-expect-error Swal is loaded globally
        window.Swal?.fire({
          icon: 'success',
          title: 'TRANSMISSION COMPLETE',
          text: t(locale, 'contact_form_success_text'),
          confirmButtonText: 'ACKNOWLEDGE',
        });
        form?.reset();
        // @ts-expect-error grecaptcha is loaded globally
        window.grecaptcha?.reset();
      } else {
        throw new Error('FormSubmit error');
      }
    } catch {
      // @ts-expect-error Swal is loaded globally
      window.Swal?.fire({
        icon: 'error',
        title: 'COMMUNICATION ERROR',
        text: t(locale, 'contact_form_error_text'),
        confirmButtonText: 'RETRY',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full rounded bg-slate-900/80 border border-white/10 px-4 py-3 text-slate-200 focus:border-hud-cyan focus:ring-1 focus:ring-hud-cyan outline-none transition-colors placeholder:text-slate-600 font-sans';
  const labelClass = 'font-mono text-xs text-slate-400 tracking-wider uppercase';

  return (
    <div className="lg:col-span-7 glass-card rounded-xl p-8 md:p-10">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-100 mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-hud-cyan">&#xe163;</span>
        {t(locale, 'contact_form_title')}
      </h2>

      <style>{`
        .swal2-popup{background:#0b0f1a!important;border:1px solid rgba(14,165,233,.2)!important;box-shadow:0 0 20px rgba(14,165,233,.1)!important;border-radius:12px!important;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif!important}
        .swal2-title{color:#f1f5f9!important;font-family:'Outfit',sans-serif!important;font-weight:700!important}
        .swal2-html-container{color:#94a3b8!important}
        .swal2-confirm{background-color:#0ea5e9!important;color:#020617!important;font-weight:700!important;text-transform:uppercase!important;letter-spacing:.05em!important;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace!important;font-size:.875rem!important;padding:12px 24px!important}
        .swal2-icon.swal2-success{border-color:#0ea5e9!important;color:#0ea5e9!important}
        .swal2-icon.swal2-success [class^='swal2-success-line']{background-color:#0ea5e9!important}
        .swal2-icon.swal2-success .swal2-success-ring{border:.25em solid rgba(14,165,233,.3)!important}
      `}</style>

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className={labelClass}>
              {t(locale, 'contact_form_name')} <span className="text-hud-cyan">*</span>
            </label>
            <input type="text" id="name" name="name" required className={inputClass} placeholder="John Doe" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={labelClass}>
              {t(locale, 'contact_form_email')} <span className="text-hud-cyan">*</span>
            </label>
            <input type="email" id="email" name="email" required className={inputClass} placeholder="john@example.com" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="subject" className={labelClass}>
            {t(locale, 'contact_form_subject')} <span className="text-hud-cyan">*</span>
          </label>
          <input type="text" id="subject" name="subject" required className={inputClass} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className={labelClass}>
            {t(locale, 'contact_form_message')} <span className="text-hud-cyan">*</span>
          </label>
          <textarea id="message" name="message" rows={5} required className={`${inputClass} resize-none`} />
        </div>

        <div className="mt-2 opacity-90">
          <div
            className="g-recaptcha"
            data-sitekey="6LfH2-oiAAAAAO8yeRMVEugLESUVWaUe8qUtTNCn"
            data-theme="dark"
            aria-label="Please complete the reCAPTCHA to verify that you are not a robot."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex w-full items-center justify-center rounded bg-hud-cyan px-6 py-4 text-slate-950 font-bold text-lg hover:bg-[#38bdf8] transition-colors hover:shadow-[0_0_15px_rgba(14,165,233,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined animate-spin mr-2">&#xe627;</span>
              SENDING...
            </>
          ) : (
            t(locale, 'contact_form_submit')
          )}
        </button>
      </form>
    </div>
  );
}
