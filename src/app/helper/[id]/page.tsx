'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { Mail, Phone, MapPin, DollarSign, Briefcase, Star, Shield, Clock, ArrowLeft, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

import { getHelperProfile } from '@/features/helpers/services/helpers.service';
import type { HelperProfile } from '@/features/helpers/services/helpers.service';
import { chatApi } from '@/features/chat/api/chat.api';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { SimpleModal } from '@/components/SimpleModal';
import { BookingForm } from '@/features/bookings/components/BookingForm';

const formatWhatsAppNumber = (phoneNumber: string) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return '92' + cleaned.slice(1);
  }
  return cleaned;
};

export default function HelperProfile() {
  const params = useParams();
  const id = params.id as string;

  const router = useRouter();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { data: helper, isLoading, error } = useQuery({
    queryKey: ['helper', id],
    queryFn: () => getHelperProfile(id),
    enabled: !!id,
  });

  console.log('.......helper........', helper);

  const { isAuthenticated } = useAuthStore();

  const handleChatNow = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      const chat = await chatApi.createChat(helper?.userId as string);
      router.push(`/chats?chatId=${chat.id}`);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setIsBookingModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !helper) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Helper Not Found</h1>
        <p className="text-gray-500 mb-6">The professional you are looking for does not exist or has been removed.</p>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium">
          <ArrowLeft size={20} className="mr-2" />
          Back to Search
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header / Cover */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

          <div className="px-8 pb-8">
            <div className="relative -mt-20 mb-6 flex flex-col md:flex-row items-end md:items-end gap-6">
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                  {helper.profileImage ? (
                    <img src={helper.profileImage} alt={helper.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-4xl">
                      {helper.fullName?.[0]}
                    </div>
                  )}
                </div>
                {/* Verified badge - can add later when backend supports it */}
              </div>

              <div className="flex-1 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{helper.fullName}</h1>
                <p className="text-xl text-blue-600 font-medium mb-2">{helper.headline}</p>
                {helper.reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => {
                        const avgRating = helper.reviews.reduce((sum, r) => sum + r.rating, 0) / helper.reviews.length;
                        return (
                          <Star
                            key={i}
                            size={18}
                            className={i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        );
                      })}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {(helper.reviews.reduce((sum, r) => sum + r.rating, 0) / helper.reviews.length).toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">({helper.reviews.length} reviews)</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleBookNow}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2 text-center"
              >
                <CalendarCheck size={20} />
                Book Now
              </button>
              <button
                onClick={handleChatNow}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/20 transition-all active:scale-95 flex items-center gap-2 text-center"
              >
                <Mail size={20} />
                Chat Now
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {/* Left Column: Info */}
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{helper.bio}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Experience & Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Jobs Completed</p>
                    <p className="text-2xl font-bold text-blue-600">{helper.jobsCompleted}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <p className="text-lg font-bold text-green-600 capitalize">{helper.availabilityStatus}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Reviews {helper.reviews.length > 0 && (
                    <span className="text-sm font-normal text-gray-500">({helper.reviews.length})</span>
                  )}
                </h2>
                {helper.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {helper.reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={review.reviewerImage}
                            alt={review.reviewerName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">{review.reviewerName}</h3>
                              <span className="text-xs text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium text-gray-700">{review.rating}/5</span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
                    No reviews yet. Be the first to hire!
                  </div>
                )}
              </section>
            </div>

            {/* Right Column: Details */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hourly Rate</p>
                    <p className="font-bold text-gray-900">Rs. {helper.ratePerHour}/hr</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-bold text-gray-900">{helper.experienceYears} Years</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-bold text-gray-900">{helper.city}, {helper.region}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SimpleModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Schedule Service"
      >
        <BookingForm
          helperId={helper.id}
          helperName={helper.fullName}
          onSuccess={() => {
            setIsBookingModalOpen(false);
            router.push('/bookings');
          }}
          onCancel={() => setIsBookingModalOpen(false)}
        />
      </SimpleModal>
    </div>
  );
}
