'use client';

import React, { useState } from 'react';
import { bookingApi } from '../api/booking.api';
import { Calendar, Clock, PenTool, DollarSign, Loader2 } from 'lucide-react';

interface BookingFormProps {
    helperId: string;
    helperName: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const BookingForm = ({ helperId, helperName, onSuccess, onCancel }: BookingFormProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        serviceDescription: '',
        scheduledDate: '',
        scheduledTime: '',
        estimatedPrice: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const scheduledAt = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString();

            await bookingApi.createBooking({
                helperId,
                serviceDescription: formData.serviceDescription,
                scheduledAt,
                estimatedPrice: parseFloat(formData.estimatedPrice),
            });

            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <PenTool className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-sm font-medium text-blue-900">Booking for {helperName}</p>
                    <p className="text-xs text-blue-700">Fill in the details to request a service.</p>
                </div>
            </div>

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

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Estimated Price (PKR)
                </label>
                <div className="relative">
                    <input
                        type="number"
                        name="estimatedPrice"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                        placeholder="e.g. 1500"
                        value={formData.estimatedPrice}
                        onChange={handleChange}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rs.</div>
                </div>
                {/* <p className="text-[10px] text-gray-500">Note: A 5% service fee will be added to the final amount.</p> */}
            </div>

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
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        'Confirm Booking'
                    )}
                </button>
            </div>
        </form>
    );
};
