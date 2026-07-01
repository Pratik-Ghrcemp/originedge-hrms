# OriginEdge HRMS

OriginEdge HRMS is a React + Vite based employee management dashboard for HR and employee self-service workflows. The current app focuses on Attendance Reports, Overtime Management, Performance Reviews, and Company Holidays with reusable table, filter, card, badge, pagination, service, and export utilities.

## Features

- Employee portal layout with sidebar navigation and header
- Attendance report with summary cards, filters, selectable rows, pagination, and export action
- OT management with monthly OT summary, pending request alerts, approve/reject actions, and toast feedback
- Performance review dashboard with star ratings, performance badges, department breakdown, and review filters
- Company holidays module with holiday summary cards, searchable holiday table, mini calendar, and upcoming holiday list
- Shared UI components for tables, filters, cards, badges, and pagination
- Mock data driven pages with service files ready for backend API integration
- Axios API client with token attachment and normalized error handling
- Excel/CSV export utility using `xlsx`
- Responsive page layouts with light/dark mode styling support

## Tech Stack

- React 19
- Vite 8
- React Router DOM 7
- Axios
- XLSX
- date-fns
- Tailwind CSS/PostCSS setup
- ESLint
- Tabler icon class names in UI markup

## Project Structure

```text
my-app/
  public/
    favicon.svg
    icons.svg
  src/
    components/
      layout/
        MainLayout.jsx
      shared/
        Badge.jsx
        Card.jsx
        Filters.jsx
        Pagination.jsx
        Table.jsx
    hooks/
    mocks/
    pages/
      Attendance/
        AttendanceReport.jsx
      Holidays/
        CompanyHolidays.jsx
      OT/
        OTManagement.jsx
      Performance/
        PerformanceReview.jsx
    services/
      apiClient.js
      attendanceService.js
      holidayService.js
      otService.js
      performanceService.js
    styles/
      globals.css
    utils/
      constants.js
      dateUtils.js
      exportUtils.js
    App.jsx
    main.jsx
  package.json
  vite.config.js
```

## Routes

| Route | Page |
| --- | --- |
| `/` | Redirects to `/attendance` |
| `/attendance` | Attendance Report |
| `/ot` | OT Management |
| `/performance` | Performance Review |
| `/holidays` | Company Holidays |

Note: The sidebar also contains placeholder navigation items for future HRMS modules such as Leave Management, WFH Management, Applications, Interviews, Profile, Documents, and Policies.

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Installation

```bash
cd my-app
npm install
```

### Run Development Server

```bash
npm run dev
```

After starting the server, open the local Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Lint

```bash
npm run lint
```

## Environment Variables

The API client reads `VITE_API_URL` from an `.env` file.

```env
VITE_API_URL=http://localhost:5000/api
```

If this variable is not provided, the app falls back to:

```text
http://localhost:5000/api
```

## API Integration Notes

The pages currently use local mock data for UI development. Backend-ready service files are available in `src/services/` and can replace mock data when APIs are connected.

The central Axios client is in:

```text
src/services/apiClient.js
```

It handles:

- Base API URL configuration
- JSON headers
- Bearer token attachment from `localStorage` key `oe_token`
- Common error messages for 401, 403, 404, and server errors

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Current Modules

### Attendance Report

- Total, present, absent, on leave, late, and early exit summaries
- Department, designation, location, date range, and employee search filters
- Paginated and selectable employee attendance table
- Export report button prepared for Excel export integration

### OT Management

- Monthly total OT, pending, approved, and rejected summaries
- Department/date/employee filters
- Approve and reject actions for pending OT requests
- Status badges and action feedback toast

### Performance Review

- Average rating, total reviews, reviewed departments, and top performer summaries
- Star rating visualization with color-coded performance levels
- Department, rating, performance status, and review date filters
- Department performance breakdown chart

### Company Holidays

- Total, upcoming, restricted, and optional holiday summaries
- Holiday type, date range, and holiday name filters
- Holiday list table with holiday type badges
- Mini calendar with holiday markers and upcoming holiday cards

## Development Notes

- Keep reusable UI logic inside `src/components/shared/`.
- Keep API calls inside `src/services/`.
- Keep export-related logic inside `src/utils/exportUtils.js`.
- Replace page-level mock arrays with service calls when the backend is ready.
- The root route redirects to Attendance because it is the first implemented working module.

## Contributors

- [Pratik-Ghrcemp](https://github.com/Pratik-Ghrcemp)
- [Pratik Shelar](https://github.com/shelarpratik201-cyber)
