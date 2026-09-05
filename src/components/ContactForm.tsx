import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { t } from '@/lib/i18n';

interface Recaptcha {
  render: (container: HTMLElement, options: Record<string, string>) => number;
  getResponse: (id: number) => string;
  reset: (id: number) => void;
}
const captchaWindow = () => window as typeof window & { grecaptcha?: Recaptcha; contactCaptchaLoaded?: () => void };
let captchaLoading: Promise<Recaptcha> | undefined;
function loadCaptcha() {
  if (captchaWindow().grecaptcha?.render) return Promise.resolve(captchaWindow().grecaptcha!);
  if (!captchaLoading) {
    captchaLoading = new Promise<Recaptcha>((resolve, reject) => {
      const script = document.createElement('script');
      captchaWindow().contactCaptchaLoaded = () => resolve(captchaWindow().grecaptcha!);
      script.src = 'https://www.google.com/recaptcha/api.js?onload=contactCaptchaLoaded&render=explicit';
      script.async = true;
      script.onerror = () => { captchaLoading = undefined; script.remove(); reject(new Error('CAPTCHA unavailable')); };
      document.head.appendChild(script);
    });
  }
  return captchaLoading;
}

interface ContactFormProps {
  locale: 'en' | 'es';
}

export default function ContactForm({ locale }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | 'verify' | null>(null);
  const submittingRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    loadCaptcha().then((captcha) => {
      if (!cancelled && captchaRef.current) {
        widgetRef.current = captcha.render(captchaRef.current, {
          sitekey: '6LfH2-oiAAAAAO8yeRMVEugLESUVWaUe8qUtTNCn', theme: 'dark',
        });
      }
    }).catch(() => { if (!cancelled) setStatus('verify'); });
    return () => { cancelled = true; widgetRef.current = null; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    setStatus(null);
    let recaptchaResponse: string | undefined;
    try {
      recaptchaResponse = widgetRef.current === null ? undefined : captchaWindow().grecaptcha?.getResponse(widgetRef.current);
    } catch {
      setStatus('verify');
      return;
    }
    if (!recaptchaResponse) {
      setStatus('verify');
      return;
    }
    submittingRef.current = true;
    setIsSubmitting(true);

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
        signal: AbortSignal.timeout(20000),
      });

      const result = await response.json();

      if (!response.ok || (result?.success !== 'true' && result?.success !== true)) {
        throw new Error('FormSubmit rejected the message');
      }
      setStatus('success');
      form?.reset();
    } catch {
      setStatus('error');
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
      try {
        if (widgetRef.current !== null) captchaWindow().grecaptcha?.reset(widgetRef.current);
      } catch { /* Keep the submission outcome if the widget reset fails. */ }
    }
  };

  const inputClass = 'w-full rounded-md bg-[#090f16]/70 border border-white/10 px-4 py-3.5 text-slate-100 focus:border-hud-cyan focus:ring-1 focus:ring-hud-cyan outline-none transition-colors placeholder:text-slate-600 font-sans';
  const labelClass = 'font-mono text-[11px] text-slate-400 tracking-[0.12em] uppercase';

  return (
    <div className="content-panel p-6 md:p-9">
      <div className="mb-8 border-b border-white/10 pb-6">
        <div className="eyebrow"><span></span>{t(locale, 'contact_form_kicker')}</div>
        <h2 className="mt-4 text-2xl md:text-3xl font-display font-bold text-white">{t(locale, 'contact_form_title')}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">{t(locale, 'contact_form_intro')}</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6" aria-busy={isSubmitting}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className={labelClass}>
              {t(locale, 'contact_form_name')} <span className="text-hud-cyan">*</span>
            </label>
            <input type="text" id="name" name="name" required className={inputClass} autoComplete="name" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={labelClass}>
              {t(locale, 'contact_form_email')} <span className="text-hud-cyan">*</span>
            </label>
            <input type="email" id="email" name="email" required className={inputClass} autoComplete="email" />
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
            ref={captchaRef}
            aria-label="Please complete the reCAPTCHA to verify that you are not a robot."
          />
        </div>

        <div aria-live="polite" aria-atomic="true">
          {status && (
            <p className={status === 'success' ? 'text-emerald-300' : 'text-red-300'}>
              {t(locale, status === 'success' ? 'contact_form_success_text' : status === 'verify' ? 'contact_form_recaptcha_err' : 'contact_form_error_text')}
              {status !== 'success' && <> <a className="underline" href="mailto:juanjose@ingomez.com">juanjose@ingomez.com</a></>}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="button-primary mt-2 w-full px-6 py-4 text-base disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined animate-spin mr-2">&#xe627;</span>
              {t(locale, 'contact_sending')}
            </>
          ) : (
            t(locale, 'contact_form_submit')
          )}
        </button>
      </form>
    </div>
  );
}
