# Overview

This is a full-stack web application built with React and Express, featuring a restaurant management dashboard called "Chaniago Dashboard" specifically designed for Padang restaurant operations. The application provides comprehensive business analytics, transaction tracking, menu performance monitoring, and financial management capabilities tailored for Indonesian restaurant businesses.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Charts**: Recharts for data visualization and analytics dashboards
- **Responsive Design**: Mobile-first approach with custom mobile detection hook

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API structure with `/api` prefix for all endpoints
- **Development Setup**: Hot reload with tsx in development, esbuild for production builds
- **Request Handling**: Express middleware for JSON parsing, URL encoding, and request logging
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

## Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database serverless)
- **Schema Management**: Centralized schema definitions in `shared/schema.ts`
- **Migrations**: Drizzle Kit for database schema migrations
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

## Authentication & Session Management
- **Session Storage**: PostgreSQL-based session storage using `connect-pg-simple`
- **User Schema**: Basic user model with username/password authentication
- **Validation**: Zod schemas for runtime type validation integrated with Drizzle

## Development & Build Process
- **TypeScript Configuration**: Strict mode enabled with ESNext modules
- **Path Aliases**: Configured for clean imports (`@/`, `@shared/`)
- **Build Pipeline**: Vite for frontend, esbuild for backend bundling
- **Development Tools**: Replit integration with cartographer plugin and runtime error overlay

## Styling & UI Framework
- **CSS Framework**: Tailwind CSS with custom design system
- **Design Tokens**: CSS variables for theming (light/dark mode support)
- **Component Library**: Comprehensive shadcn/ui component collection
- **Icons**: Lucide React icon library
- **Responsive Breakpoints**: Mobile-first with custom mobile detection

# External Dependencies

## Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **express**: Node.js web application framework
- **react & react-dom**: Core React library
- **typescript & tsx**: TypeScript runtime and compilation

## Database & ORM
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration tools
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **connect-pg-simple**: PostgreSQL session store for Express

## UI & Styling
- **@radix-ui/***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant creation
- **clsx & tailwind-merge**: Conditional class name utilities

## Charts & Data Visualization
- **recharts**: React charting library for dashboard analytics
- **date-fns**: Date manipulation utilities

## Form Handling & Validation
- **react-hook-form & @hookform/resolvers**: Form state management
- **zod & drizzle-zod**: Runtime type validation

## Development Tools
- **vite & @vitejs/plugin-react**: Frontend build tooling
- **esbuild**: Fast JavaScript/TypeScript bundler
- **@replit/vite-plugin-***: Replit-specific development plugins

## Routing & Navigation
- **wouter**: Minimalist React router
- **nanoid**: URL-safe unique ID generator