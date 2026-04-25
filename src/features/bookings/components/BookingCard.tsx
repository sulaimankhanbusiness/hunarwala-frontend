'use client';

import React, { useState } from 'react';
import { Booking, BookingStatus } from '../types/booking.types';
import { bookingApi } from '../api/booking.api';
import { SimpleModal } from '@/components/SimpleModal';
import {
    Calendar,
    Clock,
    MapPin,
    ChevronRight,
    CheckCircle2,
    XCircle,
    PlayCircle,
    Check,
    AlertCircle,
    Copy,
    User,
    DollarSign,
    Loader2,
    Star,
    Phone
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

export const BookingCard = ({ booking, role, onUpdate, viewMode = 'grid' }: BookingCardProps) => {
    const { addNotification } = useNotificationStore();
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(
        (role === 'client' && booking.status === BookingStatus.COMPLETED)
            ? (booking.helperReportedAmount?.toString() || booking.estimatedPrice.toString())
            : booking.estimatedPrice.toString()
    );
    const [showAmountInput, setShowAmountInput] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        action: (reason: string) => Promise<any>;
        placeholder: string;
    }>({
        isOpen: false,
        title: '',
        action: async () => { },
        placeholder: ''
    });
    const [reason, setReason] = useState('');
    const [showReviewDialog, setShowReviewDialog] = useState(false);

    const formattedDate = new Date(booking.scheduledAt).toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    const formattedTime = new Date(booking.scheduledAt).toLocaleTimeString('en-PK', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const handleAction = async (action: () => Promise<any>) => {
        setLoading(true);
        try {
            await action();
            toast.success('Action completed successfully!');

            // Trigger notifications based on action
            if (booking.status === BookingStatus.PENDING) {
                addNotification({
                    title: 'Job Accepted',
                    message: `You have accepted the job for ${booking.user?.fullName}.`,
                    type: 'success',
                    bookingId: booking.id
                });
            } else if (booking.status === BookingStatus.ACCEPTED) {
                addNotification({
                    title: 'Job Started',
                    message: `You started the job for ${booking.user?.fullName}. Good luck!`,
                    type: 'info',
                    bookingId: booking.id
                });
            } else if (booking.status === BookingStatus.COMPLETED) {
                addNotification({
                    title: 'Job Settle',
                    message: `Booking has been settled. Thank you!`,
                    type: 'success',
                    bookingId: booking.id
                });
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

            // Trigger notifications for client actions
            if (modalConfig.title.includes('Cancel')) {
                addNotification({
                    title: 'Booking Cancelled',
                    message: `You cancelled your booking with ${booking.helper?.user?.fullName}.`,
                    type: 'warning',
                    bookingId: booking.id
                });
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

    const StatusBadge = ({ status }: { status: BookingStatus }) => {
        const colors: Record<string, string> = {
            [BookingStatus.PENDING]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            [BookingStatus.ACCEPTED]: 'bg-blue-100 text-blue-700 border-blue-200',
            [BookingStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-700 border-purple-200',
            [BookingStatus.COMPLETED]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            [BookingStatus.SETTLED]: 'bg-green-100 text-green-700 border-green-200',
            [BookingStatus.CANCELLED]: 'bg-gray-100 text-gray-700 border-gray-200',
            [BookingStatus.DISPUTE]: 'bg-orange-100 text-orange-700 border-orange-200',
            [BookingStatus.EXPIRED]: 'bg-red-100 text-red-700 border-red-200',
        };

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
                {status}
            </span>
        );
    };

    const isTerminal = booking.status === BookingStatus.EXPIRED || booking.status === BookingStatus.CANCELLED;

    const borderColors: Record<string, string> = {
        [BookingStatus.PENDING]: 'border-l-yellow-400',
        [BookingStatus.ACCEPTED]: 'border-l-blue-400',
        [BookingStatus.IN_PROGRESS]: 'border-l-purple-400',
        [BookingStatus.COMPLETED]: 'border-l-indigo-400',
        [BookingStatus.SETTLED]: 'border-l-green-400',
        [BookingStatus.CANCELLED]: 'border-l-gray-300',
        [BookingStatus.DISPUTE]: 'border-l-orange-400',
        [BookingStatus.EXPIRED]: 'border-l-red-300',
    };

    if (viewMode === 'list') {
        return (
            <>
                <div className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${borderColors[booking.status] || 'border-l-gray-200'} shadow-sm hover:shadow-md transition-all overflow-hidden ${isTerminal ? 'opacity-70' : ''}`}>
                    <div className="px-4 py-3 flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-9 h-9 flex-shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 text-sm">
                            {role === 'client'
                                ? booking.helper?.user?.fullName?.charAt(0).toUpperCase() || 'H'
                                : booking.user?.fullName?.charAt(0).toUpperCase() || 'C'}
                        </div>

                        {/* Name + description */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                                {role === 'client' ? (booking.helper?.user?.fullName || 'Awaiting Helper') : booking.user?.fullName}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate italic">"{booking.serviceDescription}"</p>
                        </div>

                        {/* Date */}
                        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-500 flex-shrink-0">
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                            <span className="font-semibold">{formattedDate}</span>
                        </div>

                        {/* Price */}
                        <div className="flex-shrink-0 text-right">
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Estimated</p>
                            <p className="text-sm font-black text-gray-900">Rs. {Number(booking.estimatedPrice).toLocaleString('en-PK')}</p>
                        </div>

                        {/* Status */}
                        <div className="flex-shrink-0">
                            <StatusBadge status={booking.status} />
                        </div>
                    </div>
                </div>

                <SimpleModal
                    isOpen={modalConfig.isOpen}
                    onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                    title={modalConfig.title}
                >
                    <div className="space-y-4">
                        <textarea
                            className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            rows={4}
                            placeholder={modalConfig.placeholder}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleModalSubmit}
                                disabled={loading || !reason.trim()}
                                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </SimpleModal>
            </>
        );
    }

    return (
        <div className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${borderColors[booking.status] || 'border-l-gray-200'} shadow-sm hover:shadow-md transition-all overflow-hidden group ${isTerminal ? 'opacity-70' : ''}`}>
            {/* Header info */}
            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-white to-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                        {role === 'client' ? (
                            booking.helper?.user?.fullName?.charAt(0).toUpperCase() || 'H'
                        ) : (
                            booking.user?.fullName?.charAt(0).toUpperCase() || 'C'
                        )}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 leading-tight">
                            {role === 'client' ? (booking.helper?.user?.fullName || 'Awaiting Helper') : booking.user?.fullName}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-medium">
                            Booked on {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <StatusBadge status={booking.status} />
            </div>

            {/* Body info */}
            <div className="p-4 space-y-3">
                <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100/50">
                    <p className="text-xs text-gray-700 font-medium line-clamp-2 italic">
                        "{booking.serviceDescription}"
                    </p>
                </div>

                {/* Status-specific Reasons */}
                {booking.status === BookingStatus.CANCELLED && booking.cancellationReason && (
                    <div className="bg-red-50/50 rounded-xl p-3 border border-red-100 flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                        <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-[10px] text-red-600 font-black uppercase tracking-wider">Cancellation Reason</p>
                            <p className="text-xs text-red-700 font-medium mt-0.5 leading-relaxed">{booking.cancellationReason}</p>
                        </div>
                    </div>
                )}

                {booking.status === BookingStatus.DISPUTE && booking.disputeReason && (
                    <div className="bg-orange-50/50 rounded-xl p-3 border border-orange-100 flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-3.5 h-3.5 text-orange-500 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-[10px] text-orange-600 font-black uppercase tracking-wider">Dispute Reason</p>
                            <p className="text-xs text-orange-700 font-medium mt-0.5 leading-relaxed">{booking.disputeReason}</p>
                        </div>
                    </div>
                )}
                {booking.status === BookingStatus.EXPIRED && (
                    <div className="bg-red-50/50 rounded-xl p-3 border border-red-100 flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-[10px] text-red-600 font-black uppercase tracking-wider">Expired</p>
                            <p className="text-xs text-red-700 font-medium mt-0.5 leading-relaxed">This booking request has expired because it was not accepted within 15 minutes.</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-[11px] text-gray-600 bg-white p-2 rounded-lg border border-gray-50 shadow-sm">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-semibold">{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-600 bg-white p-2 rounded-lg border border-gray-50 shadow-sm">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-semibold">{formattedTime}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Estimated</span>
                        <span className="text-sm font-black text-gray-900">Rs. {Number(booking.estimatedPrice).toLocaleString('en-PK')}</span>
                    </div>
                </div>

                {/* Bill Summary Section (Simple) */}
                {(booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.SETTLED) && (
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-2xl border border-blue-100/50 mt-4 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Final Bill</h5>
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded-full uppercase">Verified</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                            <span className="text-sm font-black text-gray-900">Total Payable</span>
                            <span className="text-lg font-black text-blue-700">
                                Rs. {(Number(booking.agreedAmount) || Number(booking.helperReportedAmount) || 0).toLocaleString('en-PK')}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Actions */}
            <div className="px-4 py-3 bg-gray-50/30 border-t border-gray-50 flex flex-wrap gap-2">
                {loading ? (
                    <div className="w-full flex justify-center py-2">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <>
                        {/* HELPER ACTIONS */}
                        {role === 'helper' && booking.status === BookingStatus.PENDING && (
                            <>
                                <button
                                    onClick={() => handleAction(() => bookingApi.acceptBooking(booking.id))}
                                    className="flex-1 bg-green-600 text-white text-[11px] font-bold py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm shadow-green-100 flex items-center justify-center gap-1.5"
                                >
                                    <Check className="w-3.5 h-3.5" /> Accept
                                </button>
                                <button
                                    onClick={() => setModalConfig({
                                        isOpen: true,
                                        title: 'Reject Booking',
                                        placeholder: 'Enter reason for rejection...',
                                        action: (r) => bookingApi.rejectBooking(booking.id, r)
                                    })}
                                    className="flex-1 bg-white text-red-600 border border-red-100 text-[11px] font-bold py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <XCircle className="w-3.5 h-3.5" /> Reject
                                </button>
                            </>
                        )}

                        {role === 'helper' && booking.status === BookingStatus.ACCEPTED && (
                            <button
                                onClick={() => {
                                    // Optionally get geolocation here
                                    if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition(
                                            (pos) => {
                                                handleAction(() => bookingApi.startBooking(booking.id, {
                                                    latitude: pos.coords.latitude,
                                                    longitude: pos.coords.longitude
                                                }));
                                            },
                                            () => {
                                                handleAction(() => bookingApi.startBooking(booking.id));
                                            }
                                        );
                                    } else {
                                        handleAction(() => bookingApi.startBooking(booking.id));
                                    }
                                }}
                                className="w-full bg-blue-600 text-white text-[11px] font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-100 flex items-center justify-center gap-1.5"
                            >
                                <PlayCircle className="w-3.5 h-3.5" /> Start Job
                            </button>
                        )}

                        {role === 'helper' && booking.status === BookingStatus.IN_PROGRESS && (
                            <div className="w-full space-y-2">
                                {!showAmountInput ? (
                                    <button
                                        onClick={() => setShowAmountInput(true)}
                                        className="w-full bg-indigo-600 text-white text-[11px] font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-100 flex items-center justify-center gap-1.5"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Set as Completed
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <div className="flex-1 relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">Rs.</span>
                                            <input
                                                type="number"
                                                placeholder="Final Amount"
                                                className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-200 text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleAction(() => bookingApi.completeBooking(booking.id, parseFloat(amount)))}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold"
                                        >
                                            Finish
                                        </button>
                                        <button
                                            onClick={() => setShowAmountInput(false)}
                                            className="bg-gray-100 text-gray-500 px-3 py-2 rounded-lg text-xs"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* CLIENT ACTIONS */}
                        {role === 'client' && booking.status === BookingStatus.PENDING && (
                            <button
                                onClick={() => setModalConfig({
                                    isOpen: true,
                                    title: 'Cancel Booking',
                                    placeholder: 'Enter reason for cancellation...',
                                    action: (r) => bookingApi.cancelBooking(booking.id, r)
                                })}
                                className="w-full bg-white text-gray-500 border border-gray-200 text-[11px] font-bold py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                            >
                                <XCircle className="w-3.5 h-3.5" /> Cancel Booking
                            </button>
                        )}

                        {role === 'client' && booking.status === BookingStatus.ACCEPTED && (
                            <div className="w-full p-2.5 bg-blue-50/50 rounded-xl border border-blue-100/50 flex items-center justify-center gap-2">
                                <AlertCircle className="w-3.5 h-3.5 text-blue-600" />
                                <p className="text-[10px] text-blue-700 font-bold uppercase tracking-tight">
                                    Helper will notify you when work starts
                                </p>
                            </div>
                        )}

                        {role === 'client' && booking.status === BookingStatus.COMPLETED && (
                            <div className="w-full space-y-2">
                                {!showAmountInput ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAction(() => bookingApi.settleBooking(booking.id, parseFloat(amount)))}
                                            className="flex-1 bg-green-600 text-white text-[11px] font-bold py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm shadow-green-100 flex items-center justify-center gap-1.5"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Confirm & Settle
                                        </button>
                                        <button
                                            onClick={() => setShowAmountInput(true)}
                                            className="px-3 bg-white text-gray-600 border border-gray-200 text-[11px] font-bold py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                                            title="Edit Amount"
                                        >
                                            Rs. {amount}
                                        </button>
                                        <button
                                            onClick={() => setModalConfig({
                                                isOpen: true,
                                                title: 'Dispute Booking',
                                                placeholder: 'Enter reason for dispute...',
                                                action: (r) => bookingApi.disputeBooking(booking.id, r)
                                            })}
                                            className="flex-1 bg-white text-orange-600 border border-orange-100 text-[11px] font-bold py-2 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            <AlertCircle className="w-3.5 h-3.5" /> Dispute
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 animate-in slide-in-from-right-2">
                                        <div className="flex-1 relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">Rs.</span>
                                            <input
                                                type="number"
                                                placeholder="Corrected Amount"
                                                className="w-full pl-8 pr-3 py-2 rounded-lg border border-blue-200 text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={() => setShowAmountInput(false)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                                        >
                                            Done
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}


                        {role === 'client' && booking.status === BookingStatus.SETTLED && !booking.review && (
                            <button
                                onClick={() => setShowReviewDialog(true)}
                                className="w-full bg-yellow-500 text-white text-[11px] font-bold py-2 rounded-lg hover:bg-yellow-600 transition-colors shadow-sm shadow-yellow-100 flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-bottom-2"
                            >
                                <Star className="w-3.5 h-3.5" /> Rate & Review Helper
                            </button>
                        )}

                        {booking.review && (
                            <div className="w-full py-2.5 px-3 bg-gradient-to-br from-yellow-50/50 to-white border border-yellow-100 rounded-xl flex items-center justify-between shadow-sm shadow-yellow-50/50">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-yellow-600 uppercase tracking-widest">Your Rating</span>
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                className={`w-3 h-3 ${s <= (booking.review?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-100'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {booking.review.comment && (
                                    <div className="flex-1 ml-4 border-l border-yellow-100 pl-3">
                                        <p className="text-[10px] text-gray-600 italic line-clamp-2 leading-relaxed">
                                            "{booking.review.comment}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* SHARED ACTIONS: unlocked only after booking is accepted */}
                        {(booking.status === BookingStatus.ACCEPTED ||
                            booking.status === BookingStatus.IN_PROGRESS ||
                            booking.status === BookingStatus.COMPLETED) && (() => {
                                const phone = role === 'client'
                                    ? booking.helper?.user?.phoneNumber
                                    : booking.user?.phoneNumber;
                                const name = role === 'client'
                                    ? booking.helper?.user?.fullName
                                    : booking.user?.fullName;
                                const waNumber = phone?.replace(/\D/g, '').replace(/^0/, '92');
                                const waMsg = encodeURIComponent(`Hi ${name}, regarding my HunarWalaa booking — ${booking.serviceDescription}`);
                                return (
                                    <div className="w-full flex gap-2">
                                        <a
                                            href={`tel:${phone}`}
                                            className="flex-1 bg-blue-600 text-white text-[11px] font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-100 flex items-center justify-center gap-1.5"
                                        >
                                            <Phone className="w-3.5 h-3.5" /> Call
                                        </a>
                                        <a
                                            href={`https://wa.me/${waNumber}?text=${waMsg}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-[11px] font-bold py-2 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
                                        >
                                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white flex-shrink-0">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.845L.057 23.571a.5.5 0 0 0 .612.612l5.726-1.478A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.896 0-3.67-.52-5.187-1.427l-.372-.22-3.853.994.995-3.853-.22-.372A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                                            </svg>
                                            WhatsApp
                                        </a>
                                    </div>
                                );
                            })()
                        }
                    </>
                )}
            </div>

            <SimpleModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                title={modalConfig.title}
            >
                <div className="space-y-4">
                    <textarea
                        className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                        rows={4}
                        placeholder={modalConfig.placeholder}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <div className="flex gap-3">
                        <button
                            onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleModalSubmit}
                            disabled={loading || !reason.trim()}
                            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Confirm'}
                        </button>
                    </div>
                </div>
            </SimpleModal>

            <ReviewDialog
                isOpen={showReviewDialog}
                onClose={() => setShowReviewDialog(false)}
                bookingId={booking.id}
                onSuccess={() => onUpdate()}
            />
        </div >
    );
};
