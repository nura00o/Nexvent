import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Route guard that allows access only to users with ROLE_ORGANIZER (or ROLE_ADMIN).
 * Redirects unauthenticated users to /login, unauthorized ones to /.
 */
const OrganizerRoute = () => {
    const { isAuthenticated, isOrganizer, isAdmin, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />
    }

    // Admins can also access organizer pages
    return isOrganizer() || isAdmin() ? <Outlet /> : <Navigate to="/" replace />
}

export default OrganizerRoute
