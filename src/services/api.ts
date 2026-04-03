/**
 * API Service Layer
 * All data fetching is abstracted here for easy integration with Java Servlet backend.
 * Replace mock data with actual fetch() calls to your REST API endpoints.
 */

import type { Venue, TimetableSlot, CourseRequest, AcademicTrip, MakeupClass, Equipment, Notification } from '@/types';

const API_BASE = '/api'; // Base URL for Java Servlet backend

// Generic fetch wrapper for backend integration
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}

// ---- API FUNCTIONS ----

export const getVenues = async (): Promise<Venue[]> => {
  return apiFetch<Venue[]>('/venues');
};

export const getAvailableVenues = async (): Promise<Venue[]> => {
  return apiFetch<Venue[]>('/venues/available');
};

export const getTimetable = async (): Promise<TimetableSlot[]> => {
  // Assuming there's a timetable endpoint
  return apiFetch<TimetableSlot[]>('/timetable');
};

export const getCourseRequests = async (): Promise<CourseRequest[]> => {
  return apiFetch<CourseRequest[]>('/requests');
};

export const getTrips = async (): Promise<AcademicTrip[]> => {
  return apiFetch<AcademicTrip[]>('/trips');
};

export const getMakeupClasses = async (): Promise<MakeupClass[]> => {
  return apiFetch<MakeupClass[]>('/makeup-classes');
};

export const getEquipment = async (): Promise<Equipment[]> => {
  return apiFetch<Equipment[]>('/equipment');
};

export const getNotifications = async (): Promise<Notification[]> => {
  return apiFetch<Notification[]>('/notifications');
};

export const login = async (email: string, password: string): Promise<any> => {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const logout = async (): Promise<any> => {
  return apiFetch('/auth/logout', {
    method: 'POST',
  });
};

export const checkSession = async (): Promise<any> => {
  return apiFetch('/auth/check-session');
};

export const mockVenues: Venue[] = [
  // PST Venues
  { id: '1', name: 'PST 1', capacity: 300, location: 'Main Campus', building: 'PST Block', equipment: ['Projector', 'Whiteboard', 'PA System'], resourceHome: 'PST Office', status: 'available' },
  { id: '2', name: 'PST 2', capacity: 250, location: 'Main Campus', building: 'PST Block', equipment: ['Projector', 'Whiteboard'], resourceHome: 'PST Office', status: 'booked' },
  { id: '3', name: 'PST 3', capacity: 200, location: 'Main Campus', building: 'PST Block', equipment: ['Projector', 'Whiteboard'], resourceHome: 'PST Office', status: 'available' },
  { id: '4', name: 'PST 4', capacity: 150, location: 'Main Campus', building: 'PST Block', equipment: ['Projector'], resourceHome: 'PST Office', status: 'maintenance' },
  { id: '5', name: 'PST 5', capacity: 120, location: 'Main Campus', building: 'PST Block', equipment: ['Projector', 'Whiteboard'], resourceHome: 'PST Office', status: 'available' },
  // NPL Venues
  { id: '6', name: 'NPL 1', capacity: 350, location: 'Main Campus', building: 'NPL Block', equipment: ['Projector', 'PA System', 'Whiteboard'], resourceHome: 'NPL Office', status: 'booked' },
  { id: '7', name: 'NPL 2', capacity: 280, location: 'Main Campus', building: 'NPL Block', equipment: ['Projector', 'Whiteboard'], resourceHome: 'NPL Office', status: 'available' },
  { id: '8', name: 'NPL 3', capacity: 200, location: 'Main Campus', building: 'NPL Block', equipment: ['Projector', 'Whiteboard'], resourceHome: 'NPL Office', status: 'available' },
  { id: '9', name: 'NPL 4', capacity: 180, location: 'Main Campus', building: 'NPL Block', equipment: ['Projector'], resourceHome: 'NPL Office', status: 'booked' },
  { id: '10', name: 'NPL 5', capacity: 150, location: 'Main Campus', building: 'NPL Block', equipment: ['Projector', 'Whiteboard'], resourceHome: 'NPL Office', status: 'available' },
  { id: '11', name: 'NPL 6', capacity: 100, location: 'Main Campus', building: 'NPL Block', equipment: ['Whiteboard'], resourceHome: 'NPL Office', status: 'maintenance' },
  // B Venues
  { id: '12', name: 'B1', capacity: 400, location: 'Main Campus', building: 'B Block', equipment: ['Projector', 'PA System', 'Whiteboard'], resourceHome: 'B Block Office', status: 'available' },
  { id: '13', name: 'B2', capacity: 300, location: 'Main Campus', building: 'B Block', equipment: ['Projector', 'Whiteboard'], resourceHome: 'B Block Office', status: 'booked' },
  { id: '14', name: 'B3', capacity: 250, location: 'Main Campus', building: 'B Block', equipment: ['Projector', 'Whiteboard'], resourceHome: 'B Block Office', status: 'available' },
  { id: '15', name: 'B4', capacity: 200, location: 'Main Campus', building: 'B Block', equipment: ['Projector'], resourceHome: 'B Block Office', status: 'available' },
  { id: '16', name: 'B5', capacity: 150, location: 'Main Campus', building: 'B Block', equipment: ['Projector', 'Whiteboard'], resourceHome: 'B Block Office', status: 'booked' },
  // Ed Venues
  { id: '17', name: 'Ed 1', capacity: 200, location: 'Main Campus', building: 'Education Block', equipment: ['Projector', 'Whiteboard'], resourceHome: 'Education Office', status: 'available' },
  { id: '18', name: 'Ed 4', capacity: 180, location: 'Main Campus', building: 'Education Block', equipment: ['Projector', 'Whiteboard'], resourceHome: 'Education Office', status: 'booked' },
  { id: '19', name: 'Ed 5', capacity: 150, location: 'Main Campus', building: 'Education Block', equipment: ['Projector'], resourceHome: 'Education Office', status: 'available' },
];

const colors = ['bg-primary/15 text-primary border-l-4 border-primary', 'bg-accent/15 text-accent border-l-4 border-accent', 'bg-success/15 text-success border-l-4 border-success', 'bg-warning/15 border-l-4 border-warning', 'bg-info/15 text-info border-l-4 border-info'];

export const mockTimetable: TimetableSlot[] = [
  { id: '1', day: 'Monday', startTime: '08:00', endTime: '10:00', courseUnit: { id: 'c1', code: 'MAT 201', name: 'Calculus II', department: 'Mathematics', creditHours: 3 }, venue: mockVenues[0], lecturer: 'Dr. Kimani', department: 'Engineering', color: colors[0] },
  { id: '2', day: 'Monday', startTime: '10:00', endTime: '12:00', courseUnit: { id: 'c2', code: 'ENG 301', name: 'Thermodynamics', department: 'Engineering', creditHours: 3 }, venue: mockVenues[5], lecturer: 'Prof. Ochieng', department: 'Engineering', color: colors[1] },
  { id: '3', day: 'Tuesday', startTime: '08:00', endTime: '10:00', courseUnit: { id: 'c3', code: 'PHY 101', name: 'Physics I', department: 'Physics', creditHours: 3 }, venue: mockVenues[11], lecturer: 'Dr. Wanjiku', department: 'Science', color: colors[2] },
  { id: '4', day: 'Tuesday', startTime: '14:00', endTime: '16:00', courseUnit: { id: 'c4', code: 'CSC 201', name: 'Data Structures', department: 'Computer Science', creditHours: 3 }, venue: mockVenues[2], lecturer: 'Dr. Muthoni', department: 'IT', color: colors[3] },
  { id: '5', day: 'Wednesday', startTime: '10:00', endTime: '12:00', courseUnit: { id: 'c5', code: 'AGR 102', name: 'Soil Science', department: 'Agriculture', creditHours: 3 }, venue: mockVenues[16], lecturer: 'Prof. Njoroge', department: 'Agriculture', color: colors[4] },
  { id: '6', day: 'Wednesday', startTime: '14:00', endTime: '16:00', courseUnit: { id: 'c1', code: 'MAT 201', name: 'Calculus II', department: 'Mathematics', creditHours: 3 }, venue: mockVenues[6], lecturer: 'Dr. Kimani', department: 'Engineering', color: colors[0] },
  { id: '7', day: 'Thursday', startTime: '08:00', endTime: '10:00', courseUnit: { id: 'c2', code: 'ENG 301', name: 'Thermodynamics', department: 'Engineering', creditHours: 3 }, venue: mockVenues[12], lecturer: 'Prof. Ochieng', department: 'Engineering', color: colors[1] },
  { id: '8', day: 'Thursday', startTime: '12:00', endTime: '14:00', courseUnit: { id: 'c6', code: 'BUS 101', name: 'Intro to Business', department: 'Business', creditHours: 2 }, venue: mockVenues[14], lecturer: 'Dr. Akinyi', department: 'Business', color: colors[3] },
  { id: '9', day: 'Friday', startTime: '08:00', endTime: '10:00', courseUnit: { id: 'c3', code: 'PHY 101', name: 'Physics I', department: 'Physics', creditHours: 3 }, venue: mockVenues[7], lecturer: 'Dr. Wanjiku', department: 'Science', color: colors[2] },
  { id: '10', day: 'Friday', startTime: '10:00', endTime: '12:00', courseUnit: { id: 'c4', code: 'CSC 201', name: 'Data Structures', department: 'Computer Science', creditHours: 3 }, venue: mockVenues[3], lecturer: 'Dr. Muthoni', department: 'IT', color: colors[4] },
];

export const mockCourseRequests: CourseRequest[] = [
  { id: '1', courseUnit: { id: 'c1', code: 'MAT 201', name: 'Calculus II', department: 'Mathematics', creditHours: 3 }, requestingDepartment: 'Engineering', providingDepartment: 'Mathematics', cohortSize: 250, status: 'pending', createdAt: '2026-03-20' },
  { id: '2', courseUnit: { id: 'c3', code: 'PHY 101', name: 'Physics I', department: 'Physics', creditHours: 3 }, requestingDepartment: 'Agriculture', providingDepartment: 'Physics', cohortSize: 180, status: 'accepted', createdAt: '2026-03-18' },
  { id: '3', courseUnit: { id: 'c7', code: 'CHM 101', name: 'Chemistry I', department: 'Chemistry', creditHours: 3 }, requestingDepartment: 'Engineering', providingDepartment: 'Chemistry', cohortSize: 300, status: 'rejected', createdAt: '2026-03-15' },
  { id: '4', courseUnit: { id: 'c8', code: 'STA 201', name: 'Statistics II', department: 'Mathematics', creditHours: 3 }, requestingDepartment: 'Business', providingDepartment: 'Mathematics', cohortSize: 120, status: 'pending', createdAt: '2026-03-22' },
];

export const mockTrips: AcademicTrip[] = [
  { id: '1', cohort: 'BSc. Agriculture Y3', courseUnit: 'AGR 302 - Field Practicum', startDate: '2026-04-10', endDate: '2026-04-14', destination: 'Naivasha Research Station', affectedSlots: 8, status: 'scheduled' },
  { id: '2', cohort: 'BSc. Engineering Y4', courseUnit: 'ENG 401 - Industrial Attachment', startDate: '2026-04-20', endDate: '2026-04-22', destination: 'Mombasa Port', affectedSlots: 5, status: 'scheduled' },
  { id: '3', cohort: 'BA. Geography Y2', courseUnit: 'GEO 201 - Physical Geography', startDate: '2026-03-25', endDate: '2026-03-26', destination: 'Mt. Kenya Region', affectedSlots: 3, status: 'completed' },
];

export const mockMakeupClasses: MakeupClass[] = [
  { id: '1', courseUnit: 'MAT 201 - Calculus II', lecturer: 'Dr. Kimani', date: '2026-04-05', timeSlot: '14:00 - 16:00', venue: 'PST 3', status: 'confirmed' },
  { id: '2', courseUnit: 'PHY 101 - Physics I', lecturer: 'Dr. Wanjiku', date: '2026-04-08', timeSlot: '08:00 - 10:00', venue: 'NPL 3', status: 'pending' },
];

export const mockEquipment: Equipment[] = [
  { id: '1', name: 'Epson Projector #1', type: 'Projector', assignedHall: 'PST 1', resourceHome: 'PST Office', status: 'available' },
  { id: '2', name: 'Epson Projector #2', type: 'Projector', assignedHall: 'PST 2', resourceHome: 'PST Office', status: 'in-use', lastCheckedOut: '2026-03-31 08:00' },
  { id: '3', name: 'Sony PA System', type: 'PA System', assignedHall: 'NPL 1', resourceHome: 'NPL Office', status: 'available' },
  { id: '4', name: 'Dell Projector #1', type: 'Projector', assignedHall: 'B1', resourceHome: 'B Block Office', status: 'in-use', lastCheckedOut: '2026-03-31 10:00' },
  { id: '5', name: 'BenQ Projector #1', type: 'Projector', assignedHall: 'Ed 1', resourceHome: 'Education Office', status: 'maintenance' },
  { id: '6', name: 'Whiteboard Markers Set', type: 'Stationery', assignedHall: 'NPL 3', resourceHome: 'NPL Office', status: 'available' },
];

export const mockNotifications: Notification[] = [
  { id: '1', title: 'New Course Request', message: 'Engineering Dept. has requested Calculus II for 250 students.', type: 'request', read: false, createdAt: '2026-03-31 09:00' },
  { id: '2', title: 'Timetable Updated', message: 'LH-003 has been reassigned for Thursday 10:00-12:00.', type: 'schedule', read: false, createdAt: '2026-03-31 08:30' },
  { id: '3', title: 'Trip Approved', message: 'BSc. Agriculture Y3 trip to Naivasha approved.', type: 'info', read: true, createdAt: '2026-03-30 14:00' },
  { id: '4', title: 'Equipment Overdue', message: 'Epson Projector #2 has not been returned to Sci. Office 205.', type: 'alert', read: false, createdAt: '2026-03-31 07:00' },
  { id: '5', title: 'Makeup Class Confirmed', message: 'MAT 201 makeup on April 5 at LH-003 confirmed.', type: 'schedule', read: true, createdAt: '2026-03-29 16:00' },
];

// Service functions - replace with actual API calls
export const getVenues = async (): Promise<Venue[]> => mockVenues;
export const getTimetable = async (): Promise<TimetableSlot[]> => mockTimetable;
export const getCourseRequests = async (): Promise<CourseRequest[]> => mockCourseRequests;
export const getAcademicTrips = async (): Promise<AcademicTrip[]> => mockTrips;
export const getMakeupClasses = async (): Promise<MakeupClass[]> => mockMakeupClasses;
export const getEquipment = async (): Promise<Equipment[]> => mockEquipment;
export const getNotifications = async (): Promise<Notification[]> => mockNotifications;
