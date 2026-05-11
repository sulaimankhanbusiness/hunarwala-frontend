'use client';

import { useState } from 'react';
import { Booking, BookingStatus } from '../types/booking.types';
import { bookingApi } from '../api/booking.api';
import { SimpleModal } from '@/components/SimpleModal';
import {
    Calendar, Clock, CheckCircle2, XCircle, PlayCircle,
    Check, AlertCircle, Loader2, Star, Phone, MoreVertical,
} from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/error';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { ReviewDialog } from './ReviewDialog';

interface BookingCardProps {
    booking: Booking;
    role: 'client' | 'helper';
    onUpdate: () => void;
    viewMode?: 'grid' | 'list';
}

// Status config — colors, labels
const STATUS_CONFIG: Record<string, { badge: string; border: string; avatarBg: string; avatarText: string }> = {
    [BookingStatus.PENDING]:     { badge: 'bg-amber-50 text-amber-700 border-amber-200',    border: 'border-l-amber-400',   avatarBg: 'bg-amber-50',   avatarText: 'text-amber-600'   },
    [BookingStatus.ACCEPTED]:    { badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', border: 'border-l-indigo-400',  avatarBg: 'bg-indigo-50',  avatarText: 'text-indigo-600'  },
    [BookingStatus.IN_PROGRESS]: { badge: 'bg-sky-50 text-sky-700 border-sky-200',          border: 'border-l-sky-400',     avatarBg: 'bg-sky-50',     avatarText: 'text-sky-600'     },
    [BookingStatus.COMPLETED]:   { badge: 'bg-violet-50 text-violet-700 border-violet-200', border: 'border-l-violet-400',  avatarBg: 'bg-violet-50',  avatarText: 'text-violet-600'  },
    [BookingStatus.SETTLED]:     { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', border: 'border-l-emerald-400', avatarBg: 'bg-emerald-50', avatarText: 'text-emerald-600' },
    [BookingStatus.CANCELLED]:   { badge: 'bg-gray-100 text-gray-600 border-gray-200',      border: 'border-l-gray-300',    avatarBg: 'bg-gray-100',   avatarText: 'text-gray-500'    },
    [BookingStatus.DISPUTE]:     { badge: 'bg-orange-50 text-orange-700 border-orange-200', border: 'border-l-orange-400',  avatarBg: 'bg-orange-50',  avatarText: 'text-orange-600'  },
    [BookingStatus.EXPIRED]:     { badge: 'bg-red-50 text-red-600 border-red-200',          border: 'border-l-red-300',     avatarBg: 'bg-red-50',     avatarText: 'text-red-500'     },
};

const FALLBACK_CONFIG = { badge: 'bg-gray-100 text-gray-600 border-gray-200', border: 'border-l-gray-300', avatarBg: 'bg-gray-100', avatarText: 'text-gray-500' };

function StatusBadge({ status }: { status: BookingStatus }) {
    const cfg = STATUS_CONFIG[status] ?? FALLBACK_CONFIG;
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${cfg.badge}`}>
            {status.replace('_', ' ')}
        </span>
    );
}

export const BookingCard = ({ booking, role, onUpdate, viewMode = 'list' }: BookingCardProps) => {
    const { addNotification } = useNotificationStore();
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(
        (role === 'client' && booking.status === BookingStatus.COMPLETED)
            ? (booking.helperReportedAmount?.toString() || booking.estimatedPrice.toString())
            : booking.estimatedPrice.toString()
    );
    const [showAmountInput, setShowAmountInput] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean; title: string;
        action: (reason: string) => Promise<any>; placeholder: string;
    }>({ isOpen: false, title: '', action: async () => { }, placeholder: '' });
    const [reason, setReason] = useState('');
    const [showReviewDialog, setShowReviewDialog] = useState(false);

    const cfg = STATUS_CONFIG[booking.status] ?? FALLBACK_CONFIG;
    const isTerminal = booking.status === BookingStatus.EXPIRED || booking.status === BookingStatus.CANCELLED;

    const formattedDate = new Date(booking.scheduledAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = new Date(booking.scheduledAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });

    const counterpartName = role === 'client'
        ? (booking.helper?.user?.fullName || 'Awaiting Helper')
        : (booking.user?.fullName || 'Client');
    const counterpartInitial = counterpartName.charAt(0).toUpperCase();
    const headline = role === 'client' ? booking.helper?.headline : undefined;
    const phone = role === 'client' ? booking.helper?.user?.phoneNumber : booking.user?.phoneNumber;
    const waNumber = phone?.replace(/\D/g, '').replace(/^0/, '92');
    const waMsg = encodeURIComponent(`Hi ${counterpartName}, regarding my HunarWalaa booking — ${booking.serviceDescription}`);
    const canContact = (
        booking.status === BookingStatus.ACCEPTED ||
        booking.status === BookingStatus.IN_PROGRESS ||
        booking.status === BookingStatus.COMPLETED
    );

    const handleAction = async (action: () => Promise<any>) => {
        setLoading(true);
        try {
            await action();
            toast.success('Action completed successfully!');
            if (booking.status === BookingStatus.PENDING) {
                addNotification({ title: 'Job Accepted', message: `Accepted job for ${booking.user?.fullName}.`, type: 'success', bookingId: booking.id });
            } else if (booking.status === BookingStatus.ACCEPTED) {
                addNotification({ title: 'Job Started', message: `Started job for ${booking.user?.fullName}.`, type: 'info', bookingId: booking.id });
            } else if (booking.status === BookingStatus.COMPLETED) {
                addNotification({ title: 'Job Settled', message: 'Booking has been settled. Thank you!', type: 'success', bookingId: booking.id });
            }
            onUpdate();
        } catch (err: any) {
            toast.error(getErrorMessage(err, 'Action failed'));
        } finally {
            setLoading(false);
        }
    };

    const handleModalSubmit = async () => {
        if (!reason.trim()) return;
        setLoading(true);
        try {
            await modalConfig.action(reason);
            toast.success('Submitted successfully!');
            if (modalConfig.title.includes('Cancel')) {
                addNotification({ title: 'Booking Cancelled', message: `Cancelled booking with ${booking.helper?.user?.fullName}.`, type: 'warning', bookingId: booking.id });
            }
            setModalConfig(prev => ({ ...prev, isOpen: false }));
            setReason('');
            onUpdate();
        } catch (err: any) {
            toast.error(getErrorMessage(err, 'Action failed'));
        } finally {
            setLoading(false);
        }
    };

    // ── Primary action for the action button column ───────────────────────────
    const PrimaryAction = () => {
        if (loading) return <Loader2 className="w-4 h-4 animate-spin text-indigo-600 mx-auto" />;

        // HELPER actions
        if (role === 'helper' && booking.status === BookingStatus.PENDING) {
            return (
                <div className="flex gap-1.5">
                    <button onClick={() => handleAction(() => bookingApi.acceptBooking(booking.id))}
                        className="flex-1 bg-emerald-600 text-white text-xs font-bold py-2 px-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button onClick={() => setModalConfig({ isOpen: true, title: 'Reject Booking', placeholder: 'Reason for rejection...', action: (r) => bookingApi.rejectBooking(booking.id, r) })}
                        className="flex-1 bg-white text-red-600 border border-red-100 text-xs font-bold py-2 px-3 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                </div>
            );
        }
        if (role === 'helper' && booking.status === BookingStatus.ACCEPTED) {
            return (
                <button onClick={() => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (pos) => handleAction(() => bookingApi.startBooking(booking.id, { latitude: pos.coords.latitude, longitude: pos.coords.longitude })),
                            () => handleAction(() => bookingApi.startBooking(booking.id))
                        );
                    } else {
                        handleAction(() => bookingApi.startBooking(booking.id));
                    }
                }} className="w-full bg-indigo-600 text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5">
                    <PlayCircle className="w-3.5 h-3.5" /> Start Job
                </button>
            );
        }
        if (role === 'helper' && booking.status === BookingStatus.IN_PROGRESS) {
            return !showAmountInput ? (
                <button onClick={() => setShowAmountInput(true)}
                    className="w-full bg-violet-600 text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Complete
                </button>
            ) : (
                <div className="flex gap-1.5">
                    <div className="flex-1 relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">Rs.</span>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-7 pr-2 py-2 rounded-lg border border-gray-200 text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-400" />
                    </div>
                    <button onClick={() => handleAction(() => bookingApi.completeBooking(booking.id, parseFloat(amount)))}
                        className="bg-violet-600 text-white px-3 py-2 rounded-lg text-xs font-bold">Done</button>
                    <button onClick={() => setShowAmountInput(false)} className="bg-gray-100 text-gray-500 px-2 py-2 rounded-lg text-xs">✕</button>
                </div>
            );
        }

        // CLIENT actions
        if (role === 'client' && booking.status === BookingStatus.PENDING) {
            return (
                <button onClick={() => setModalConfig({ isOpen: true, title: 'Cancel Booking', placeholder: 'Reason for cancellation...', action: (r) => bookingApi.cancelBooking(booking.id, r) })}
                    className="w-full bg-white text-red-600 border border-red-200 text-xs font-bold py-2 px-4 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> Cancel
                </button>
            );
        }
        if (role === 'client' && booking.status === BookingStatus.ACCEPTED) {
            return (
                <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 whitespace-nowrap">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> Awaiting start
                </div>
            );
        }
        if (role === 'client' && booking.status === BookingStatus.COMPLETED) {
            return !showAmountInput ? (
                <div className="flex gap-1.5">
                    <button onClick={() => handleAction(() => bookingApi.settleBooking(booking.id, parseFloat(amount)))}
                        className="flex-1 bg-emerald-600 text-white text-xs font-bold py-2 px-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Settle
                    </button>
                    <button onClick={() => setModalConfig({ isOpen: true, title: 'Dispute Booking', placeholder: 'Reason for dispute...', action: (r) => bookingApi.disputeBooking(booking.id, r) })}
                        className="flex-1 bg-white text-orange-600 border border-orange-100 text-xs font-bold py-2 px-3 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Dispute
                    </button>
                </div>
            ) : (
                <div className="flex gap-1.5">
                    <div className="flex-1 relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">Rs.</span>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-7 pr-2 py-2 rounded-lg border border-indigo-200 text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-400" />
                    </div>
                    <button onClick={() => setShowAmountInput(false)} className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-bold">Done</button>
                </div>
            );
        }
        if (role === 'client' && booking.status === BookingStatus.SETTLED && !booking.review) {
            return (
                <button onClick={() => setShowReviewDialog(true)}
                    className="w-full bg-amber-500 text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-1.5">
                    <Star className="w-3.5 h-3.5" /> Rate Helper
                </button>
            );
        }
        if (booking.review) {
            return (
                <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
                    {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= (booking.review?.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-100'}`} />
                    ))}
                </div>
            );
        }
        return null;
    };

    const modalsJsx = (
        <>
            <SimpleModal isOpen={modalConfig.isOpen} onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))} title={modalConfig.title}>
                <div className="space-y-4">
                    <textarea className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none resize-none" rows={4}
                        placeholder={modalConfig.placeholder} value={reason} onChange={(e) => setReason(e.target.value)} />
                    <div className="flex gap-3">
                        <button onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50">Back</button>
                        <button onClick={handleModalSubmit} disabled={loading || !reason.trim()}
                            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:opacity-50">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Confirm'}
                        </button>
                    </div>
                </div>
            </SimpleModal>
            <ReviewDialog isOpen={showReviewDialog} onClose={() => setShowReviewDialog(false)} bookingId={booking.id} onSuccess={onUpdate} />
        </>
    );

    // ── LIST VIEW ─────────────────────────────────────────────────────────────
    if (viewMode === 'list') {
        return (
            <>
                <div className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${cfg.border} shadow-sm hover:shadow-md transition-all ${isTerminal ? 'opacity-75' : ''}`}>
                    <div className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-center gap-3">

                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full ${cfg.avatarBg} ${cfg.avatarText} flex items-center justify-center font-extrabold text-sm flex-shrink-0 border border-white shadow-sm`}>
                            {counterpartInitial}
                        </div>

                        {/* Name + service + category chip */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{counterpartName}</p>
                            <p className="text-[11px] text-gray-500 truncate">{booking.serviceDescription}</p>
                            {headline && (
                                <span className={`inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                                    {headline}
                                </span>
                            )}
                        </div>

                        {/* Date + time */}
                        <div className="hidden md:flex flex-col gap-0.5 text-[11px] text-gray-500 flex-shrink-0 min-w-[90px]">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400" />{formattedDate}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-gray-400" />{formattedTime}</span>
                        </div>

                        {/* Price */}
                        <div className="hidden sm:block flex-shrink-0 text-right min-w-[90px]">
                            <p className="text-sm font-extrabold text-gray-900">
                                Rs. {Number(booking.agreedAmount || booking.estimatedPrice).toLocaleString('en-PK')}
                            </p>
                            <p className="text-[9px] text-gray-400 uppercase font-bold">Total Payable</p>
                        </div>

                        {/* Status */}
                        <div className="flex-shrink-0">
                            <StatusBadge status={booking.status} />
                        </div>

                        {/* Primary action */}
                        <div className="flex-shrink-0 min-w-[120px]">
                            <PrimaryAction />
                        </div>

                        {/* WhatsApp / Call overflow */}
                        {canContact && (
                            <div className="relative flex-shrink-0">
                                <button onClick={() => setShowActions(!showActions)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                                {showActions && (
                                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden min-w-[140px]" onMouseLeave={() => setShowActions(false)}>
                                        <a href={`tel:${phone}`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                            <Phone className="w-4 h-4 text-indigo-500" /> Call
                                        </a>
                                        <a href={`https://wa.me/${waNumber}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.845L.057 23.571a.5.5 0 0 0 .612.612l5.726-1.478A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.896 0-3.67-.52-5.187-1.427l-.372-.22-3.853.994.995-3.853-.22-.372A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                                            </svg>
                                            WhatsApp
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Status-specific notices */}
                    {booking.status === BookingStatus.CANCELLED && booking.cancellationReason && (
                        <div className="mx-4 mb-3 bg-red-50 rounded-xl p-2.5 border border-red-100 flex items-start gap-2">
                            <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-red-700"><span className="font-bold">Cancelled: </span>{booking.cancellationReason}</p>
                        </div>
                    )}
                    {booking.status === BookingStatus.DISPUTE && booking.disputeReason && (
                        <div className="mx-4 mb-3 bg-orange-50 rounded-xl p-2.5 border border-orange-100 flex items-start gap-2">
                            <AlertCircle className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-orange-700"><span className="font-bold">Dispute: </span>{booking.disputeReason}</p>
                        </div>
                    )}
                    {booking.status === BookingStatus.EXPIRED && (
                        <div className="mx-4 mb-3 bg-red-50 rounded-xl p-2.5 border border-red-100 flex items-start gap-2">
                            <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-red-600">This booking expired because it was not accepted within 15 minutes.</p>
                        </div>
                    )}
                    {booking.review?.comment && (
                        <div className="mx-4 mb-3 bg-amber-50 rounded-xl p-2.5 border border-amber-100">
                            <p className="text-[10px] text-amber-700 italic">"{booking.review.comment}"</p>
                        </div>
                    )}
                </div>
                {modalsJsx}
            </>
        );
    }

    // ── GRID VIEW ─────────────────────────────────────────────────────────────
    return (
        <div className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${cfg.border} shadow-sm hover:shadow-md transition-all overflow-hidden ${isTerminal ? 'opacity-75' : ''}`}>

            {/* Header */}
            <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${cfg.avatarBg} ${cfg.avatarText} flex items-center justify-center font-extrabold border border-white shadow-sm`}>
                        {counterpartInitial}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 leading-tight">{counterpartName}</h4>
                        {headline && <p className="text-[10px] text-gray-400">{headline}</p>}
                    </div>
                </div>
                <StatusBadge status={booking.status} />
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-600 italic line-clamp-2">"{booking.serviceDescription}"</p>
                </div>

                {booking.status === BookingStatus.CANCELLED && booking.cancellationReason && (
                    <div className="bg-red-50 rounded-xl p-2.5 border border-red-100 flex items-start gap-2">
                        <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-700">{booking.cancellationReason}</p>
                    </div>
                )}
                {booking.status === BookingStatus.DISPUTE && booking.disputeReason && (
                    <div className="bg-orange-50 rounded-xl p-2.5 border border-orange-100 flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-orange-700">{booking.disputeReason}</p>
                    </div>
                )}
                {booking.status === BookingStatus.EXPIRED && (
                    <div className="bg-red-50 rounded-xl p-2.5 border border-red-100 flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-600">Expired — not accepted within 15 minutes.</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />{formattedDate}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />{formattedTime}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">
                        {booking.status === BookingStatus.SETTLED || booking.status === BookingStatus.COMPLETED ? 'Final Amount' : 'Estimated'}
                    </span>
                    <span className="text-sm font-extrabold text-gray-900">
                        Rs. {Number(booking.agreedAmount || booking.estimatedPrice).toLocaleString('en-PK')}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-50 space-y-2">
                <PrimaryAction />
                {canContact && (
                    <div className="flex gap-2">
                        <a href={`tel:${phone}`}
                            className="flex-1 bg-indigo-600 text-white text-[11px] font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" /> Call
                        </a>
                        <a href={`https://wa.me/${waNumber}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                            className="flex-1 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-[11px] font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white flex-shrink-0">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.845L.057 23.571a.5.5 0 0 0 .612.612l5.726-1.478A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.896 0-3.67-.52-5.187-1.427l-.372-.22-3.853.994.995-3.853-.22-.372A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                            </svg>
                            WhatsApp
                        </a>
                    </div>
                )}
                {booking.review?.comment && (
                    <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-100">
                        <p className="text-[10px] text-amber-700 italic">"{booking.review.comment}"</p>
                    </div>
                )}
            </div>

            {modalsJsx}
        </div>
    );
};
