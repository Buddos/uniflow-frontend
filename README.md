# UniFlow Frontend

A modern, responsive web application for seamless academic scheduling and venue allocation. UniFlow enables departments, lecturers, and class representatives to collaborate efficiently in managing course requirements, timetables, and real-time issue reporting.

## 🎯 Overview

UniFlow is a comprehensive platform designed to streamline the academic planning and timetabling process. It provides:

- **Requirement Elicitation System**: Course of Departments (CODs), lecturers, and administrators submit course requirements for optimal timetabling
- **Cross-Department Coordination**: Manage course unit requests between departments
- **Live Venue Allocation**: Real-time tracking and allocation of venues with zero-conflict assurance
- **Class Representative Issue Reporting**: Student class representatives report real-time issues like overcrowding, equipment problems, and scheduling conflicts
- **Role-Based Dashboards**: Tailored interfaces for Admins, CODs, Lecturers, and Class Representatives

## 🚀 Key Features

### For Course of Departments (CODs)
- Submit department course requirements using templates or start from scratch
- Use last semester's requirements as a template and edit for new submissions
- Manage cross-department course requests from other departments
- Track pending requests and acceptance status
- Submit compiled requirements directly to timetabling admin before deadlines

### For Class Representatives
- Report real class issues (overcrowding, equipment failures, scheduling conflicts)
- Track issue status in real-time
- View dashboard statistics (total issues, pending, resolved, urgent)
- Categorize issues and set priorities for quick resolution

### For Timetabling Admins
- Consolidate department submissions
- Review and approve course requirements
- Handle cross-department requests
- Allocate venues based on submitted requirements
- Monitor class rep feedback for timetabling adjustments

### For Lecturers & Administrators
- View assigned courses and venues
- Access consolidated timetables
- Monitor equipment and venue allocations
- Receive notifications about changes and requests

## 🛠 Tech Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite 5+
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Context & Hooks
- **HTTP Client**: Fetch API
- **Form Handling**: React Hook Form
- **Data Fetching**: TanStack React Query
- **UI Feedback**: Sonner (Toast notifications)
- **Icons**: Lucide React
- **Testing**: Vitest & Playwright

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or bun, yarn)
- **Git**: For version control

## 🔧 Installation

### 1. Clone the Repository
```bash
cd c:\Users\bonface\Documents\uniflow
```

### 2. Install Dependencies
```bash
cd Uniflow-frontend
npm install
# or
bun install
```

### 3. Environment Configuration
Create a `.env` file in the root directory with the following variables:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=UniFlow
```

## ▶️ Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:3000/` (or the next available port)

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Run Tests
```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Lint Code
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

## 📁 Project Structure

```
Uniflow-frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── dashboards/       # Role-specific dashboards
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── CodDashboard.tsx
│   │   │   ├── ClassRepDashboard.tsx
│   │   │   └── LecturerDashboard.tsx
│   │   ├── ui/              # shadcn/ui base components
│   │   ├── AppSidebar.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── TopBar.tsx
│   │   ├── NavLink.tsx
│   │   └── NotificationBell.tsx
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Landing/home page
│   │   ├── LoginPage.tsx    # Login/register page
│   │   ├── DashboardPage.tsx # Main dashboard router
│   │   ├── TimetablePage.tsx
│   │   ├── VenuesPage.tsx
│   │   ├── EquipmentPage.tsx
│   │   ├── CourseRequestsPage.tsx
│   │   ├── AdminConsolidationPage.tsx
│   │   ├── WorkflowPage.tsx
│   │   └── NotFound.tsx
│   ├── contexts/            # React Context
│   │   └── AuthContext.tsx  # Authentication & user state
│   ├── services/            # API services
│   │   └── api.ts           # API communication layer
│   ├── hooks/               # Custom React hooks
│   │   └── use-toast.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── data/                # Mock data
│   │   └── mockData.ts
│   ├── lib/                 # Utility functions
│   │   └── utils.ts
│   ├── test/                # Test files
│   │   ├── setup.ts
│   │   └── example.test.ts
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Application entry point
│   ├── App.css
│   └── index.css
├── public/                  # Static assets
├── components.json          # shadcn/ui configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Vitest configuration
├── playwright.config.ts     # Playwright configuration
├── eslint.config.js         # ESLint configuration
├── postcss.config.js        # PostCSS configuration
├── package.json             # Project dependencies
├── bun.lockb                # Lock file (if using bun)
└── README.md               # This file
```

## 🔐 Authentication & User Roles

The application supports the following user roles:

| Role | Access | Permissions |
|------|--------|-------------|
| **Admin** | AdminDashboard | System administration, deadline enforcement, consolidated submissions review |
| **COD** | CodDashboard | Submit course requirements, manage cross-department requests, view submissions |
| **Class Rep** | ClassRepDashboard | Report class issues, track issues, view statistics |
| **Lecturer** | LecturerDashboard | View timetables, courses, venues, equipment allocation |
| **Timetabling Admin** | AdminConsolidationPage | Consolidate requirements, allocate venues, manage timetabling |

### Registration
Users register with their role at the landing page. Available roles:
- Student
- Lecturer
- Class Rep
- Admin
- Timetabling Admin (optional)

### Login
Users login with email and password to access their role-specific dashboard.

## 🔌 API Integration

The frontend communicates with the backend via RESTful API endpoints at `http://localhost:8080/api/`:

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/check-session` - Verify session validity

### Course Requirement Endpoints
- `POST /requirements/submit` - Submit department requirements
- `GET /requirements/cross-dept` - Get cross-department requests
- `PUT /requirements/cross-dept/{id}` - Accept/decline cross-department request

### Issue Reporting Endpoints
- `POST /issues/report` - Report class issue
- `GET /issues` - Get reported issues
- `PUT /issues/{id}/status` - Update issue status

## 🎨 UI Components

The app uses **shadcn/ui** components for a consistent, modern interface:

### Common Components
- **Button** - Action buttons with variants
- **Card** - Content containers
- **Dialog** - Modal dialogs
- **Input** - Text input fields
- **Select** - Dropdown selectors
- **Badge** - Status indicators
- **Tabs** - Tabbed interfaces
- **Alert** - Alert messages
- **Tables** - Data display

## 🎯 Key Pages

### Landing Page (`/`)
- **Purpose**: First impression and authentication gateway
- **Features**: Hero section, features showcase, requirement elicitation workflow explanation
- **Actions**: Login or register users

### Dashboard (`/dashboard`)
- **Purpose**: Central hub for all users
- **Features**: Role-based routing to appropriate dashboard
- **Dynamic**: Changes based on user role

### COD Dashboard
- **Requirement Submission**: Create/edit course requirements
- **Template Management**: Load and edit last semester's template
- **Cross-Department Requests**: Manage incoming requests from other departments
- **Statistics**: Track pending and accepted requests

### Class Rep Dashboard
- **Issue Reporting**: Report class issues with category, priority, and description
- **Dashboard Stats**: View issue metrics (total, pending, resolved, urgent)
- **Issue Tracking**: Monitor status of reported issues
- **Issue List**: View all reported issues

### Admin Consolidation Page
- **Requirement Review**: View all department submissions
- **Venue Allocation**: Allocate venues based on requirements
- **Deadline Management**: Enforce submission deadlines
- **Statistics**: Monitor submission status

### Timetable Page (`/timetable`)
- Display full timetable with course details
- Filter by department, day, or venue
- Show venue capacity and occupancy information

### Venues Page (`/venues`)
- Live venue status and availability
- Venue details (capacity, equipment, location)
- Booking information and conflicts

### Equipment Page (`/equipment`)
- Equipment inventory management
- Equipment status and location
- Maintenance tracking

### Course Requests Page (`/course-requests`)
- Review cross-department course requests
- Accept or decline requests
- Track request status and history

## 🔄 Data Flow

### Requirement Submission Flow
1. COD accesses CodDashboard
2. Selects template-based or fresh submission
3. Fills course requirement details
4. Optionally incorporates cross-department requests
5. Submits to Timetabling Admin
6. Admin consolidates all submissions
7. Creates timetable and allocates venues

### Issue Reporting Flow
1. Class Rep accesses ClassRepDashboard
2. Fills issue reporting form
3. Categorizes issue and sets priority
4. Submits issue
5. Issue appears in admin/timetabling admin dashboard
6. Status updated as issue is resolved

## 🧪 Testing

### Unit Tests
Run with:
```bash
npm run test
```

### E2E Tests
Run with:
```bash
npm run test:e2e
```

### Test Coverage
Generate coverage report:
```bash
npm run test:coverage
```

## 📦 Dependencies

### Core
- **react**: ^18.2.0 - UI library
- **react-router-dom**: ^6.x - Client-side routing
- **typescript**: ^5.x - Type safety

### UI & Styling
- **tailwindcss**: ^3.x - CSS framework
- **shadcn-ui**: Latest - Component library
- **lucide-react**: ^0.x - Icon library

### State & Data
- **@tanstack/react-query**: ^5.x - Data fetching & caching
- **sonner**: Latest - Toast notifications

### Forms
- **react-hook-form**: ^7.x - Form state management

### Development
- **vite**: ^5.x - Build tool
- **vitest**: Latest - Testing framework
- **playwright**: Latest - E2E testing
- **eslint**: ^8.x - Code linting

For the complete list of dependencies, see [package.json](package.json).

## 🚨 Environment Errors

### Port Already in Use
If port 3000 is already in use, Vite will automatically try the next available port (3001, 3002, etc).

### Backend Connection Issues
Ensure the backend is running at `http://localhost:8080`. Update `VITE_API_BASE_URL` in `.env` if using a different URL.

### Session Errors
Clear cookies and local storage if experiencing authentication issues:
```javascript
localStorage.clear();
sessionStorage.clear();
// Clear cookies in browser dev tools
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md)
- **Desktop**: 1024px - 1280px (lg)
- **Large Desktop**: > 1280px (xl)

## 🔗 Useful Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React Router](https://reactrouter.com)
- [TanStack Query](https://tanstack.com/query/)

## 🤝 Contributing

When making changes:

1. Ensure code follows TypeScript best practices
2. Use existing UI components from shadcn/ui
3. Follow the project structure organization
4. Add tests for new features
5. Update this README if adding significant features
6. Run linter before committing: `npm run lint`

## 📝 Notes

- All mock data is used for demonstration. Replace with actual API calls when backend is ready.
- The authentication context manages user state globally.
- Role-based access is enforced on the frontend; ensure backend also validates roles.
- Notification system uses Sonner for toast messages.

## 🐛 Troubleshooting

### Hot Module Replacement (HMR) Not Working
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Build Errors
```bash
# Check TypeScript errors
npm run type-check

# Run linter
npm run lint
```

### 404 Not Found on Refresh
This is expected with SPA routing. Ensure your backend serves `index.html` for all routes, or use hash-based routing.

## 📄 License

This project is part of the University platform initiative.

## 📞 Support

For issues or questions, contact the development team or open an issue in the repository.

---

**Last Updated**: April 2026
**Version**: 1.0.0

