'use client';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/skills.service';
import { Search } from 'lucide-react';

interface SkillSelectProps {
  value: string;
  onChange: (skill: string) => void;
}

export default function SkillSelect({ value, onChange }: SkillSelectProps) {
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  
  console.log('Fetched categories:', categories);
  return (
     <div className="relative group w-full h-[52px]">
        <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
        <select
            className="w-full h-full pl-12 pr-4 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all font-medium text-gray-900 appearance-none cursor-pointer"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">Select Service</option>
            { categories?.map((category: any) => (
                <option key={category.id} value={category.name}>{category.name}</option>
            ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
    </div>
  );
}
