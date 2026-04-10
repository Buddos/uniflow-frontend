// src/services/api.ts
/**
 * API Service Layer
 * All data fetching is abstracted here for easy integration with Java Servlet backend.
 */

import type {
  Venue,
  TimetableSlot,
  CourseRequest,
  AcademicTrip,
  Notification,
  Equipment,
  DepartmentSubmission,
  CrossDepartmentRequest,
  ClassRepFeedback,
  SubmittedCourseUnit,
} from '@/types';

// Base URL for Java Servlet backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

export interface EquipmentVoucherResponse {
  qrCodeBase64: string;
  payload: unknown;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: ApiUser;
  message?: string;
  error?: string;
}

/** GET /api/venues */
export async function fetchVenues(): Promise<Venue[]> {
  const response = await fetch(`${BASE_URL}/venues`, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch venues');
  return response.json();
}

/** GET /api/timetable */
export async function fetchTimetable(): Promise<TimetableSlot[]> {
  const response = await fetch(`${BASE_URL}/timetable`, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch timetable');
  return response.json();
}

/** GET /api/requests */
export async function fetchCourseRequests(): Promise<CourseRequest[]> {
  const response = await fetch(`${BASE_URL}/requests`, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch course requests');
  return response.json();
}

/** POST /api/requests */
export async function submitCourseRequest(request: Omit<CourseRequest, 'id' | 'status' | 'requestDate'>): Promise<CourseRequest> {
  const response = await fetch(`${BASE_URL}/requests`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  if (!response.ok) throw new Error('Failed to submit course request');
  return response.json();
}

/** GET /api/trips */
export async function fetchTrips(): Promise<AcademicTrip[]> {
  const response = await fetch(`${BASE_URL}/trips`, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch trips');
  return response.json();
}

/** GET /api/notifications */
export async function fetchNotifications(): Promise<Notification[]> {
  const response = await fetch(`${BASE_URL}/notifications`, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch notifications');
  return response.json();
}

/** GET /api/equipment */
export async function fetchEquipment(): Promise<Equipment[]> {
  const response = await fetch(`${BASE_URL}/equipment`, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch equipment');
  return response.json();
}

/** POST /api/bookings */
export async function bookMakeupClass(booking: { date: string; timeSlot: string; venueId: string }): Promise<{ success: boolean }> {
  const response = await fetch(`${BASE_URL}/bookings`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  });
  if (!response.ok) throw new Error('Failed to book makeup class');
  return response.json();
}

/** GET /api/bookings/:id/voucher */
export async function getEquipmentVoucher(bookingId: string | number): Promise<EquipmentVoucherResponse> {
  const response = await fetch(`${BASE_URL}/bookings/${bookingId}/voucher`, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch equipment voucher');
  return response.json();
}

/** POST /api/auth/login */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || errorData.error || 'Login failed');
  }
  return response.json();
}

/** POST /api/auth/register */
export async function registerUser(user: { name: string; email: string; password: string; role: string }): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || errorData.error || 'Registration failed');
  }
  return response.json();
}

/** GET /api/departments/submissions */
export async function fetchDepartmentSubmissions(): Promise<DepartmentSubmission[]> {
  const response = await fetch(`${BASE_URL}/departments/submissions`, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch department submissions');
  return response.json();
}

/** POST /api/departments/submissions */
export async function submitDepartmentRequirements(submission: Omit<DepartmentSubmission, 'id'>): Promise<DepartmentSubmission> {
  const response = await fetch(`${BASE_URL}/departments/submissions`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission)
  });
  if (!response.ok) throw new Error('Failed to submit department requirements');
  return response.json();
}

/** GET /api/cross-department-requests */
export async function fetchCrossDepartmentRequests(): Promise<CrossDepartmentRequest[]> {
  const response = await fetch(`${BASE_URL}/cross-department-requests`, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch cross-department requests');
  return response.json();
}

/** POST /api/trips */
export async function createTrip(trip: Omit<AcademicTrip, 'id'>): Promise<AcademicTrip> {
  const response = await fetch(`${BASE_URL}/trips`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trip)
  });
  if (!response.ok) throw new Error('Failed to create academic trip');
  return response.json();
}

/** PUT /api/trips/:id */
export async function updateTrip(id: string, trip: Partial<AcademicTrip>): Promise<AcademicTrip> {
  const response = await fetch(`${BASE_URL}/trips/${id}`, {
    credentials: 'include',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trip)
  });
  if (!response.ok) throw new Error('Failed to update academic trip');
  return response.json();
}

/** GET /api/class-rep-feedback */
export async function fetchClassRepFeedback(): Promise<ClassRepFeedback[]> {
  const response = await fetch(`${BASE_URL}/class-rep-feedback`, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch class rep feedback');
  return response.json();
}

/** POST /api/class-rep-feedback */
export async function submitClassRepFeedback(feedback: Omit<ClassRepFeedback, 'id'>): Promise<ClassRepFeedback> {
  const response = await fetch(`${BASE_URL}/class-rep-feedback`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback)
  });
  if (!response.ok) throw new Error('Failed to submit class rep feedback');
  return response.json();
}
