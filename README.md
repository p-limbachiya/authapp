# Auth App

A modern authentication application built with React, TypeScript, and Chakra UI, featuring role-based access control and protected routes.

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
- **Routing** - React Router DOM for seamless navigation

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **UI Library**: Chakra UI 2.10.1
- **State Management**: Redux Toolkit 2.11.2
- **Routing**: React Router DOM 7.13.0
- **Form Management**: React Hook Form 7.71.1
- **Animations**: Framer Motion 7.10.0
- **Styling**: Emotion (React & Styled)

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn package manager

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/p-limbachiya/authapp.git
cd authapp
```

2. Install dependencies:
```bash
npm install
```

## 🚦 Running the Application

### Development Mode
```bash
npm run dev
```
The application will start at `http://localhost:5173` (default Vite port)

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
authapp/
├── src/
│   ├── api/           # API integration and services
│   ├── layouts/       # Layout components
│   ├── pages/         # Application pages
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AdminPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── NotAuthorizedPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── redux/         # Redux store and slices
│   ├── routes/        # Route configuration
│   ├── main.tsx       # Application entry point
│   └── style.css      # Global styles
├── public/            # Static assets
├── dist/              # Production build output
├── index.html         # HTML template
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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**p-limbachiya**

- GitHub: [@p-limbachiya](https://github.com/p-limbachiya)
- Repository: [authapp](https://github.com/p-limbachiya/authapp)

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [Chakra UI](https://chakra-ui.com/)
- State management with [Redux Toolkit](https://redux-toolkit.js.org/)
