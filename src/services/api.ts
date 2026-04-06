// src/services/api.ts
/**
 * API Service Layer
 * All data fetching is abstracted here for easy integration with Java Servlet backend.
 */

import type { Venue, TimetableSlot, CourseRequest, AcademicTrip, Notification, Equipment } from '@/types';

// Base URL for Java Servlet backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

/** GET /api/venues/all */
export async function fetchVenues(): Promise<Venue[]> {
  const response = await fetch(`${BASE_URL}/venues/all`);
  if (!response.ok) throw new Error('Failed to fetch venues');
  return response.json();
}

/** GET /api/timetable */
export async function fetchTimetable(): Promise<TimetableSlot[]> {
  const response = await fetch(`${BASE_URL}/timetable`);
  if (!response.ok) throw new Error('Failed to fetch timetable');
  return response.json();
}

/** GET /api/requests */
export async function fetchCourseRequests(): Promise<CourseRequest[]> {
  const response = await fetch(`${BASE_URL}/requests`);
  if (!response.ok) throw new Error('Failed to fetch course requests');
  return response.json();
}

/** POST /api/requests */
export async function submitCourseRequest(request: Omit<CourseRequest, 'id' | 'status' | 'requestDate'>): Promise<CourseRequest> {
  const response = await fetch(`${BASE_URL}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  if (!response.ok) throw new Error('Failed to submit course request');
  return response.json();
}

/** GET /api/trips */
export async function fetchTrips(): Promise<AcademicTrip[]> {
  const response = await fetch(`${BASE_URL}/trips`);
  if (!response.ok) throw new Error('Failed to fetch trips');
  return response.json();
}

/** GET /api/notifications */
export async function fetchNotifications(): Promise<Notification[]> {
  const response = await fetch(`${BASE_URL}/notifications`);
  if (!response.ok) throw new Error('Failed to fetch notifications');
  return response.json();
}

/** GET /api/equipment */
export async function fetchEquipment(): Promise<Equipment[]> {
  const response = await fetch(`${BASE_URL}/equipment`);
  if (!response.ok) throw new Error('Failed to fetch equipment');
  return response.json();
}

/** POST /api/bookings */
export async function bookMakeupClass(booking: { date: string; timeSlot: string; venueId: string }): Promise<{ success: boolean }> {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  });
  if (!response.ok) throw new Error('Failed to book makeup class');
  return response.json();
}

/** POST /api/auth/login */
export async function loginUser(email: string, password: string): Promise<any> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
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
export async function registerUser(user: any): Promise<any> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
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
