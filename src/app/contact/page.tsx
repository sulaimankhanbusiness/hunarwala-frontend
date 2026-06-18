'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Mail, Phone, MapPin, MessageCircle, Clock,
  Send, CheckCircle2, ChevronDown, ChevronUp,
  Loader2, Headphones, ArrowRight,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { contactApi, ContactSubject, type ContactInfo, type SocialLink, type BusinessHour } from '@/features/contact/api/contact.api';
import { toast } from 'sonner';

// ── Icon maps ─────────────────────────────────────────────────────────────────

const CONTACT_ICON_MAP = {
  CALL:      { icon: Phone,         bg: 'bg-indigo-50',  text: 'text-indigo-600',  ring: 'group-hover:ring-indigo-200' },
  WHATSAPP:  { icon: MessageCircle, bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'group-hover:ring-emerald-200' },
  EMAIL:     { icon: Mail,          bg: 'bg-violet-50',  text: 'text-violet-600',  ring: 'group-hover:ring-violet-200' },
  LOCATION:  { icon: MapPin,        bg: 'bg-rose-50',    text: 'text-rose-600',    ring: 'group-hover:ring-rose-200' },
} as const;

function SvgFacebook() {
  return <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
}
function SvgInstagram() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
}
function SvgLinkedin() {
  return <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
}
function SvgTwitterX() {
  return <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
}

const SOCIAL_ICON_MAP: Record<string, { icon: () => React.JSX.Element; hover: string }> = {
  FACEBOOK:  { icon: SvgFacebook,  hover: 'hover:bg-blue-600' },
  INSTAGRAM: { icon: SvgInstagram, hover: 'hover:bg-pink-600' },
  LINKEDIN:  { icon: SvgLinkedin,  hover: 'hover:bg-blue-700' },
  TWITTER:   { icon: SvgTwitterX,  hover: 'hover:bg-sky-500'  },
  TIKTOK:    { icon: SvgTwitterX,  hover: 'hover:bg-gray-900' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(t: string) {
  const [hStr, mStr] = t.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr ?? '00';
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m} ${suffix}`;
}

// ── Input style ───────────────────────────────────────────────────────────────

const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all placeholder-gray-300';

// ── Sub-components ────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="w-12 h-12 bg-gray-100 rounded-2xl mb-4" />
      <div className="h-2.5 bg-gray-100 rounded w-16 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-28 mb-1.5" />
      <div className="h-2.5 bg-gray-100 rounded w-24" />
    </div>
  );
}

function ContactCard({ card, index }: { card: ContactInfo; index: number }) {
  const meta = CONTACT_ICON_MAP[card.type] ?? CONTACT_ICON_MAP.EMAIL;
  const Icon = meta.icon;
  return (
    <ScrollReveal delay={index * 80}>
      <a
        href={card.href}
        target={card.href.startsWith('http') ? '_blank' : undefined}
        rel="noreferrer"
        className={`group block bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_24px_rgba(99,102,241,0.10)] ring-2 ring-transparent ${meta.ring} transition-all duration-200 h-full hover:-translate-y-0.5`}
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${meta.bg}`}>
          <Icon size={22} className={meta.text} />
        </div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{card.label}</p>
        <p className="text-sm font-bold text-gray-900 leading-snug mb-1 break-all">{card.value}</p>
        <p className="text-xs text-gray-400 leading-snug">{card.subText}</p>
      </a>
    </ScrollReveal>
  );
}

function SocialButton({ link }: { link: SocialLink }) {
  const meta = SOCIAL_ICON_MAP[link.platform] ?? SOCIAL_ICON_MAP.FACEBOOK;
  const Icon = meta.icon;
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      title={link.label}
      className={`w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-white transition-colors ${meta.hover} hover:text-white`}
    >
      <Icon />
    </a>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-200 ${open ? 'border-indigo-200 shadow-[0_4px_16px_rgba(99,102,241,0.08)]' : 'border-gray-100 hover:border-indigo-100'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
      >
        <span className={`font-semibold text-sm md:text-base transition-colors ${open ? 'text-indigo-700' : 'text-gray-900'}`}>
          {question}
        </span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-indigo-50 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

function HourRow({ hour }: { hour: BusinessHour }) {
  const timeLabel = hour.isClosed
    ? 'Closed'
    : `${formatTime(hour.openTime)} – ${formatTime(hour.closeTime)}`;
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-gray-600 font-medium text-sm">{hour.dayLabel}</span>
      <span className={`font-bold text-sm ${hour.isClosed ? 'text-red-400' : 'text-indigo-600'}`}>
        {timeLabel}
      </span>
    </div>
  );
}

// ── Subject options ───────────────────────────────────────────────────────────

const SUBJECT_OPTIONS = [
  { value: ContactSubject.BOOKING,     label: 'Booking Issue' },
  { value: ContactSubject.PAYMENT,     label: 'Payment / Wallet' },
  { value: ContactSubject.HELPER,      label: 'Become a Helper' },
  { value: ContactSubject.COMPLAINT,   label: 'Complaint' },
  { value: ContactSubject.PARTNERSHIP, label: 'Partnership' },
  { value: ContactSubject.OTHER,       label: 'Other' },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', subject: '' as ContactSubject | '', message: '',
  });

  const { data: contactInfo, isLoading: loadingInfo } = useQuery({
    queryKey: ['contact-info'],
    queryFn: contactApi.getInfo,
    staleTime: 5 * 60 * 1000,
  });

  const { data: faqs, isLoading: loadingFaqs } = useQuery({
    queryKey: ['contact-faqs'],
    queryFn: contactApi.getFaqs,
    staleTime: 5 * 60 * 1000,
  });

  const { data: businessHours, isLoading: loadingHours } = useQuery({
    queryKey: ['contact-business-hours'],
    queryFn: contactApi.getBusinessHours,
    staleTime: 5 * 60 * 1000,
  });

  const { data: socialLinks, isLoading: loadingSocials } = useQuery({
    queryKey: ['contact-social-links'],
    queryFn: contactApi.getSocialLinks,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: submitForm, isPending, isSuccess } = useMutation({
    mutationFn: contactApi.submit,
    onSuccess: () => toast.success("Message sent! We'll get back to you shortly."),
    onError:   () => toast.error('Failed to send message. Please try again.'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject) return;
    submitForm({
      fullName: form.fullName,
      email:    form.email,
      phone:    form.phone,
      subject:  form.subject as ContactSubject,
      message:  form.message,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-indigo-800 via-indigo-700 to-violet-700 text-white overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-violet-400/20 rounded-full blur-2xl" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-indigo-100 text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Support team online
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">help you?</span>
            </h1>
            <p className="text-indigo-100/90 text-lg max-w-xl mx-auto leading-relaxed">
              Have a question or need support? Our team is ready — usually back within a few hours.
            </p>
          </div>
        </div>

        {/* Contact cards overlap into hero */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-0 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 translate-y-10">
            {loadingInfo
              ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
              : (contactInfo as ContactInfo[] | undefined)
                  ?.filter((c) => c.isActive)
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((card, i) => <ContactCard key={card.id} card={card} index={i} />)
            }
          </div>
        </div>
      </section>

      {/* Push content down to account for overlapping cards */}
      <div className="pt-20 pb-0" />

      {/* ── Form + FAQ ───────────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">

            {/* Contact form */}
            <ScrollReveal>
              <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Send size={16} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 leading-tight">Send a message</h2>
                    <p className="text-xs text-gray-400 font-medium">We reply within 24 hours</p>
                  </div>
                </div>

                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={32} className="text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Message Sent!</h3>
                    <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                      Thank you for reaching out. We&apos;ll reply to your email shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name *</label>
                        <input
                          required
                          value={form.fullName}
                          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                          placeholder="Ahmad Khan"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone</label>
                        <input
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+92 300 0000000"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Subject *</label>
                      <select
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value as ContactSubject })}
                        className={`${inputCls} text-gray-700`}
                      >
                        <option value="">Select a topic…</option>
                        {SUBJECT_OPTIONS.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Message *</label>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Describe your issue or question…"
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                    >
                      {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      {isPending ? 'Sending…' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* FAQ */}
            <ScrollReveal delay={100}>
              <div className="mb-6">
                <h2 className="text-xl font-black text-gray-900 mb-1">Frequently Asked</h2>
                <p className="text-sm text-gray-500">Quick answers to common questions.</p>
              </div>
              {loadingFaqs ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-14 bg-gray-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {(faqs as any[] | undefined)
                    ?.filter((f) => f.isActive)
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((faq) => (
                      <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
                    ))
                  }
                </div>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Business hours + Social ───────────────────────────────────────── */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">

            {/* Hours */}
            <ScrollReveal>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-sm">Business Hours</h3>
                    <p className="text-xs text-gray-400">Pakistan Standard Time (PKT)</p>
                  </div>
                </div>
                {loadingHours ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div>
                    {(businessHours as BusinessHour[] | undefined)
                      ?.sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((h) => <HourRow key={h.id} hour={h} />)
                    }
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Social + CTA */}
            <ScrollReveal delay={100}>
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20 h-full">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-400/20 rounded-full blur-xl" />

                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mb-4">
                    <Headphones size={18} className="text-white" />
                  </div>
                  <h3 className="font-black text-lg mb-1">Follow HunarWalaa</h3>
                  <p className="text-indigo-100/80 text-sm mb-5 leading-relaxed">
                    Stay updated with our latest news, tips, and special offers.
                  </p>

                  <div className="flex gap-2.5 mb-6">
                    {loadingSocials ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="w-10 h-10 bg-white/20 rounded-xl animate-pulse" />
                      ))
                    ) : (
                      (socialLinks as SocialLink[] | undefined)
                        ?.filter((s) => s.isActive)
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((link) => <SocialButton key={link.id} link={link} />)
                    )}
                  </div>

                  <div className="h-px bg-white/20 mb-5" />

                  <div className="mt-auto">
                    <p className="text-indigo-100/80 text-sm mb-3">Need a professional right now?</p>
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg"
                    >
                      Find a Helper Now
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

    </div>
  );
}
