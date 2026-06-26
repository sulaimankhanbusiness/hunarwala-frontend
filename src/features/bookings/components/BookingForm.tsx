'use client';

import React, { useState, useEffect } from 'react';
import { bookingApi } from '../api/booking.api';
import { BookingType } from '../types/booking.types';
import { getHelperPricing, getHelperPricingByHelperId } from '@/features/helpers/services/helpers.service';
import type { HelperService, HelperPricing } from '@/features/helpers/types/helpers.types';
import { Calendar, Clock, PenTool, Loader2, Briefcase, Clock3 } from 'lucide-react';
import { toast } from 'sonner';
import { fbEvent } from '@/lib/pixel';

interface BookingFormProps {
    helperId?: string;
    helperUserId?: string;
    helperIds?: string[];
    helperName: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const BookingForm = ({ helperId, helperUserId, helperIds, helperName, onSuccess, onCancel }: BookingFormProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [helperProfile, setHelperProfile] = useState<HelperPricing | null>(null);
    const [broadcastRates, setBroadcastRates] = useState<number[]>([]);
    const [formData, setFormData] = useState({
        serviceDescription: '',
        scheduledDate: '',
        scheduledTime: '',
        bookingType: BookingType.DAILY,
        serviceId: '',
    });

    const isBroadcast = !!(helperIds && helperIds.length > 0);

    // Single booking: fetch pricing via userId (profile page) or helperId (search page)
    useEffect(() => {
        if (isBroadcast) return;
        if (helperUserId) {
            getHelperPricing(helperUserId).then(setHelperProfile).catch(() => null);
        } else if (helperId) {
            getHelperPricingByHelperId(helperId).then(setHelperProfile).catch(() => null);
        }
    }, [helperId, helperUserId, isBroadcast]);

    // Broadcast: fetch each helper's daily rate for the price range preview
    useEffect(() => {
        if (!isBroadcast || !helperIds?.length) return;
        Promise.all(helperIds.map(id => getHelperPricingByHelperId(id).catch(() => null)))
            .then(results => {
                const rates = results
                    .filter((r): r is HelperPricing => r !== null && !!r.dailyRate)
                    .map(r => Number(r.dailyRate));
                setBroadcastRates(rates);
            });
    }, [isBroadcast, helperIds]);

    const selectedService = helperProfile?.services?.find((s: HelperService) => s.id === formData.serviceId);

    const dailyRate = helperProfile?.dailyRate ? Number(helperProfile.dailyRate) : null;

    const pricePreview = (() => {
        if (isBroadcast) return null;
        if (formData.bookingType === BookingType.SERVICE) {
            return selectedService ? Number(selectedService.price) : null;
        }
        return dailyRate;
    })();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const scheduledAt = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString();

            if (isBroadcast) {
                await bookingApi.createBroadcastBooking({
                    helperIds: helperIds!,
                    serviceDescription: formData.serviceDescription,
                    scheduledAt,
                });
            } else if (helperId) {
                if (formData.bookingType === BookingType.SERVICE && !formData.serviceId) {
                    setError('Please select a service');
                    setLoading(false);
                    return;
                }
                await bookingApi.createBooking({
                    helperId,
                    serviceDescription: formData.serviceDescription,
                    scheduledAt,
                    bookingType: formData.bookingType,
                    serviceId: formData.bookingType === BookingType.SERVICE ? formData.serviceId : undefined,
                });
            } else {
                throw new Error('No helpers selected for booking');
            }

            fbEvent('Lead', { content_name: helperName, value: pricePreview ?? 0, currency: 'PKR' });
            toast.success(isBroadcast
                ? `Broadcast sent to ${helperIds!.length} professional${helperIds!.length > 1 ? 's' : ''}!`
                : 'Booking request sent!');
            onSuccess();
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Reset serviceId when switching back to DAILY
            ...(name === 'bookingType' && value === BookingType.DAILY ? { serviceId: '' } : {}),
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <PenTool className="w-4 h-4" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-blue-900 leading-tight">
                        {isBroadcast ? `Broadcast to ${helperIds!.length} Pros` : `Booking for ${helperName}`}
                    </p>
                    <p className="text-[11px] text-blue-700 mt-0.5">
                        {isBroadcast
                            ? "We'll notify all selected professionals. The first to accept gets the job!"
                            : "Provide job details to send a request."}
                    </p>
                    {isBroadcast && broadcastRates.length > 0 && (
                        <p className="text-[11px] text-blue-600 font-semibold mt-1">
                            {broadcastRates.length === 1
                                ? `Rate: Rs. ${broadcastRates[0].toLocaleString('en-PK')}/day`
                                : `Rates: Rs. ${Math.min(...broadcastRates).toLocaleString('en-PK')} – Rs. ${Math.max(...broadcastRates).toLocaleString('en-PK')}/day`}
                        </p>
                    )}
                </div>
            </div>

            {/* Service Description */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <PenTool className="w-4 h-4" /> Service Description
                </label>
                <textarea
                    name="serviceDescription"
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-sm"
                    placeholder="Describe what you need help with..."
                    value={formData.serviceDescription}
                    onChange={handleChange}
                />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Date
                    </label>
                    <input
                        type="date"
                        name="scheduledDate"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                        value={formData.scheduledDate}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Time
                    </label>
                    <input
                        type="time"
                        name="scheduledTime"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                        value={formData.scheduledTime}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Booking Type — only for single helper bookings */}
            {!isBroadcast && (
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Booking Type</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, bookingType: BookingType.DAILY, serviceId: '' }))}
                            className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                                formData.bookingType === BookingType.DAILY
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                        >
                            <Clock3 className="w-4 h-4 flex-shrink-0" />
                            <span>Daily Rate</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, bookingType: BookingType.SERVICE }))}
                            className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                                formData.bookingType === BookingType.SERVICE
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                        >
                            <Briefcase className="w-4 h-4 flex-shrink-0" />
                            <span>Specific Service</span>
                        </button>
                    </div>

                    {/* Service selector */}
                    {formData.bookingType === BookingType.SERVICE && helperProfile && (
                        <select
                            name="serviceId"
                            value={formData.serviceId}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white"
                        >
                            <option value="">Select a service...</option>
                            {helperProfile.services?.map((svc: HelperService) => (
                                <option key={svc.id} value={svc.id}>
                                    {svc.name} — Rs. {Number(svc.price).toLocaleString('en-PK')}
                                    {svc.durationHrs ? ` (${svc.durationHrs}h)` : ''}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Price preview */}
                    {pricePreview !== null && (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
                            <span className="text-xs text-emerald-700 font-semibold">
                                {formData.bookingType === BookingType.DAILY ? 'Daily Rate' : 'Service Price'}
                            </span>
                            <span className="text-sm font-extrabold text-emerald-800">
                                Rs. {pricePreview.toLocaleString('en-PK')}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
                    {error}
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-200 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Booking'}
                </button>
            </div>
        </form>
    );
};
