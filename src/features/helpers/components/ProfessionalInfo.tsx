'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { getCategories } from '@/features/skills/services/skills.service';
import { Loader2, Briefcase, DollarSign, Clock } from 'lucide-react';

interface ProfessionalInfoProps {
    onNext: (data: any) => void;
    onBack: () => void;
    initialData?: any;
}

export default function ProfessionalInfo({ onNext, onBack, initialData }: ProfessionalInfoProps) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialData
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCategories()
            .then(res => setCategories(res.data || res))
            .finally(() => setIsLoading(false));
    }, []);

    const onSubmit = (data: any) => {
        onNext(data);
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-gray-500 font-medium">Loading categories...</p>
        </div>
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Profile</h2>
                <p className="text-gray-500 text-sm">Tell us what you're great at</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <Briefcase size={14} className="text-blue-500" />
                        Professional Headline
                    </label>
                    <input
                        {...register('headline', { required: 'Headline is required' })}
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        placeholder="e.g. Expert House Painter with 5 years experience"
                    />
                    {errors.headline && <p className="text-red-500 text-[10px] mt-1 ml-1 font-medium">{errors.headline.message as string}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">About You (Bio)</label>
                    <textarea
                        {...register('bio')}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                        placeholder="Describe your skills and services in detail..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Skill Category</label>
                        <select
                            {...register('categoryId', { required: 'Category is required' })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white font-medium text-gray-700"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.categoryId && <p className="text-red-500 text-[10px] mt-1 ml-1 font-medium">{errors.categoryId.message as string}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                            <Clock size={14} className="text-blue-500" />
                            Experience (Years)
                        </label>
                        <input
                            {...register('experienceYears', {
                                required: 'Required',
                                valueAsNumber: true,
                                min: { value: 0, message: 'Invalid' }
                            })}
                            type="number"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            placeholder="0"
                        />
                        {errors.experienceYears && <p className="text-red-500 text-[10px] mt-1 ml-1 font-medium">{errors.experienceYears.message as string}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <DollarSign size={14} className="text-blue-500" />
                        Hourly Rate (Rs.)
                    </label>
                    <input
                        {...register('ratePerHour', {
                            required: 'Rate is required',
                            valueAsNumber: true,
                            min: { value: 100, message: 'Minimum Rs. 100' }
                        })}
                        type="number"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        placeholder="500"
                    />
                    {errors.ratePerHour && <p className="text-red-500 text-[10px] mt-1 ml-1 font-medium">{errors.ratePerHour.message as string}</p>}
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-95"
                >
                    Continue to Location
                </button>
            </div>
        </form>
    );
}
