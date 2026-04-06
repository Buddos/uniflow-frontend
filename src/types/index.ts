export type UserRole = 'admin' | 'cod' | 'lecturer' | 'timetabling_admin' | 'class_rep';

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
  equipment: string[];
  status: 'available' | 'booked' | 'maintenance';
  resourceHome?: string;
}

export interface TimetableSlot {
  id: string;
  day: string;
  timeSlot: string;
  courseUnit: string;
  courseCode: string;
  venue: string;
  lecturer: string;
  department: string;
  cohortSize: number;
}

export interface CourseRequest {
  id: string;
  courseUnit: string;
  courseCode: string;
  requestingDept: string;
  providingDept: string;
  cohortSize: number;
  status: 'pending' | 'accepted' | 'rejected';
  requestDate: string;
}

export interface AcademicTrip {
  id: string;
  cohort: string;
  destination: string;
  startDate: string;
  endDate: string;
  affectedSlots: string[];
  department: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'request' | 'schedule' | 'alert' | 'info' | 'feedback';
  read: boolean;
  timestamp: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  assignedVenue: string;
  status: 'available' | 'in-use' | 'maintenance';
  resourceHome: string;
}

/** COD Submission for semester planning */
export interface DepartmentSubmission {
  id: string;
  department: string;
  submittedBy: string;
  submittedDate: string;
  status: 'draft' | 'submitted' | 'consolidated' | 'published';
  courseUnits: SubmittedCourseUnit[];
}

export interface SubmittedCourseUnit {
  id: string;
  courseUnit: string;
  courseCode: string;
  lecturerName: string;
  numberOfStudents: number;
  specialNeeds: string;
}

/** Cross-department course requests */
export interface CrossDepartmentRequest {
  id: string;
  requestingDepartment: string;
  providingDepartment: string;
  courseUnit: string;
  courseCode: string;
  requesterName: string;
  numberOfStudents: number;
  status: 'pending' | 'accepted' | 'declined';
  requestDate: string;
}

/** Feedback from class reps during Week 1 */
export interface ClassRepFeedback {
  id: string;
  courseCode: string;
  courseUnit: string;
  venue: string;
  issue: 'overcrowding' | 'equipment' | 'wrong-venue' | 'scheduling-conflict' | 'other';
  description: string;
  reportedBy: string;
  reportedDate: string;
  status: 'open' | 'resolved' | 'dismissed';
}

export type WorkflowPhase =
  | 'cod-submission'
  | 'det-consolidation'
  | 'draft-timetable'
  | 'feedback-loop'
  | 'det-adjustments'
  | 'final-requirements';
