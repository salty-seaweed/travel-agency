import {
  UserGroupIcon,
  ClockIcon,
  MapIcon,
  HeartIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  BuildingLibraryIcon,
  SunIcon,
  AcademicCapIcon,
  CakeIcon,
  CameraIcon,
  HomeIcon,
  TruckIcon,
  WifiIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  StarIcon,
  InformationCircleIcon,
  XCircleIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType } from 'react';

export function getDifficultyColor(level: string): string {
  switch (level?.toLowerCase()) {
    case 'easy':
      return 'green';
    case 'moderate':
      return 'yellow';
    case 'challenging':
      return 'orange';
    case 'expert':
      return 'red';
    default:
      return 'gray';
  }
}

export function getDifficultyProgress(difficulty: string): number {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 25;
    case 'moderate':
      return 50;
    case 'challenging':
      return 75;
    case 'expert':
      return 100;
    default:
      return 25;
  }
}

export function getPackageCategoryIcon(category: string): ComponentType<{ className?: string }> {
  if (!category) return MapIcon;
  const cat = category.toLowerCase();
  if (cat.includes('adventure')) return AcademicCapIcon;
  if (cat.includes('honeymoon')) return HeartIcon;
  if (cat.includes('family')) return UserGroupIcon;
  if (cat.includes('luxury')) return SparklesIcon;
  if (cat.includes('budget')) return CurrencyDollarIcon;
  if (cat.includes('cultural')) return BuildingLibraryIcon;
  if (cat.includes('beach')) return SunIcon;
  if (cat.includes('mountain')) return AcademicCapIcon;
  if (cat.includes('fishing')) return AcademicCapIcon;
  if (cat.includes('diving')) return SparklesIcon;
  if (cat.includes('sailing')) return MapIcon;
  if (cat.includes('wellness')) return HeartIcon;
  if (cat.includes('spa')) return SparklesIcon;
  if (cat.includes('food')) return CakeIcon;
  if (cat.includes('photography')) return CameraIcon;
  if (cat.includes('water')) return SunIcon;
  return MapIcon;
}

export function getInclusionCategoryIcon(itemText: string): ComponentType<{ className?: string }> {
  const text = itemText?.toLowerCase() ?? '';
  if (text.includes('flight') || text.includes('air') || text.includes('plane')) return PaperAirplaneIcon;
  if (text.includes('accommodation') || text.includes('hotel') || text.includes('room') || text.includes('stay')) return HomeIcon;
  if (text.includes('transport') || text.includes('transfer') || text.includes('car') || text.includes('boat')) return TruckIcon;
  if (text.includes('meal') || text.includes('food') || text.includes('breakfast') || text.includes('dinner') || text.includes('lunch')) return CakeIcon;
  if (text.includes('wifi') || text.includes('internet')) return WifiIcon;
  if (text.includes('activit') || text.includes('tour') || text.includes('excursion')) return GlobeAltIcon;
  if (text.includes('insurance') || text.includes('cover')) return ShieldCheckIcon;
  if (text.includes('guide') || text.includes('host')) return UserIcon;
  return StarIcon;
}

export function getInclusionCategoryColor(itemText: string): string {
  const text = itemText?.toLowerCase() ?? '';
  if (text.includes('flight') || text.includes('air') || text.includes('plane')) return 'indigo';
  if (text.includes('accommodation') || text.includes('hotel') || text.includes('room')) return 'blue';
  if (text.includes('transport') || text.includes('transfer')) return 'green';
  if (text.includes('meal') || text.includes('food')) return 'orange';
  if (text.includes('wifi') || text.includes('internet')) return 'sky';
  if (text.includes('activit') || text.includes('tour')) return 'teal';
  if (text.includes('insurance')) return 'red';
  return 'gray';
}

export function formatItineraryTime(timeString?: string): string {
  if (!timeString) return '';
  try {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return timeString;
  }
}

const DAY_COLORS = ['blue', 'green', 'sky', 'orange', 'teal', 'pink', 'cyan'];
export function getDayColor(day: number): string {
  return DAY_COLORS[(day - 1) % DAY_COLORS.length];
}

const DEST_COLORS = ['blue', 'green', 'sky', 'orange', 'teal', 'pink'];
export function getDestinationColor(index: number): string {
  return DEST_COLORS[index % DEST_COLORS.length];
}

export function getInclusionTypeIcon(type: 'included' | 'excluded' | 'optional') {
  switch (type) {
    case 'included':
      return CheckCircleIcon;
    case 'excluded':
      return XCircleIcon;
    case 'optional':
      return InformationCircleIcon;
    default:
      return CheckCircleIcon;
  }
}

export function getInclusionTypeColor(type: 'included' | 'excluded' | 'optional'): string {
  switch (type) {
    case 'included':
      return 'green';
    case 'excluded':
      return 'red';
    case 'optional':
      return 'orange';
    default:
      return 'gray';
  }
}
