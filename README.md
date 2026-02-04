# Auth App (Next.js)

A modern authentication application built with Next.js (App Router), TypeScript, Chakra UI, and Redux Toolkit, featuring role-based access control and protected routes.

## 🚀 Features

- **User Authentication** - Secure login system with form validation
- **Role-Based Access Control (RBAC)** - Different access levels for Admin and User roles
- **Protected Routes** - Route guards to prevent unauthorized access
- **Dashboard** - User-specific dashboard with personalized content
- **Admin Panel** - Administrative interface for managing users and viewing reports
- **Reports Page** - Data visualization and reporting functionality
- **State Management** - Redux Toolkit for efficient state management
- **Modern UI** - Beautiful and responsive interface using Chakra UI
- **Form Handling** - React Hook Form for efficient form management
- **Routing** - Next.js App Router

## 🛠️ Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript 5.9.3
- **UI Library**: Chakra UI 2.10.1
- **State Management**: Redux Toolkit 2.11.2
- **Form Management**: React Hook Form 7.71.1
- **Animations**: Framer Motion 7.10.0
- **Styling**: Emotion (React & Styled)

## 📁 Project Structure

```
authapp/
├── app/               # Next.js App Router routes
├── src/
│   ├── api/           # API integration and services
│   ├── components/    # Shared UI + route guards/layout
│   ├── pages/         # Page content components (used by app routes)
│   └── redux/         # Redux store and slices
├── public/            # Static assets
├── package.json       # Project dependencies
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
```

## 🔐 User Roles

The application supports two user roles:

1. **Admin** - Full access to all features including:
   - Dashboard
   - Admin panel
   - Reports
   - User management

2. **User** - Limited access to:
   - Dashboard
   - Personal profile
   - Basic features

## 🎯 Available Pages

- `/` - Login page
- `/dashboard` - User dashboard (protected)
- `/admin` - Admin panel (admin only)
- `/reports` - Reports page (protected)
- `/not-authorized` - Unauthorized access page
- `*` - 404 Not Found page
