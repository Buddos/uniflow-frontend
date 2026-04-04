import { Venue, TimetableSlot, CourseRequest, AcademicTrip, Notification, Equipment, User } from '@/types';

export const mockUsers: User[] = [
  { id: '1', name: 'Dr. Admin Mwangi', email: 'admin@university.ac.ke', role: 'admin' },
  { id: '2', name: 'Prof. Jane Wanjiku', email: 'cod@university.ac.ke', role: 'cod', department: 'Computer Science' },
  { id: '3', name: 'Dr. Peter Ochieng', email: 'lecturer@university.ac.ke', role: 'lecturer', department: 'Computer Science' },
];

export const mockVenues: Venue[] = [
  { id: 'pst1', name: 'PST 1', capacity: 200, location: 'Block A', equipment: ['Projector', 'Whiteboard'], status: 'booked', resourceHome: 'PST Office' },
  { id: 'pst2', name: 'PST 2', capacity: 180, location: 'Block A', equipment: ['Projector'], status: 'available', resourceHome: 'PST Office' },
  { id: 'pst3', name: 'PST 3', capacity: 150, location: 'Block A', equipment: ['Whiteboard'], status: 'available', resourceHome: 'PST Office' },
  { id: 'pst4', name: 'PST 4', capacity: 120, location: 'Block A', equipment: ['Projector', 'Whiteboard'], status: 'booked', resourceHome: 'PST Office' },
  { id: 'pst5', name: 'PST 5', capacity: 100, location: 'Block A', equipment: ['Whiteboard'], status: 'maintenance', resourceHome: 'PST Office' },
  { id: 'npl1', name: 'NPL 1', capacity: 300, location: 'Block B', equipment: ['Projector', 'PA System'], status: 'booked', resourceHome: 'NPL Office' },
  { id: 'npl2', name: 'NPL 2', capacity: 250, location: 'Block B', equipment: ['Projector'], status: 'available', resourceHome: 'NPL Office' },
  { id: 'npl3', name: 'NPL 3', capacity: 220, location: 'Block B', equipment: ['Projector', 'Whiteboard'], status: 'booked', resourceHome: 'NPL Office' },
  { id: 'npl4', name: 'NPL 4', capacity: 180, location: 'Block B', equipment: ['Whiteboard'], status: 'available', resourceHome: 'NPL Office' },
  { id: 'npl5', name: 'NPL 5', capacity: 160, location: 'Block B', equipment: ['Projector'], status: 'available', resourceHome: 'NPL Office' },
  { id: 'npl6', name: 'NPL 6', capacity: 140, location: 'Block B', equipment: ['Whiteboard'], status: 'booked', resourceHome: 'NPL Office' },
  { id: 'b1', name: 'B1', capacity: 350, location: 'Main Campus', equipment: ['Projector', 'PA System', 'Whiteboard'], status: 'booked', resourceHome: 'Main Office' },
  { id: 'b2', name: 'B2', capacity: 280, location: 'Main Campus', equipment: ['Projector'], status: 'available', resourceHome: 'Main Office' },
  { id: 'b3', name: 'B3', capacity: 200, location: 'Main Campus', equipment: ['Projector', 'Whiteboard'], status: 'available', resourceHome: 'Main Office' },
  { id: 'b4', name: 'B4', capacity: 160, location: 'Main Campus', equipment: ['Whiteboard'], status: 'booked', resourceHome: 'Main Office' },
  { id: 'b5', name: 'B5', capacity: 130, location: 'Main Campus', equipment: ['Projector'], status: 'available', resourceHome: 'Main Office' },
  { id: 'ed1', name: 'ED 1', capacity: 250, location: 'Education Block', equipment: ['Projector', 'PA System'], status: 'booked', resourceHome: 'Education Office' },
  { id: 'ed4', name: 'ED 4', capacity: 180, location: 'Education Block', equipment: ['Projector', 'Whiteboard'], status: 'available', resourceHome: 'Education Office' },
  { id: 'ed5', name: 'ED 5', capacity: 150, location: 'Education Block', equipment: ['Whiteboard'], status: 'available', resourceHome: 'Education Office' },
];

export const mockTimetable: TimetableSlot[] = [
  { id: '1', day: 'Monday', timeSlot: '7:00-9:00', courseUnit: 'Data Structures', courseCode: 'CS201', venue: 'NPL 1', lecturer: 'Dr. Ochieng', department: 'Computer Science', cohortSize: 250 },
  { id: '2', day: 'Monday', timeSlot: '9:00-11:00', courseUnit: 'Calculus II', courseCode: 'MAT201', venue: 'B1', lecturer: 'Prof. Kamau', department: 'Mathematics', cohortSize: 300 },
  { id: '3', day: 'Monday', timeSlot: '11:00-1:00', courseUnit: 'Database Systems', courseCode: 'CS301', venue: 'PST 1', lecturer: 'Dr. Wanjiku', department: 'Computer Science', cohortSize: 180 },
  { id: '4', day: 'Monday', timeSlot: '2:00-4:00', courseUnit: 'Physics I', courseCode: 'PHY101', venue: 'NPL 3', lecturer: 'Dr. Otieno', department: 'Physics', cohortSize: 200 },
  { id: '5', day: 'Tuesday', timeSlot: '7:00-9:00', courseUnit: 'Software Engineering', courseCode: 'CS401', venue: 'PST 2', lecturer: 'Dr. Ochieng', department: 'Computer Science', cohortSize: 160 },
  { id: '6', day: 'Tuesday', timeSlot: '9:00-11:00', courseUnit: 'Linear Algebra', courseCode: 'MAT301', venue: 'ED 1', lecturer: 'Prof. Nyambura', department: 'Mathematics', cohortSize: 220 },
  { id: '7', day: 'Tuesday', timeSlot: '11:00-1:00', courseUnit: 'Computer Networks', courseCode: 'CS302', venue: 'NPL 2', lecturer: 'Dr. Muthoni', department: 'Computer Science', cohortSize: 200 },
  { id: '8', day: 'Tuesday', timeSlot: '2:00-4:00', courseUnit: 'Statistics', courseCode: 'MAT202', venue: 'B2', lecturer: 'Dr. Akinyi', department: 'Mathematics', cohortSize: 250 },
  { id: '9', day: 'Wednesday', timeSlot: '7:00-9:00', courseUnit: 'Operating Systems', courseCode: 'CS303', venue: 'PST 4', lecturer: 'Dr. Ochieng', department: 'Computer Science', cohortSize: 100 },
  { id: '10', day: 'Wednesday', timeSlot: '9:00-11:00', courseUnit: 'Discrete Mathematics', courseCode: 'MAT101', venue: 'NPL 1', lecturer: 'Prof. Kamau', department: 'Mathematics', cohortSize: 280 },
  { id: '11', day: 'Wednesday', timeSlot: '2:00-4:00', courseUnit: 'AI & Machine Learning', courseCode: 'CS501', venue: 'PST 1', lecturer: 'Dr. Wanjiku', department: 'Computer Science', cohortSize: 150 },
  { id: '12', day: 'Thursday', timeSlot: '7:00-9:00', courseUnit: 'Calculus II', courseCode: 'MAT201', venue: 'B1', lecturer: 'Prof. Kamau', department: 'Mathematics', cohortSize: 300 },
  { id: '13', day: 'Thursday', timeSlot: '9:00-11:00', courseUnit: 'Data Structures', courseCode: 'CS201', venue: 'NPL 1', lecturer: 'Dr. Ochieng', department: 'Computer Science', cohortSize: 250 },
  { id: '14', day: 'Thursday', timeSlot: '11:00-1:00', courseUnit: 'Web Development', courseCode: 'CS304', venue: 'ED 4', lecturer: 'Dr. Muthoni', department: 'Computer Science', cohortSize: 170 },
  { id: '15', day: 'Friday', timeSlot: '7:00-9:00', courseUnit: 'Database Systems', courseCode: 'CS301', venue: 'PST 1', lecturer: 'Dr. Wanjiku', department: 'Computer Science', cohortSize: 180 },
  { id: '16', day: 'Friday', timeSlot: '9:00-11:00', courseUnit: 'Physics I', courseCode: 'PHY101', venue: 'NPL 3', lecturer: 'Dr. Otieno', department: 'Physics', cohortSize: 200 },
  { id: '17', day: 'Friday', timeSlot: '11:00-1:00', courseUnit: 'Software Engineering', courseCode: 'CS401', venue: 'PST 2', lecturer: 'Dr. Ochieng', department: 'Computer Science', cohortSize: 160 },
];

export const mockCourseRequests: CourseRequest[] = [
  { id: '1', courseUnit: 'Calculus I', courseCode: 'MAT101', requestingDept: 'Agriculture', providingDept: 'Mathematics', cohortSize: 200, status: 'pending', requestDate: '2026-03-15' },
  { id: '2', courseUnit: 'Statistics', courseCode: 'MAT202', requestingDept: 'Economics', providingDept: 'Mathematics', cohortSize: 180, status: 'accepted', requestDate: '2026-03-10' },
  { id: '3', courseUnit: 'Physics I', courseCode: 'PHY101', requestingDept: 'Engineering', providingDept: 'Physics', cohortSize: 250, status: 'pending', requestDate: '2026-03-18' },
  { id: '4', courseUnit: 'Chemistry I', courseCode: 'CHM101', requestingDept: 'Pharmacy', providingDept: 'Chemistry', cohortSize: 150, status: 'rejected', requestDate: '2026-03-05' },
];

export const mockTrips: AcademicTrip[] = [
  { id: '1', cohort: 'BSc. Agriculture Y3', destination: 'KARI Research Station', startDate: '2026-04-10', endDate: '2026-04-14', affectedSlots: ['4', '8'], department: 'Agriculture' },
  { id: '2', cohort: 'BSc. Geography Y2', destination: 'Mt. Kenya Region', startDate: '2026-04-20', endDate: '2026-04-25', affectedSlots: ['10', '12'], department: 'Geography' },
];

export const mockNotifications: Notification[] = [
  { id: '1', title: 'New Course Request', message: 'Agriculture dept. requests Calculus I for 200 students', type: 'request', read: false, timestamp: '2026-04-03T08:30:00' },
  { id: '2', title: 'Schedule Change', message: 'NPL 3 unavailable on Thursday due to maintenance', type: 'schedule', read: false, timestamp: '2026-04-02T14:00:00' },
  { id: '3', title: 'Trip Alert', message: 'BSc. Agriculture Y3 field trip Apr 10-14 — venues released', type: 'alert', read: true, timestamp: '2026-04-01T09:15:00' },
  { id: '4', title: 'Timetable Published', message: 'Semester 2 timetable is now available for review', type: 'info', read: true, timestamp: '2026-03-28T16:00:00' },
];

export const mockEquipment: Equipment[] = [
  { id: '1', name: 'Projector A1', type: 'Projector', assignedVenue: 'PST 1', status: 'in-use', resourceHome: 'PST Office' },
  { id: '2', name: 'Projector A2', type: 'Projector', assignedVenue: 'PST 2', status: 'available', resourceHome: 'PST Office' },
  { id: '3', name: 'Projector B1', type: 'Projector', assignedVenue: 'NPL 1', status: 'in-use', resourceHome: 'NPL Office' },
  { id: '4', name: 'PA System 1', type: 'PA System', assignedVenue: 'B1', status: 'in-use', resourceHome: 'Main Office' },
  { id: '5', name: 'Projector C1', type: 'Projector', assignedVenue: 'ED 1', status: 'in-use', resourceHome: 'Education Office' },
  { id: '6', name: 'Projector B2', type: 'Projector', assignedVenue: 'NPL 3', status: 'available', resourceHome: 'NPL Office' },
  { id: '7', name: 'PA System 2', type: 'PA System', assignedVenue: 'NPL 1', status: 'in-use', resourceHome: 'NPL Office' },
];

export const departments = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry',
  'Agriculture', 'Engineering', 'Education', 'Economics',
  'Geography', 'Pharmacy',
];

export const timeSlots = [
  '7:00-9:00', '9:00-11:00', '11:00-1:00', '2:00-4:00', '4:00-6:00',
];

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const mockDepartmentSubmissions: import('@/types').DepartmentSubmission[] = [
  {
    id: 's1', department: 'Computer Science', submittedBy: 'Prof. Jane Wanjiku', submittedDate: '2026-03-20', status: 'submitted',
    courseUnits: [
      { id: 'u1', courseUnit: 'Data Structures', courseCode: 'CS201', lecturerName: 'Dr. Ochieng', numberOfStudents: 250, specialNeeds: 'Projector, PA System' },
      { id: 'u2', courseUnit: 'Database Systems', courseCode: 'CS301', lecturerName: 'Dr. Wanjiku', numberOfStudents: 180, specialNeeds: 'Projector' },
      { id: 'u3', courseUnit: 'Software Engineering', courseCode: 'CS401', lecturerName: 'Dr. Ochieng', numberOfStudents: 160, specialNeeds: '' },
      { id: 'u4', courseUnit: 'Computer Networks', courseCode: 'CS302', lecturerName: 'Dr. Muthoni', numberOfStudents: 200, specialNeeds: 'Projector' },
      { id: 'u5', courseUnit: 'AI & Machine Learning', courseCode: 'CS501', lecturerName: 'Dr. Wanjiku', numberOfStudents: 150, specialNeeds: 'Computer Lab' },
    ],
  },
  {
    id: 's2', department: 'Mathematics', submittedBy: 'Prof. Kamau', submittedDate: '2026-03-22', status: 'submitted',
    courseUnits: [
      { id: 'u6', courseUnit: 'Calculus II', courseCode: 'MAT201', lecturerName: 'Prof. Kamau', numberOfStudents: 300, specialNeeds: 'PA System' },
      { id: 'u7', courseUnit: 'Linear Algebra', courseCode: 'MAT301', lecturerName: 'Prof. Nyambura', numberOfStudents: 220, specialNeeds: '' },
      { id: 'u8', courseUnit: 'Statistics', courseCode: 'MAT202', lecturerName: 'Dr. Akinyi', numberOfStudents: 250, specialNeeds: 'Projector' },
    ],
  },
  {
    id: 's3', department: 'Physics', submittedBy: 'Dr. Otieno', submittedDate: '', status: 'draft',
    courseUnits: [
      { id: 'u9', courseUnit: 'Physics I', courseCode: 'PHY101', lecturerName: 'Dr. Otieno', numberOfStudents: 200, specialNeeds: 'Lab Equipment' },
    ],
  },
];

export const mockClassRepFeedback: import('@/types').ClassRepFeedback[] = [
  { id: 'f1', courseCode: 'CS201', courseUnit: 'Data Structures', venue: 'NPL 1', issue: 'overcrowding', description: 'Hall capacity is 300 but over 320 students showed up. Standing room only.', reportedBy: 'James Mwangi', reportedDate: '2026-04-07', status: 'open' },
  { id: 'f2', courseCode: 'MAT201', courseUnit: 'Calculus II', venue: 'B1', issue: 'equipment', description: 'Projector not working, lecturer had to use whiteboard for 350-seat hall.', reportedBy: 'Grace Achieng', reportedDate: '2026-04-07', status: 'open' },
  { id: 'f3', courseCode: 'CS301', courseUnit: 'Database Systems', venue: 'PST 1', issue: 'scheduling-conflict', description: 'Another class was already in PST 1 when we arrived for the 11:00 slot.', reportedBy: 'Peter Njoroge', reportedDate: '2026-04-08', status: 'resolved' },
];

export const departmentColors: Record<string, string> = {
  'Computer Science': 'bg-primary/15 text-primary border-primary/30',
  'Mathematics': 'bg-info/15 text-info border-info/30',
  'Physics': 'bg-accent/15 text-accent border-accent/30',
  'Chemistry': 'bg-warning/15 text-warning border-warning/30',
  'Agriculture': 'bg-success/15 text-success border-success/30',
  'Engineering': 'bg-destructive/15 text-destructive border-destructive/30',
  'Education': 'bg-primary/15 text-primary border-primary/30',
  'Economics': 'bg-info/15 text-info border-info/30',
  'Geography': 'bg-accent/15 text-accent border-accent/30',
  'Pharmacy': 'bg-warning/15 text-warning border-warning/30',
};
