# Overview

This is a full-stack financial management application built for restaurant business operations, featuring a React frontend with TypeScript and an Express.js backend. The application provides comprehensive financial tracking including sales, expenses, assets, capital, and liabilities management with a modern UI built using shadcn/ui components and Tailwind CSS.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation through @hookform/resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas shared between client and server
- **Development**: Hot module replacement via Vite middleware integration

## Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Schema Management**: Centralized schema definitions in `/shared/schema.ts`
- **Migrations**: Drizzle Kit for database migrations
- **Fallback**: In-memory storage implementation for development/testing

## Database Schema
The application manages five core financial entities:
- **Sales**: Menu items, quantities, prices, and transaction timestamps
- **Expenses**: Categorized business expenses with payment methods
- **Assets**: Business assets with acquisition dates and valuations
- **Capital**: Capital investments and funding sources
- **Liabilities**: Debts and obligations with due dates and payment status

## API Design
- **Architecture**: RESTful API with Express.js
- **Endpoints**: CRUD operations for each financial entity
- **Data Flow**: JSON request/response with Zod validation
- **Error Handling**: Centralized error middleware with status codes
- **Logging**: Request/response logging with duration tracking

## Development Workflow
- **Build Process**: Vite for frontend, esbuild for backend bundling
- **Development Server**: Integrated Vite dev server with HMR
- **Type Safety**: Shared TypeScript interfaces and Zod schemas
- **Code Organization**: Monorepo structure with shared utilities

# External Dependencies

## Database
- **Neon Database**: PostgreSQL-compatible serverless database
- **Connection**: Environment variable `DATABASE_URL` required

## UI Framework
- **Radix UI**: Headless UI components for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library

## Development Tools
- **Vite**: Frontend build tool and dev server
- **esbuild**: Fast JavaScript bundler for production
- **Drizzle Kit**: Database migration and introspection tool

## Runtime Dependencies
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Wouter**: Lightweight client-side routing
- **date-fns**: Date manipulation and formatting utilities