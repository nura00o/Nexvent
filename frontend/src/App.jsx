import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import OrganizerRoute from './components/OrganizerRoute'
import Layout from './components/Layout'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'
import EventDetails from './pages/EventDetails'
import CreateEvent from './pages/CreateEvent'
import EditEvent from './pages/EditEvent'
import MyEvents from './pages/MyEvents'
import MyRegistrations from './pages/MyRegistrations'
import EventAnalytics from './pages/EventAnalytics'
import EventRegistrations from './pages/EventRegistrations'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import OrganizerStats from './pages/OrganizerStats'
import Profile from './pages/Profile'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes with Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events/:id" element={<EventDetails />} />

        {/* Authenticated User Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="profile" element={<Profile />} />
          <Route path="my-registrations" element={<MyRegistrations />} />
        </Route>

        {/* Organizer Only Routes */}
        <Route element={<OrganizerRoute />}>
          <Route path="my-events" element={<MyEvents />} />
          <Route path="events/create" element={<CreateEvent />} />
          <Route path="events/edit/:id" element={<EditEvent />} />
          <Route path="events/:id/analytics" element={<EventAnalytics />} />
          <Route path="events/:id/registrations" element={<EventRegistrations />} />
          <Route path="organizer/stats" element={<OrganizerStats />} />
        </Route>

        {/* Admin Only Routes */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/users" element={<AdminUsers />} />
        </Route>
      </Route>

      {/* 404 redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
