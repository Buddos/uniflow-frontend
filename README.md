# Uniflow Frontend

A modern, responsive React-based web application for the Uniflow educational management system. Built with Vite, TypeScript, and shadcn/ui components for a seamless user experience.

## Overview

Uniflow Frontend provides an intuitive interface for managing academic operations, including course requests, equipment management, venue bookings, timetable management, and real-time tracking of academic trips. The application features role-based dashboards for Administrators, Coordinators (COD), Lecturers, and Students.

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI based)
- **Forms**: React Hook Form
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Testing**: Vitest + Playwright
- **Linting**: ESLint
- **Package Manager**: Bun

## Features

- 🎯 **Role-Based Dashboards** - Customized interfaces for Admin, COD, Lecturer, and Student roles
- 🔐 **Authentication** - Secure login and session management with AuthContext
- 📚 **Academic Management** - Create and manage course requests, makeup classes, and academic trips
- 🏢 **Venue Management** - Browse and book available venues
- 🛠️ **Equipment Management** - Request and track equipment usage
- 📅 **Timetable** - View and manage class schedules
- 🗺️ **Live Map** - Real-time tracking of academic trips
- 🔔 **Notifications** - Real-time notification system with notification bell
- 📱 **Responsive Design** - Mobile-first, responsive layout
- ♿ **Accessibility** - WCAG-compliant accessible components
- 🎨 **Modern UI** - Clean, professional design with smooth animations

## Prerequisites

- **Node.js**: 18.x or higher
- **Bun**: 1.0.0 or higher (recommended) OR npm/yarn
- **Git**

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Uniflow-frontend
```

### 2. Install Dependencies

Using Bun (recommended):

```bash
bun install
```

Or using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

## Running the Development Server

### Using Bun

```bash
bun run dev
```

### Using npm

```bash
npm run dev
```

### Using yarn

```bash
yarn dev
```

The application will start at `http://localhost:5173`

## Building for Production

### Using Bun

```bash
bun run build
```

### Using npm

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
Uniflow-frontend/
├── public/
│   └── robots.txt              # SEO robots configuration
├── src/
│   ├── assets/                 # Images, icons, static files
│   ├── components/
│   │   ├── dashboard/          # Role-specific dashboards
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── CODDashboard.tsx
│   │   │   └── LecturerDashboard.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── AppLayout.tsx
│   │   │   └── AppSidebar.tsx
│   │   ├── notifications/      # Notification components
│   │   │   └── NotificationBell.tsx
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   └── ... (30+ UI components)
│   │   └── NavLink.tsx         # Navigation link component
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context & state
│   ├── hooks/
│   │   ├── use-mobile.tsx      # Mobile detection hook
│   │   └── use-toast.ts        # Toast notification hook
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── pages/
│   │   ├── AcademicTrips.tsx   # Academic trips management
│   │   ├── CourseRequests.tsx  # Course request management
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── Equipment.tsx       # Equipment management
│   │   ├── Index.tsx           # Landing page
│   │   ├── LiveMap.tsx         # Real-time trip tracking
│   │   ├── Login.tsx           # Login page
│   │   ├── MakeupClasses.tsx   # Makeup classes management
│   │   ├── NotFound.tsx        # 404 page
│   │   ├── Timetable.tsx       # Class schedule
│   │   └── Venues.tsx          # Venue management
│   ├── services/
│   │   └── api.ts              # API client & services
│   ├── test/
│   │   ├── example.test.ts     # Example test
│   │   └── setup.ts            # Test setup
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── App.css                 # Global styles
│   ├── App.tsx                 # Root component
│   ├── index.css               # Base styles
│   ├── main.tsx                # Application entry point
│   └── vite-env.d.ts           # Vite type definitions
├── components.json             # shadcn/ui configuration
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML entry point
├── package.json                # Project dependencies
├── playwright.config.ts        # E2E test configuration
├── playwright-fixture.ts       # E2E test fixtures
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── vitest.config.ts            # Vitest configuration
└── README.md                    # This file
```

## Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing & Linting

```bash
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Check code quality
```

### Build Variants

```bash
npm run build:dev    # Build with development optimizations
```

## Environment Configuration

Create a `.env` file in the root directory:

```env
# Backend API
VITE_API_BASE_URL=http://localhost:8080/api

# Feature Flags
VITE_ENABLE_LIVE_MAP=true
VITE_ENABLE_NOTIFICATIONS=true

# WebSocket
VITE_WS_URL=ws://localhost:8080/api/ws
```

Environment variables must be prefixed with `VITE_` to be accessible in the browser.

## API Integration

The frontend connects to the Uniflow Backend API:

- **Base URL**: `http://localhost:8080/api`
- **Auth**: JWT tokens stored in localStorage
- **Real-time**: WebSocket connections for notifications and live tracking

Key API services in `src/services/api.ts`:

- Authentication
- Dashboard data
- Course management
- Venue operations
- Equipment requests
- Academic trips
- Timetable
- Notifications

## Authentication Flow

1. User logs in via the `Login.tsx` page
2. Credentials sent to backend `/api/auth/login`
3. JWT token received and stored in localStorage
4. `AuthContext` manages user state globally
5. Protected routes check authentication status
6. Token automatically included in API requests

## Component System

### shadcn/ui Components Available

- Buttons, Cards, Forms
- Dialogs, Modals, Drawers
- Tables, Dropdowns, Menus
- Input fields, Checkboxes, Radio buttons
- Tabs, Accordions, Breadcrumbs
- Alerts, Badges, Progress bars
- And 30+ more...

### Adding New shadcn/ui Components

```bash
npx shadcn-ui@latest add <component-name>
```

Example:

```bash
npx shadcn-ui@latest add button
```

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **Dark Mode**: Automatic dark mode support via Tailwind

Override Tailwind config in `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Custom colors
      }
    }
  }
}
```

## Testing

### Unit Tests (Vitest)

```bash
npm run test         # Run all tests once
npm run test:watch   # Run tests in watch mode
```

### E2E Tests (Playwright)

```bash
# Install dependencies
npx playwright install

# Run E2E tests
npx playwright test
```

Test files: `src/test/`

Example test:

```typescript
import { describe, it, expect } from 'vitest';

describe('Component', () => {
  it('should render', () => {
    expect(true).toBe(true);
  });
});
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+
- Mobile browsers (iOS Safari, Android Chrome)

## Performance Optimization

- ✅ Code splitting with Vite
- ✅ Lazy loading with React.lazy
- ✅ Component memoization
- ✅ Optimized bundle size
- ✅ Caching with TanStack Query

## Troubleshooting

### Port Already in Use

```bash
# Change port in vite.config.ts
export default defineConfig({
  server: {
    port: 5174
  }
})
```

### API Connection Issues

1. Ensure backend is running on `http://localhost:8080`
2. Check `VITE_API_BASE_URL` in `.env`
3. Verify CORS configuration on backend
4. Check browser console for errors

### Dependencies Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules
bun install
```

### Build Errors

```bash
# Clear Vite cache
rm -rf dist
npm run build
```

## Mobile Development

The app is mobile-first responsive:

```bash
# Test on different screen sizes
npm run dev  # Use browser DevTools to test
```

Use the `use-mobile` hook to detect mobile devices:

```typescript
import { useIsMobile } from '@/hooks/use-mobile';

function Component() {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

## Accessibility

All components follow WCAG 2.1 guidelines:

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA labels and roles
- ✅ Color contrast compliance
- ✅ Focus management

## Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make your changes
3. Run linting: `npm run lint`
4. Run tests: `npm run test`
5. Commit: `git commit -m 'Add feature'`
6. Push: `git push origin feature/feature-name`
7. Create a Pull Request

## Documentation

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Query](https://tanstack.com/query/latest)

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Common Platforms

**Vercel** (Recommended):

```bash
npm i -g vercel
vercel
```

**Netlify**:

```bash
npm run build
# Drag & drop dist folder to Netlify
```

**Docker**:

```dockerfile
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues, questions, or contributions, please contact the development team or open an issue in the repository.

---

**Last Updated**: April 2026
