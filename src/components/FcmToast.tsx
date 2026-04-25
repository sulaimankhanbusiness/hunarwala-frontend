'use client';

import { Bell, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';

type NotificationType = 'info' | 'success' | 'warning';

interface FcmToastProps {
  id: string | number;
  title: string;
  body: string;
  type: NotificationType;
  link?: string;
}

const typeConfig = {
  info: {
    Icon: Bell,
    borderColor: 'border-l-blue-500',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-600 ring-blue-200',
    dot: 'bg-blue-500',
  },
  success: {
    Icon: CheckCircle2,
    borderColor: 'border-l-emerald-500',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-600 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  warning: {
    Icon: AlertTriangle,
    borderColor: 'border-l-amber-500',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    badge: 'bg-amber-50 text-amber-600 ring-amber-200',
    dot: 'bg-amber-500',
  },
} satisfies Record<NotificationType, object>;

export function FcmToast({ id, title, body, type, link }: FcmToastProps) {
  const { Icon, borderColor, iconBg, iconColor, badge, dot } = typeConfig[type];

  const handleClick = () => {
    if (link && typeof window !== 'undefined') window.location.href = link;
    toast.dismiss(id);
  };

  return (
    <div
      onClick={handleClick}
      className={[
        'group relative flex items-start gap-3',
        'w-[340px] max-w-[calc(100vw-2rem)]',
        'rounded-2xl bg-white',
        'border border-gray-100 border-l-4', borderColor,
        'px-4 py-3.5',
        'shadow-[0_8px_30px_rgba(0,0,0,0.12)]',
        link ? 'cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-shadow' : '',
      ].join(' ')}
    >
      {/* Animated dot */}
      <span className={`absolute top-3 right-3 h-2 w-2 rounded-full ${dot} ring-2 ring-white`}>
        <span className={`absolute inset-0 rounded-full ${dot} animate-ping opacity-60`} />
      </span>

      {/* Icon */}
      <div className={`flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={18} className={iconColor} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{title}</p>
          <span className={`flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider ring-1 ${badge}`}>
            {type}
          </span>
        </div>

        {/* Body */}
        {body ? (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{body}</p>
        ) : null}

        {/* Footer */}
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-[10px] font-bold text-blue-600 tracking-tight">HunarWalaa</span>
          <span className="text-[10px] text-amber-500 font-bold">.</span>
          {link && (
            <span className="text-[10px] text-gray-400 ml-1">Tap to open →</span>
          )}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); toast.dismiss(id); }}
        className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-5 w-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500"
        aria-label="Dismiss notification"
      >
        <X size={11} />
      </button>
    </div>
  );
}
