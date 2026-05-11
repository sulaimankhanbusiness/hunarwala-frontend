'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
    ArrowLeft, Camera, Plus, Trash2, Loader2, Save,
    Zap, Cpu, Search, Sun, Battery, Wrench, X,
    Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { getMyProfile, updateMyProfile } from '@/features/helpers/services/helpers.service';
import type { HelperService, PortfolioItem } from '@/features/helpers/types/helpers.types';
import { getMediaUrl } from '@/utils/url';

// ─── Constants ───────────────────────────────────────────────────────────────

const ICON_OPTIONS = [
    { key: 'wrench', label: 'Wrench', Icon: Wrench },
    { key: 'zap',    label: 'Zap',    Icon: Zap    },
    { key: 'cpu',    label: 'CPU',    Icon: Cpu    },
    { key: 'search', label: 'Search', Icon: Search },
    { key: 'sun',    label: 'Sun',    Icon: Sun    },
    { key: 'battery',label: 'Battery',Icon: Battery},
];
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = Object.fromEntries(
    ICON_OPTIONS.map(({ key, Icon }) => [key, Icon])
);
function SvcIcon({ iconKey, size, className }: { iconKey: string | null; size?: number; className?: string }) {
    const Icon = (iconKey && ICON_MAP[iconKey]) ? ICON_MAP[iconKey] : Wrench;
    return <Icon size={size} className={className} />;
}

const STATUS_OPTIONS = ['available', 'busy', 'unavailable'] as const;
const COMMON_LANGUAGES = ['Urdu', 'English', 'Pashto', 'Punjabi', 'Sindhi', 'Balochi'];
const MAX_PORTFOLIO = 5;

const DAYS = [
    { key: 'mon', label: 'Mon' },
    { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' },
    { key: 'sat', label: 'Sat' },
    { key: 'sun', label: 'Sun' },
];

// ─── Local types ─────────────────────────────────────────────────────────────

interface PortfolioEntry {
    existingUrl?: string;   // kept from server
    file?: File;            // new upload
    preview?: string;       // blob URL for new files
    caption: string;
    sortOrder: number;
}

interface ServiceEntry {
    name: string;
    price: number | '';
    durationHrs: number | '';
    iconKey: string;
    description: string;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 md:p-8">
            <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block" />
                {title}
            </h2>
            {children}
        </div>
    );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
            {children}
            {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
    );
}

const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-sm bg-white';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditProfilePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuthStore();
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const portfolioInputRef = useRef<HTMLInputElement>(null);

    // ── Remote data ────────────────────────────────────────────────────────
    const { data: profile, isLoading } = useQuery({
        queryKey: ['my-profile'],
        queryFn: getMyProfile,
        enabled: isAuthenticated,
    });

    // ── Form state ─────────────────────────────────────────────────────────
    const [basic, setBasic] = useState({
        fullName: '', phoneNumber: '', headline: '', bio: '',
        experienceYears: '' as number | '', ratePerHour: '' as number | '',
        availabilityStatus: 'available' as typeof STATUS_OPTIONS[number],
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [languages, setLanguages] = useState<string[]>([]);
    const [langInput, setLangInput] = useState('');
    const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([]);
    const [services, setServices] = useState<ServiceEntry[]>([]);
    const [newSvc, setNewSvc] = useState<ServiceEntry>({ name: '', price: '', durationHrs: '', iconKey: 'wrench', description: '' });
    const [editingSvcIdx, setEditingSvcIdx] = useState<number | null>(null);
    const [showSvcForm, setShowSvcForm] = useState(false);
    const [schedule, setSchedule] = useState<Record<string, { from: string; to: string } | null>>({});
    const [saving, setSaving] = useState(false);

    // ── Pre-populate from profile ──────────────────────────────────────────
    useEffect(() => {
        if (!profile) return;
        setBasic({
            fullName: profile.fullName ?? '',
            phoneNumber: profile.phoneNumber ?? '',
            headline: profile.headline ?? '',
            bio: profile.bio ?? '',
            experienceYears: profile.experienceYears ?? '',
            ratePerHour: profile.ratePerHour ?? '',
            availabilityStatus: profile.availabilityStatus ?? 'available',
        });
        setLanguages(profile.languages ?? []);
        setPortfolio(
            [...profile.portfolio]
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((p: PortfolioItem) => ({ existingUrl: p.imageUrl, caption: p.caption, sortOrder: p.sortOrder }))
        );
        setServices(
            profile.services.map((s: HelperService) => ({
                name: s.name, price: s.price, durationHrs: s.durationHrs,
                iconKey: s.iconKey ?? 'wrench', description: s.description ?? '',
            }))
        );
        if (profile.availabilitySchedule) {
            setSchedule(profile.availabilitySchedule as Record<string, { from: string; to: string }>);
        }
    }, [profile]);

    // ── Avatar ─────────────────────────────────────────────────────────────
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return; }
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    // ── Portfolio ──────────────────────────────────────────────────────────
    const handlePortfolioAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const remaining = MAX_PORTFOLIO - portfolio.length;
        if (remaining <= 0) { toast.error(`Max ${MAX_PORTFOLIO} portfolio items`); return; }
        const toAdd = files.slice(0, remaining);
        const newEntries: PortfolioEntry[] = toAdd.map((file, i) => ({
            file,
            preview: URL.createObjectURL(file),
            caption: '',
            sortOrder: portfolio.length + i,
        }));
        setPortfolio(prev => [...prev, ...newEntries]);
        e.target.value = '';
    };

    const removePortfolioItem = (idx: number) => {
        setPortfolio(prev => prev.filter((_, i) => i !== idx).map((p, i) => ({ ...p, sortOrder: i })));
    };

    const updateCaption = (idx: number, caption: string) => {
        setPortfolio(prev => prev.map((p, i) => i === idx ? { ...p, caption } : p));
    };

    // ── Languages ──────────────────────────────────────────────────────────
    const addLang = (lang: string) => {
        const trimmed = lang.trim();
        if (!trimmed || languages.includes(trimmed)) return;
        setLanguages(prev => [...prev, trimmed]);
        setLangInput('');
    };
    const removeLang = (lang: string) => setLanguages(prev => prev.filter(l => l !== lang));

    // ── Schedule ───────────────────────────────────────────────────────────
    const toggleDay = (day: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: prev[day] ? null : { from: '09:00', to: '18:00' },
        }));
    };
    const updateTime = (day: string, field: 'from' | 'to', value: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...(prev[day] ?? { from: '09:00', to: '18:00' }), [field]: value },
        }));
    };

    // ── Services ───────────────────────────────────────────────────────────
    const resetSvcForm = useCallback(() => {
        setNewSvc({ name: '', price: '', durationHrs: '', iconKey: 'wrench', description: '' });
        setEditingSvcIdx(null);
        setShowSvcForm(false);
    }, []);

    const startEditSvc = (idx: number) => {
        setNewSvc({ ...services[idx] });
        setEditingSvcIdx(idx);
        setShowSvcForm(true);
    };

    const saveSvc = () => {
        if (!newSvc.name.trim()) { toast.error('Service name is required'); return; }
        if (newSvc.price === '' || Number(newSvc.price) < 0) { toast.error('Enter a valid price'); return; }
        if (editingSvcIdx !== null) {
            setServices(prev => prev.map((s, i) => i === editingSvcIdx ? { ...newSvc } : s));
        } else {
            setServices(prev => [...prev, { ...newSvc }]);
        }
        resetSvcForm();
    };

    const removeSvc = (idx: number) => setServices(prev => prev.filter((_, i) => i !== idx));

    // ── Submit ─────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const fd = new FormData();

            // Basic fields
            fd.append('fullName', basic.fullName);
            fd.append('phoneNumber', basic.phoneNumber);
            fd.append('headline', basic.headline);
            fd.append('bio', basic.bio);
            if (basic.experienceYears !== '') fd.append('experienceYears', String(basic.experienceYears));
            if (basic.ratePerHour !== '') fd.append('ratePerHour', String(basic.ratePerHour));
            fd.append('availabilityStatus', basic.availabilityStatus);

            // Profile picture
            if (avatarFile) fd.append('file', avatarFile);

            // Languages
            fd.append('languages', JSON.stringify(languages));

            // Portfolio — existing items include imageUrl, new items don't
            const portfolioJson = portfolio.map(p => {
                if (p.existingUrl) return { imageUrl: p.existingUrl, caption: p.caption, sortOrder: p.sortOrder };
                return { caption: p.caption, sortOrder: p.sortOrder };
            });
            fd.append('portfolio', JSON.stringify(portfolioJson));

            // Portfolio files — only new uploads, in order
            portfolio.filter(p => !p.existingUrl && p.file).forEach(p => {
                fd.append('portfolioFiles', p.file!);
            });

            // Availability schedule — only include enabled days
            const activeSchedule = Object.fromEntries(
                Object.entries(schedule).filter(([, v]) => v !== null && v !== undefined)
            );
            if (Object.keys(activeSchedule).length > 0) {
                fd.append('availabilitySchedule', JSON.stringify(activeSchedule));
            }

            // Services
            fd.append('services', JSON.stringify(
                services.map(({ name, price, durationHrs, iconKey, description }) => ({
                    name,
                    price: Number(price),
                    durationHrs: durationHrs !== '' ? Number(durationHrs) : null,
                    iconKey: iconKey || null,
                    description: description || null,
                }))
            ));

            await updateMyProfile(fd);
            await queryClient.invalidateQueries({ queryKey: ['my-profile'] });
            toast.success('Profile updated successfully!');
            router.push('/profile');
        } catch {
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (!isAuthenticated) { router.replace('/login'); return null; }

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    const avatarSrc = avatarPreview ?? (profile?.profileImage ? getMediaUrl(profile.profileImage) : null);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors text-sm"
                    >
                        <ArrowLeft size={18} />
                        Back to Profile
                    </button>
                    <h1 className="text-lg font-black text-gray-900">Edit Profile</h1>
                    <div className="w-28" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* ── Avatar ─────────────────────────────────────── */}
                    <SectionCard title="Profile Picture">
                        <div className="flex items-center gap-6">
                            <div className="relative flex-shrink-0">
                                <div className="w-24 h-24 rounded-2xl border-2 border-gray-200 overflow-hidden bg-indigo-100 flex items-center justify-center">
                                    {avatarSrc ? (
                                        <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-indigo-400 font-black text-3xl">
                                            {profile?.fullName?.[0] ?? '?'}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center shadow-lg transition-colors"
                                >
                                    <Camera size={14} />
                                </button>
                                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700">Upload new photo</p>
                                <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5 MB</p>
                                <button
                                    type="button"
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                                >
                                    Choose file
                                </button>
                            </div>
                        </div>
                    </SectionCard>

                    {/* ── Basic Info ─────────────────────────────────── */}
                    <SectionCard title="Basic Information">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Full Name">
                                <input className={inputCls} value={basic.fullName} onChange={e => setBasic(p => ({ ...p, fullName: e.target.value }))} placeholder="Your full name" />
                            </Field>
                            <Field label="Phone Number">
                                <input className={inputCls} value={basic.phoneNumber} onChange={e => setBasic(p => ({ ...p, phoneNumber: e.target.value }))} placeholder="03XX-XXXXXXX" />
                            </Field>
                            <Field label="Headline" hint='e.g. "Expert Electrician with 5 years experience"'>
                                <input className={inputCls} value={basic.headline} onChange={e => setBasic(p => ({ ...p, headline: e.target.value }))} placeholder="Professional headline" />
                            </Field>
                            <Field label="Availability Status">
                                <select className={inputCls} value={basic.availabilityStatus} onChange={e => setBasic(p => ({ ...p, availabilityStatus: e.target.value as typeof STATUS_OPTIONS[number] }))}>
                                    {STATUS_OPTIONS.map(s => (
                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Experience (Years)">
                                <input className={inputCls} type="number" min={0} max={50} value={basic.experienceYears} onChange={e => setBasic(p => ({ ...p, experienceYears: e.target.value === '' ? '' : Number(e.target.value) }))} placeholder="e.g. 5" />
                            </Field>
                            <Field label="Rate per Hour (PKR)">
                                <input className={inputCls} type="number" min={0} value={basic.ratePerHour} onChange={e => setBasic(p => ({ ...p, ratePerHour: e.target.value === '' ? '' : Number(e.target.value) }))} placeholder="e.g. 1500" />
                            </Field>
                            <Field label="Bio" hint="Tell clients about yourself">
                                <textarea className={`${inputCls} resize-none sm:col-span-2`} rows={4} value={basic.bio} onChange={e => setBasic(p => ({ ...p, bio: e.target.value }))} placeholder="Describe your experience and skills..." />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* ── Languages ──────────────────────────────────── */}
                    <SectionCard title="Languages">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {languages.map(lang => (
                                <span key={lang} className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full">
                                    {lang}
                                    <button type="button" onClick={() => removeLang(lang)} className="hover:text-red-500 transition-colors"><X size={11} /></button>
                                </span>
                            ))}
                        </div>

                        {/* Quick-add chips */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {COMMON_LANGUAGES.filter(l => !languages.includes(l)).map(lang => (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={() => addLang(lang)}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 border border-dashed border-gray-300 px-3 py-1.5 rounded-full hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                                >
                                    <Plus size={10} />{lang}
                                </button>
                            ))}
                        </div>

                        {/* Custom input */}
                        <div className="flex gap-2">
                            <input
                                className={`${inputCls} flex-1`}
                                value={langInput}
                                onChange={e => setLangInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLang(langInput); } }}
                                placeholder="Type a language and press Enter"
                            />
                            <button
                                type="button"
                                onClick={() => addLang(langInput)}
                                className="px-4 py-3 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    </SectionCard>

                    {/* ── Availability Schedule ──────────────────────── */}
                    <SectionCard title="Availability Schedule">
                        <p className="text-xs text-gray-400 mb-4">Toggle the days you work and set your hours for each.</p>
                        <div className="space-y-2">
                            {DAYS.map(({ key, label }) => {
                                const slot = schedule[key];
                                const active = Boolean(slot);
                                return (
                                    <div
                                        key={key}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${active ? 'border-indigo-200 bg-indigo-50/40' : 'border-gray-100 bg-white'}`}
                                    >
                                        {/* Toggle */}
                                        <button
                                            type="button"
                                            onClick={() => toggleDay(key)}
                                            className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none ${active ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </button>

                                        {/* Day label */}
                                        <span className={`w-9 text-sm font-bold flex-shrink-0 ${active ? 'text-indigo-700' : 'text-gray-400'}`}>
                                            {label}
                                        </span>

                                        {/* Time range */}
                                        {active && slot ? (
                                            <div className="flex items-center gap-2 flex-1">
                                                <input
                                                    type="time"
                                                    value={slot.from}
                                                    onChange={e => updateTime(key, 'from', e.target.value)}
                                                    className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-gray-700 bg-white"
                                                />
                                                <span className="text-gray-400 text-xs font-semibold flex-shrink-0">to</span>
                                                <input
                                                    type="time"
                                                    value={slot.to}
                                                    onChange={e => updateTime(key, 'to', e.target.value)}
                                                    className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-gray-700 bg-white"
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-300 font-medium">Day off</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </SectionCard>

                    {/* ── Portfolio ──────────────────────────────────── */}
                    <SectionCard title={`Portfolio (${portfolio.length}/${MAX_PORTFOLIO})`}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                            {portfolio.map((item, idx) => (
                                <div key={idx} className="relative group rounded-2xl overflow-hidden border border-gray-100">
                                    <div className="aspect-square bg-gray-100">
                                        <img
                                            src={item.preview ?? item.existingUrl ?? ''}
                                            alt={item.caption || `Photo ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removePortfolioItem(idx)}
                                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <X size={13} />
                                    </button>
                                    <div className="p-2 bg-white">
                                        <input
                                            className="w-full text-xs border-0 outline-none text-gray-600 placeholder-gray-300 font-medium"
                                            value={item.caption}
                                            onChange={e => updateCaption(idx, e.target.value)}
                                            placeholder="Add caption..."
                                        />
                                    </div>
                                </div>
                            ))}

                            {portfolio.length < MAX_PORTFOLIO && (
                                <button
                                    type="button"
                                    onClick={() => portfolioInputRef.current?.click()}
                                    className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 flex flex-col items-center justify-center gap-2 transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-gray-100 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center transition-colors">
                                        <Plus size={20} className="text-gray-400 group-hover:text-indigo-600" />
                                    </div>
                                    <span className="text-xs text-gray-400 group-hover:text-indigo-600 font-semibold transition-colors">Add Photo</span>
                                </button>
                            )}
                        </div>
                        <input
                            ref={portfolioInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handlePortfolioAdd}
                        />
                        <p className="text-xs text-gray-400">Up to {MAX_PORTFOLIO} photos · Max 5 MB each</p>
                    </SectionCard>

                    {/* ── Services ───────────────────────────────────── */}
                    <SectionCard title="Services">

                        {/* Existing services list */}
                        {services.length > 0 && (
                            <div className="space-y-3 mb-4">
                                {services.map((svc, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:border-indigo-100 transition-colors group">
                                        <div className="bg-indigo-50 p-2.5 rounded-xl flex-shrink-0">
                                            <SvcIcon iconKey={svc.iconKey} size={18} className="text-indigo-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 text-sm">{svc.name}</p>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                <span className="text-indigo-600 font-bold text-xs">Rs. {Number(svc.price).toLocaleString()}</span>
                                                {svc.durationHrs !== '' && svc.durationHrs !== null && (
                                                    <>
                                                        <span className="text-gray-300">·</span>
                                                        <span className="text-gray-400 text-xs flex items-center gap-1"><Clock size={10} />{svc.durationHrs} hrs</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button type="button" onClick={() => startEditSvc(idx)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-xs font-bold">Edit</button>
                                            <button type="button" onClick={() => removeSvc(idx)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Service form */}
                        {showSvcForm && (
                            <div className="border border-indigo-100 bg-indigo-50/30 rounded-2xl p-5 mb-4 space-y-4">
                                <p className="text-sm font-bold text-gray-900">{editingSvcIdx !== null ? 'Edit Service' : 'New Service'}</p>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <Field label="Service Name">
                                        <input className={inputCls} value={newSvc.name} onChange={e => setNewSvc(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Pipe Repair" />
                                    </Field>
                                    <Field label="Icon">
                                        <div className="flex gap-2 flex-wrap">
                                            {ICON_OPTIONS.map(({ key, label, Icon }) => (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => setNewSvc(p => ({ ...p, iconKey: key }))}
                                                    title={label}
                                                    className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all ${newSvc.iconKey === key ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-400 hover:border-indigo-300'}`}
                                                >
                                                    <Icon size={16} />
                                                </button>
                                            ))}
                                        </div>
                                    </Field>
                                    <Field label="Price (PKR)">
                                        <input className={inputCls} type="number" min={0} value={newSvc.price} onChange={e => setNewSvc(p => ({ ...p, price: e.target.value === '' ? '' : Number(e.target.value) }))} placeholder="e.g. 1500" />
                                    </Field>
                                    <Field label="Duration (hours)" hint="Optional">
                                        <input className={inputCls} type="number" min={0} step={0.5} value={newSvc.durationHrs} onChange={e => setNewSvc(p => ({ ...p, durationHrs: e.target.value === '' ? '' : Number(e.target.value) }))} placeholder="e.g. 2.5" />
                                    </Field>
                                    <Field label="Description" hint="Optional">
                                        <input className={`${inputCls} sm:col-span-2`} value={newSvc.description} onChange={e => setNewSvc(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of the service" />
                                    </Field>
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={saveSvc} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors">
                                        {editingSvcIdx !== null ? 'Update' : 'Add Service'}
                                    </button>
                                    <button type="button" onClick={resetSvcForm} className="px-5 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {!showSvcForm && (
                            <button
                                type="button"
                                onClick={() => { resetSvcForm(); setShowSvcForm(true); }}
                                className="w-full py-3 border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-gray-400 hover:text-indigo-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                            >
                                <Plus size={16} />
                                Add Service
                            </button>
                        )}
                    </SectionCard>

                    {/* ── Submit ─────────────────────────────────────── */}
                    <div className="flex gap-3 pt-2 pb-6">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 py-3.5 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
