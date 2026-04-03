export type UserRole = 'admin' | 'cod' | 'lecturer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  location: string;
  building: string;
  equipment: string[];
  resourceHome: string;
  status: 'available' | 'booked' | 'maintenance';
}

export interface CourseUnit {
  id: string;
  code: string;
  name: string;
  department: string;
  creditHours: number;
}

export interface TimetableSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  courseUnit: CourseUnit;
  venue: Venue;
  lecturer: string;
  department: string;
  color: string;
}

export interface CourseRequest {
  id: string;
  courseUnit: CourseUnit;
  requestingDepartment: string;
  providingDepartment: string;
  cohortSize: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface AcademicTrip {
  id: string;
  cohort: string;
  courseUnit: string;
  startDate: string;
  endDate: string;
  destination: string;
  affectedSlots: number;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface MakeupClass {
  id: string;
  courseUnit: string;
  lecturer: string;
  date: string;
  timeSlot: string;
  venue: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  assignedHall: string;
  resourceHome: string;
  status: 'available' | 'in-use' | 'maintenance';
  lastCheckedOut?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'request' | 'schedule' | 'alert' | 'info';
  read: boolean;
  createdAt: string;
}
