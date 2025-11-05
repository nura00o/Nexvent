# Nexvent Frontend

A modern, production-ready React frontend for the Nexvent event management platform.

## 🚀 Features

### Authentication & Authorization
- ✅ User registration with validation
- ✅ Login with JWT authentication
- ✅ Password reset flow (forgot password + reset with token)
- ✅ Role-based access control (User, Admin)
- ✅ Protected routes and admin-only pages

### Event Management
- ✅ Browse all events with pagination
- ✅ Advanced filtering (category, date range)
- ✅ Event details page with full information
- ✅ Create new events (authenticated users)
- ✅ Edit existing events (event organizers only)
- ✅ Delete events (event organizers only)
- ✅ Responsive event cards with cover images

### User Features
- ✅ User profile page
- ✅ My Events dashboard
- ✅ Responsive navigation with mobile menu

### Admin Dashboard
- ✅ System statistics overview
- ✅ Category management (create categories)
- ✅ User management APIs (lock/unlock users)

### UI/UX
- ✅ Modern, responsive design with TailwindCSS
- ✅ Beautiful gradients and animations
- ✅ Loading states and error handling
- ✅ Mobile-friendly navigation
- ✅ Lucide React icons

## 📦 Tech Stack

- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **date-fns** - Date formatting

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable components
│   │   ├── Layout.jsx      # Main layout with navbar
│   │   ├── PrivateRoute.jsx
│   │   ├── AdminRoute.jsx
│   │   ├── EventCard.jsx
│   │   └── LoadingSpinner.jsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.jsx # Authentication state
│   ├── pages/              # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Home.jsx
│   │   ├── EventDetails.jsx
│   │   ├── CreateEvent.jsx
│   │   ├── EditEvent.jsx
│   │   ├── MyEvents.jsx
│   │   ├── Profile.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/           # API services
│   │   ├── api.js          # Axios instance with interceptors
│   │   ├── authService.js  # Authentication APIs
│   │   ├── eventService.js # Event management APIs
│   │   └── adminService.js # Admin APIs
│   ├── App.jsx             # Root component with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🔌 Backend API Coverage

### Authentication (`/api/auth`)
- ✅ POST `/register` - User registration
- ✅ POST `/login` - User login
- ✅ POST `/forgot-password` - Initiate password reset
- ✅ POST `/reset-password` - Reset password with token

### Events (`/api/events`)
- ✅ GET `/events` - List events with filters (category, dateFrom, dateTo, pagination)
- ✅ GET `/events/:id` - Get single event details

### Organizer (`/api/organizer`)
- ✅ POST `/events` - Create new event
- ✅ PUT `/events/:id` - Update event
- ✅ DELETE `/events/:id` - Delete event

### Admin (`/api/admin`)
- ✅ GET `/stats/overview` - Get system statistics
- ✅ POST `/categories` - Create new category
- ✅ PATCH `/users/:id/lock` - Lock user account
- ✅ PATCH `/users/:id/unlock` - Unlock user account

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Backend server running on `http://localhost:8080`

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 🔒 Authentication Flow

1. **Registration**: User signs up with email, full name, and password
2. **Login**: User receives JWT token stored in localStorage
3. **Protected Routes**: Token is automatically sent with all API requests
4. **Auto-logout**: If token is invalid/expired, user is redirected to login
5. **Role-based Access**: Admin routes check for `ROLE_ADMIN` in token

## 🎨 Styling

The project uses TailwindCSS with custom utility classes:
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.btn-danger` - Danger/delete button style
- `.input-field` - Form input style
- `.card` - Card container style

## 📱 Responsive Design

All components are fully responsive:
- Mobile-first approach
- Hamburger menu for mobile navigation
- Grid layouts adjust to screen size
- Touch-friendly interactive elements

## 🔧 Configuration

### API Base URL
The API base URL is configured in `src/services/api.js`:
```javascript
baseURL: '/api'  // Proxied to http://localhost:8080 by Vite
```

### Vite Proxy
The Vite config proxies `/api` requests to the backend:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  }
}
```

## 🐛 Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure:
1. Backend `CorsConfig.java` allows `http://localhost:3000`
2. Vite proxy is properly configured
3. Backend is running on port 8080

### JWT Token Issues
- Token is stored in `localStorage` as `token`
- Check browser DevTools > Application > Local Storage
- Token expires after 7 days (configured in backend)

### Build Warnings
TailwindCSS `@tailwind` and `@apply` warnings in IDE are expected and won't affect the build.

## 📝 Notes

- Event registration functionality is prepared but not fully implemented (waiting for backend endpoint)
- User ID is not directly available in JWT payload, so some features use email-based filtering
- Consider adding user list endpoint to backend for better "My Events" filtering

## 🚦 Next Steps

1. Add event registration/booking functionality
2. Implement user list management UI in admin dashboard
3. Add image upload for event covers
4. Add search functionality
5. Add event categories dropdown
6. Add email notifications for password reset
7. Add social login (OAuth2)

## 📄 License

This project is part of the Nexvent platform.
