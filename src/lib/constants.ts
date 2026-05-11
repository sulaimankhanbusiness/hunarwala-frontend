import { Briefcase, Users, Star, MapPin } from 'lucide-react';

/**
 * Platform-wide stats shown in the hero, services page, and anywhere
 * we surface trust signals. Update here and all pages reflect it.
 */
export const SITE_STATS = [
  { icon: Briefcase, value: '100+', label: 'Jobs Completed'   },
  { icon: Users,     value: '1000+', label: 'Verified Pros'  },
  { icon: Star,      value: '4.8★',   label: 'Avg Rating'     },
  { icon: MapPin,    value: '300+',    label: 'Cities'        },
] as const;
