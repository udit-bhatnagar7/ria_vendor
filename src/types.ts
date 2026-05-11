/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VendorStatus =
  | 'New Request'
  | 'Availability Submitted'
  | 'Waiting Seller Approval'
  | 'Scheduled'
  | 'Confirmed'
  | 'On The Way'
  | 'Arrived'
  | 'In Progress'
  | 'Completed'
  | 'Reschedule Requested'
  | 'Declined'
  | 'Expired'
  | 'Blocked';

export interface Vendor {
  id: string;
  name: string;
  email: string;
  businessName: string;
  phone: string;
  serviceTypes: string[];
  operatingAreas: string[];
  avatarUrl?: string;
  rating?: number;
}

export interface VendorSlot {
  date: string;
  startTime: string;
  endTime: string;
}

export interface VendorJobRequest {
  id: string;
  token: string;
  propertyId: string;
  serviceId: string;
  vendorId: string;
  vendorName: string;
  serviceName: string;
  propertyAddress: string;
  durationMinutes: number;
  sellerAvailability: string;
  accessNotes?: string;
  priority: 'High' | 'Normal' | 'Low';
  status: VendorStatus;
  createdAt: string;
  expiresAt: string;
}

export interface Appointment {
  id: string;
  jobId: string;
  vendorId: string;
  propertyAddress: string;
  serviceName: string;
  confirmedStart: string;
  confirmedEnd: string;
  status: VendorStatus;
  accessNotes?: string;
  sellerNotes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

export interface UserMessage {
  id: string;
  jobId: string;
  sender: 'Vendor' | 'System' | 'Agent';
  content: string;
  timestamp: string;
}

export interface VendorService {
  type: string;
  enabled: boolean;
  basePrice: number;
  estimatedDurationMinutes: number;
  turnaroundTimeHours: number;
  notes?: string;
}

export interface VendorMedia {
  id: string;
  url: string;
  type: 'portfolio' | 'avatar' | 'logo' | 'banner';
  order: number;
}

export interface VendorPerformance {
  completedJobs: number;
  onTimePercentage: number;
  cancellationRate: number;
  avgResponseTimeMinutes: number;
  ratingAverage: number;
}

export interface VendorProfile {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  bio?: string;
  website?: string;
  yearsExperience?: number;
  avatarUrl?: string;
  logoUrl?: string;
  bannerUrl?: string;
  serviceTypes: string[];
  operatingAreas: string[];
  
  services: VendorService[];
  
  pricing: {
    minPrice: number;
    maxPrice: number;
    model: 'fixed' | 'hourly' | 'package';
    travelFee: number;
    rushFee: number;
    weekendFee: number;
  };
  
  availability: {
    workingHours: {
      [key: string]: { start: string; end: string; enabled: boolean };
    };
    vacationMode: boolean;
    timezone: string;
    blockedDates: string[];
    maxJobsPerDay: number;
  };
  
  performance: VendorPerformance;
  
  portfolio: VendorMedia[];
  
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    scheduling: {
      minNoticeHours: number;
      bufferMinutes: number;
      acceptWeekend: boolean;
      acceptRecurring: boolean;
    };
    communication: {
      preferredMethod: 'email' | 'sms' | 'app';
      autoRespond: boolean;
    };
  };
  
  status: 'Active' | 'Paused' | 'Fully Booked' | 'Disabled';
}
