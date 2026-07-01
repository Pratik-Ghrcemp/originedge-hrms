# OriginEdge HRMS

OriginEdge HRMS is a modern Human Resource Management System built to manage employees, attendance, overtime, performance reviews, holidays, departments, payroll, and HR workflows from one centralized dashboard.

## Project Overview

This project is a React + Vite based HRMS dashboard. The current version includes working modules for Attendance Reports, Overtime Management, Performance Reviews, and Company Holidays, with reusable components, mock data, API service files, and export utilities ready for backend integration.

## Features

- Employee attendance report with filters, summary cards, table selection, pagination, and export support
- Overtime management with monthly OT summary, pending requests, approve/reject actions, and toast feedback
- Performance review dashboard with star ratings, performance badges, department breakdown, and filters
- Company holidays module with holiday summary cards, searchable table, mini calendar, and upcoming holiday list
- Reusable shared components for cards, badges, tables, filters, and pagination
- Axios API client with token handling and normalized error messages
- Responsive dashboard layout with sidebar navigation

## Tech Stack

- React
- Vite
- React Router DOM
- Axios
- XLSX
- date-fns
- Tailwind CSS / PostCSS
- ESLint

## Folder Structure

```text
my-app/
  public/
  src/
    components/
    hooks/
    mocks/
    pages/
    services/
    styles/
    utils/
  package.json
  vite.config.js
```

## Getting Started

```bash
cd my-app
npm install
npm run dev
```

After starting the development server, open the Vite local URL shown in the terminal.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Contributors

- [Pratik-Ghrcemp](https://github.com/Pratik-Ghrcemp)
- [Pratik Shelar](https://github.com/shelarpratik201-cyber)

## Description

A full-stack-ready HRMS dashboard designed to simplify employee management, attendance tracking, overtime workflows, performance reviews, holidays, payroll operations, and organizational HR processes.
