'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Mail, Phone, MapPin, MessageCircle, Clock,
  Send, CheckCircle2, ChevronDown, ChevronUp,
  Loader2,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { contactApi, ContactSubject, type ContactInfo, type SocialLink, type BusinessHour } from '@/features/contact/contact.api';
import { toast } from 'sonner';

// ── Icon maps ─────────────────────────────────────────────────────────────────
const CONTACT_ICON_MAP = {
  CALL:      { icon: Phone,         color: 'bg-blue-50 text-blue-600',    ring: 'group-hover:ring-blue-200' },
  WHATSAPP:  { icon: MessageCircle, color: 'bg-emerald-50 text-emerald-600', ring: 'group-hover:ring-emerald-200' },
  EMAIL:     { icon: Mail,          color: 'bg-amber-50 text-amber-600',   ring: 'group-hover:ring-amber-200' },
  LOCATION:  { icon: MapPin,        color: 'bg-rose-50 text-rose-600',     ring: 'group-hover:ring-rose-200' },
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

const SOCIAL_ICON_MAP: Record<string, { icon: () => React.JSX.Element; color: string }> = {
  FACEBOOK:  { icon: SvgFacebook,  color: 'hover:bg-blue-600' },
  INSTAGRAM: { icon: SvgInstagram, color: 'hover:bg-pink-600' },
  LINKEDIN:  { icon: SvgLinkedin,  color: 'hover:bg-blue-700' },
  TWITTER:   { icon: SvgTwitterX,  color: 'hover:bg-sky-500'  },
  TIKTOK:    { icon: SvgTwitterX,  color: 'hover:bg-gray-900' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(t: string) {
  const [hStr, mStr] = t.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr ?? '00';
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${suffix}`;
}

// ── Skeleton loaders ──────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
      <div className="w-11 h-11 bg-gray-100 rounded-xl mb-3" />
      <div className="h-2.5 bg-gray-100 rounded w-16 mb-2" />
      <div className="h-3.5 bg-gray-100 rounded w-28 mb-1.5" />
      <div className="h-2.5 bg-gray-100 rounded w-24" />
    </div>
  );
}

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-gray-100 rounded-2xl overflow-hidden transition-all duration-200 ${open ? 'shadow-md' : 'hover:shadow-sm'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
      >
        <span className="font-semibold text-gray-900 text-sm md:text-base">{question}</span>
        <span className="flex-shrink-0 text-gray-400">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

// ── Contact card ──────────────────────────────────────────────────────────────
function ContactCard({ card, index }: { card: ContactInfo; index: number }) {
  const meta = CONTACT_ICON_MAP[card.type] ?? CONTACT_ICON_MAP.EMAIL;
  const Icon = meta.icon;
  return (
    <ScrollReveal delay={index * 80}>
      <a
        href={card.href}
        target={card.href.startsWith('http') ? '_blank' : undefined}
        rel="noreferrer"
        className={`group block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md ring-2 ring-transparent ${meta.ring} transition-all duration-200 h-full`}
      >
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${meta.color}`}>
          <Icon size={20} />
        </div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{card.label}</p>
        <p className="text-sm font-bold text-gray-900 leading-snug mb-1 break-all">{card.value}</p>
        <p className="text-xs text-gray-400 leading-snug">{card.subText}</p>
      </a>
    </ScrollReveal>
  );
}

// ── Social button ─────────────────────────────────────────────────────────────
function SocialButton({ link }: { link: SocialLink }) {
  const meta = SOCIAL_ICON_MAP[link.platform] ?? SOCIAL_ICON_MAP.FACEBOOK;
  const Icon = meta.icon;
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      title={link.label}
      className={`w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors ${meta.color} hover:text-white`}
    >
      <Icon />
    </a>
  );
}

// ── Business hour row ─────────────────────────────────────────────────────────
function HourRow({ hour }: { hour: BusinessHour }) {
  const timeLabel = hour.isClosed
    ? 'Closed'
    : `${formatTime(hour.openTime)} – ${formatTime(hour.closeTime)}`;
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
      <span className="text-gray-600 font-medium text-sm">{hour.dayLabel}</span>
      <span className={`font-semibold text-sm ${hour.isClosed ? 'text-red-400' : 'text-gray-900'}`}>
        {timeLabel}
      </span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const SUBJECT_OPTIONS = [
  { value: ContactSubject.BOOKING,     label: 'Booking Issue' },
  { value: ContactSubject.PAYMENT,     label: 'Payment / Wallet' },
  { value: ContactSubject.HELPER,      label: 'Become a Helper' },
  { value: ContactSubject.COMPLAINT,   label: 'Complaint' },
  { value: ContactSubject.PARTNERSHIP, label: 'Partnership' },
  { value: ContactSubject.OTHER,       label: 'Other' },
];

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
    onSuccess: () => {
      toast.success('Message sent! We\'ll get back to you shortly.');
    },
    onError: () => {
      toast.error('Failed to send message. Please try again.');
    },
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
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 anim-dot-grid bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400/20 anim-blob blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-400/20 anim-blob-delayed blur-3xl rounded-full" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-blue-100 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            We&apos;re here to help
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Touch</span>
          </h1>
          <p className="text-blue-100/90 text-lg max-w-xl mx-auto leading-relaxed">
            Have a question or need support? Our team is ready to help you — usually within a few hours.
          </p>
        </div>
      </section>

      {/* ── Contact cards ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* ── Form + FAQ ── */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* Contact form */}
            <ScrollReveal>
              <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Send us a message</h2>
                <p className="text-sm text-gray-500 mb-6">We&apos;ll get back to you within 24 hours.</p>

                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={32} className="text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Message Sent!</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Thank you for reaching out. We&apos;ll reply to your email shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
                        <input
                          required
                          value={form.fullName}
                          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                          placeholder="Ahmad Khan"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone</label>
                        <input
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+92 300 0000000"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subject *</label>
                      <select
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value as ContactSubject })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-700"
                      >
                        <option value="">Select a topic...</option>
                        {SUBJECT_OPTIONS.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message *</label>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Describe your issue or question..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isPending
                        ? <Loader2 size={16} className="animate-spin" />
                        : <Send size={16} />
                      }
                      {isPending ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* FAQ */}
            <ScrollReveal delay={100}>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked</h2>
              <p className="text-sm text-gray-500 mb-6">Quick answers to common questions.</p>
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

      {/* ── Business hours + Social ── */}
      <section className="bg-gray-50 py-14 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">

            {/* Hours */}
            <ScrollReveal>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Clock size={18} className="text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Business Hours</h3>
                </div>
                {loadingHours ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-0">
                    {(businessHours as BusinessHour[] | undefined)
                      ?.sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((h) => <HourRow key={h.id} hour={h} />)
                    }
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-4">All times are Pakistan Standard Time (PKT, UTC+5)</p>
              </div>
            </ScrollReveal>

            {/* Social + CTA */}
            <ScrollReveal delay={100}>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                <h3 className="font-bold text-lg mb-1">Follow HunarWalaa</h3>
                <p className="text-blue-100 text-sm mb-5">Stay updated with latest news and offers.</p>
                <div className="flex gap-3 mb-6">
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
                <p className="text-blue-100 text-sm mb-3">Need a professional right now?</p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-md"
                >
                  Find a Helper Now
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

    </div>
  );
}
