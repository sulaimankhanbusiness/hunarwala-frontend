import api from '@/lib/api';

export enum ContactSubject {
  BOOKING     = 'booking',
  PAYMENT     = 'payment',
  HELPER      = 'helper',
  COMPLAINT   = 'complaint',
  PARTNERSHIP = 'partnership',
  OTHER       = 'other',
}

export interface ContactInfo {
  id: number;
  type: 'CALL' | 'WHATSAPP' | 'EMAIL' | 'LOCATION';
  label: string;
  value: string;
  subText: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
}

export interface BusinessHour {
  id: number;
  dayLabel: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  sortOrder: number;
}

export interface SocialLink {
  id: number;
  platform: 'FACEBOOK' | 'INSTAGRAM' | 'LINKEDIN' | 'TWITTER' | 'TIKTOK';
  label: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ContactSubmitPayload {
  fullName: string;
  phone: string;
  email: string;
  subject: ContactSubject;
  message: string;
}

export const contactApi = {
  getInfo:          () => api.get<ContactInfo[]>('/contact/info'),
  getFaqs:          () => api.get<Faq[]>('/contact/faqs'),
  getBusinessHours: () => api.get<BusinessHour[]>('/contact/business-hours'),
  getSocialLinks:   () => api.get<SocialLink[]>('/contact/social-links'),
  submit:           (payload: ContactSubmitPayload) => api.post('/contact/submit', payload),
};
