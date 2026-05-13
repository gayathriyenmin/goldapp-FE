# GoldSave Admin Panel (POC)

A modern, scalable React + TypeScript + Tailwind CSS Admin Panel for a Gold Saving Application.

## Tech Stack
- **React 18** (Vite)
- **TypeScript**
- **Tailwind CSS** (Premium Gold Theme)
- **React Router DOM** (Navigation)
- **Zustand** (State Management)
- **React Hook Form + Zod** (Forms & Validation)
- **TanStack Table** (Data Grids)
- **Recharts** (Analytics & Charts)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **Axios** (API Client)

## Project Structure
The project follows an enterprise-level scalable folder structure:
- `src/components`: Reusable UI components (Common, Layout, Cards, Tables, etc.)
- `src/screen`: Module-based screens (Dashboard, Customers, Schemes, etc.)
- `src/store`: Zustand store slices and services
- `src/hooks`: Custom React hooks (auth, debounce, etc.)
- `src/helpers`: Utility helpers (formatting, validation, etc.)
- `src/interfaces`: TypeScript interfaces and types
- `src/constants`: Application-wide constants and route definitions
- `src/utils`: Utility functions and API client setup

## Key Features
1. **Authentication**: Admin login with protected route logic.
2. **Dashboard**: Financial overview with real-time stats and analytics charts.
3. **Customer Management**: Full list with search, filter, and pagination.
4. **Scheme Management**: Manage gold saving plans with active/inactive status.
5. **Payment Tracking**: Monitor successful, failed, and pending transactions.
6. **Due Tracking**: Identify overdue customers and trigger reminders.
7. **Marketing**: Manage app banners and promotional offers.

## Getting Started
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## Design System
- **Primary Gold**: #D4AF37
- **Background**: #0F172A (Deep Slate)
- **Typography**: Inter
- **Aesthetics**: Glassmorphism, smooth animations, and premium dark UI.

---
*Developed for Gold Saving Application POC.*
