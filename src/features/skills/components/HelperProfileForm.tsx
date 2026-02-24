'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { Loader2, Save, User, Briefcase, DollarSign } from 'lucide-react';

const LocationPicker = dynamic(() => import('@/features/location/components/LocationPicker'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-xl" />
});

export default function HelperProfileForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            headline: '',
            bio: '',
            ratePerHour: '',
            experienceYears: ''
        }
    });

    const onSubmit = async (data: any) => {
        if (!location) {
            alert('Please select your location on the map.');
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ...data,
                latitude: location.lat,
                longitude: location.lng
            };

            console.log('Updating profile with location:', payload);
            // await updateHelperProfile(payload);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Update failed:', error);
            alert('Failed to update profile.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-blue-600 p-8 text-white">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <User className="text-blue-200" />
                    Complete Your Helper Profile
                </h2>
                <p className="text-blue-100">Help people find you by providing accurate information and location.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Details */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Briefcase size={16} className="text-blue-600" />
                                Professional Headline
                            </label>
                            <input
                                {...register('headline', { required: 'Headline is required' })}
                                placeholder="e.g. Expert Electrician with 10 years experience"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                            />
                            {errors.headline && <p className="text-red-500 text-xs mt-1">{errors.headline.message as string}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <DollarSign size={16} className="text-blue-600" />
                                    Hourly Rate (Rs)
                                </label>
                                <input
                                    {...register('ratePerHour', { required: 'Rate is required' })}
                                    type="number"
                                    placeholder="1000"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Experience (Years)</label>
                                <input
                                    {...register('experienceYears', { required: 'Experience is required' })}
                                    type="number"
                                    placeholder="5"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tell us more about your skills</label>
                            <textarea
                                {...register('bio', { required: 'Bio is required' })}
                                rows={4}
                                placeholder="Describe your services, tools, and expertise..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Right Column - Location */}
                    {/* <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <LocationPicker onLocationSelect={setLocation} />
                        <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                            <strong>Tip:</strong> Being precise with your location helps you show up first for customers in your immediate neighborhood.
                        </p>
                    </div> */}
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 active:scale-95 disabled:bg-gray-400"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        {isLoading ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
}
