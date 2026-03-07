'use client';

import React, { useState } from 'react';
import { Star, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/error';
import { reviewApi } from '../api/review.api';

interface ReviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    onSuccess: () => void;
}

export const ReviewDialog = ({ isOpen, onClose, bookingId, onSuccess }: ReviewDialogProps) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) return;
        setLoading(true);
        try {
            await reviewApi.createReview({ bookingId, rating, comment });
            toast.success('Review submitted successfully! Thank you ✨');
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(getErrorMessage(err, 'Failed to submit review'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-gray-900">Rate & Review</h3>
                        <p className="text-xs text-gray-500 font-medium mt-1">Share your experience with this helper</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="p-1 transition-transform active:scale-90"
                                >
                                    <Star
                                        className={`w-10 h-10 transition-colors ${(hover || rating) >= star
                                            ? 'fill-yellow-400 text-yellow-500'
                                            : 'text-gray-200 fill-gray-100'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-gray-700">
                            {rating === 5 && 'Excellent! 🤩'}
                            {rating === 4 && 'Very Good! 😊'}
                            {rating === 3 && 'Average 🙂'}
                            {rating === 2 && 'Poor ☹️'}
                            {rating === 1 && 'Very Poor 😡'}
                            {rating === 0 && 'Select a rating'}
                        </p>
                    </div>

                    {/* Comment Area */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                            Additional Comments (Optional)
                        </label>
                        <textarea
                            className="w-full p-4 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-gray-50/50"
                            rows={4}
                            placeholder="Tell others how it went..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-6 bg-gray-50/50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-xl transition-all"
                    >
                        Maybe Later
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || rating === 0}
                        className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
                    </button>
                </div>
            </div>
        </div>
    );
};
