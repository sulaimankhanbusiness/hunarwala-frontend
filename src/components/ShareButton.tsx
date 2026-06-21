'use client';

import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
  url: string;
  title: string;
  text: string;
  label?: string;
  /** 'light' = outlined button on white bg; 'dark' = glass button on dark/banner bg */
  variant?: 'light' | 'dark';
  className?: string;
}

export function ShareButton({
  url,
  title,
  text,
  label = 'Share Profile',
  variant = 'light',
  className = '',
}: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Profile link copied to clipboard!');
    }
  };

  const base =
    'flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all hover:-translate-y-0.5 active:scale-[0.98]';

  const variantClass =
    variant === 'dark'
      ? 'px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white whitespace-nowrap'
      : 'px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-indigo-300';

  return (
    <button onClick={handleShare} title={label} className={`${base} ${variantClass} ${className}`}>
      <Share2 size={14} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
