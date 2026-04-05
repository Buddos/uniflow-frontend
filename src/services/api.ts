/**
 * API Service Layer
 * All data fetching is abstracted here for easy integration with Java Servlet backend.
 * Replace mock imports with actual fetch() calls to REST endpoints.
 */

import {
  mockVenues, mockTimetable, mockCourseRequests,
  mockTrips, mockNotifications, mockEquipment
} from '@/data/mockData';
import type { Venue, TimetableSlot, CourseRequest, AcademicTrip, Notification, Equipment } from '@/types';

// Base URL for Java Servlet backend
const BASE_URL = import.meta.env.VITE_API_URL || 'https://uniflow-backend-production.up.railway.app/api';

// Simulated network delay
const delay = (ms: number = 300) => new Promise(r => setTimeout(r, ms));

/** GET /api/venues */
export async function fetchVenues(): Promise<Venue[]> {
  await delay();
  // TODO: Replace with fetch(`${BASE_URL}/venues`)
  return mockVenues;
}

/** GET /api/timetable */
export async function fetchTimetable(): Promise<TimetableSlot[]> {
  await delay();
  return mockTimetable;
}

/** GET /api/requests */
export async function fetchCourseRequests(): Promise<CourseRequest[]> {
  await delay();
  return mockCourseRequests;
}

/** POST /api/requests */
export async function submitCourseRequest(request: Omit<CourseRequest, 'id' | 'status' | 'requestDate'>): Promise<CourseRequest> {
  await delay(500);
  return { ...request, id: Date.now().toString(), status: 'pending', requestDate: new Date().toISOString().split('T')[0] };
}

/** GET /api/trips */
export async function fetchTrips(): Promise<AcademicTrip[]> {
  await delay();
  return mockTrips;
}

/** GET /api/notifications */
export async function fetchNotifications(): Promise<Notification[]> {
  await delay();
  return mockNotifications;
}

/** GET /api/equipment */
export async function fetchEquipment(): Promise<Equipment[]> {
  await delay();
  return mockEquipment;
}

/** POST /api/makeup-booking */
export async function bookMakeupClass(booking: { date: string; timeSlot: string; venueId: string }): Promise<{ success: boolean }> {
  await delay(500);
  return { success: true };
}

/** POST /api/auth/login */
export async function loginUser(email: string, password: string): Promise<any> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
}

/** POST /api/auth/register */
export async function registerUser(user: any): Promise<any> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return response.json();
}
