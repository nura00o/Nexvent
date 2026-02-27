import React, { useState, useEffect, useCallback } from 'react'
import adminService, { ROLES, ALL_ROLES, ROLE_LABELS } from '../services/adminService'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmModal from '../components/ConfirmModal'
import {
    Users, Shield, Lock, Unlock, UserCheck, UserX,
    Edit3, X, AlertCircle, Search, RefreshCw,
} from 'lucide-react'

/* ─────────────────── helpers ─────────────────── */

const hasRole = (user, role) => user.roles.includes(role)
const isAdminUser = (user) => hasRole(user, ROLES.ADMIN)
const isOrganizerUser = (user) => hasRole(user, ROLES.ORGANIZER)

/** Badge colour by role */
const roleBadgeClass = (role) => {
    switch (role) {
        case ROLES.ADMIN: return 'bg-red-100 text-red-800 border-red-200'
        case ROLES.ORGANIZER: return 'bg-purple-100 text-purple-800 border-purple-200'
        default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
}

/* ─────────────────── Roles Modal ─────────────────── */

const RolesModal = ({ open, user, onSave, onCancel, loading }) => {
    const [selected, setSelected] = useState([])

    useEffect(() => {
        if (user) setSelected([...user.roles])
    }, [user])

    if (!open || !user) return null

    const toggle = (role) => {
        setSelected((prev) =>
            prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
        )
    }

    const canSave = selected.length > 0

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
                <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="h-5 w-5" />
                </button>

                <h3 className="text-lg font-bold text-gray-900 mb-1">Edit Roles</h3>
                <p className="text-sm text-gray-500 mb-5">
                    {user.fullName} ({user.email})
                </p>

                <div className="space-y-2 mb-6">
                    {ALL_ROLES.map((role) => (
                        <label
                            key={role}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                ${selected.includes(role)
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(role)}
                                onChange={() => toggle(role)}
                                className="accent-primary-600 h-4 w-4"
                            />
                            <span className="font-medium text-gray-800">{ROLE_LABELS[role]}</span>
                            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${roleBadgeClass(role)}`}>
                                {role}
                            </span>
                        </label>
                    ))}
                </div>

                {!canSave && (
                    <p className="text-sm text-red-600 mb-3 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" /> At least one role is required
                    </p>
                )}

                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} disabled={loading} className="btn-secondary disabled:opacity-50">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(user.id, selected)}
                        disabled={!canSave || loading}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving…' : 'Save Roles'}
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ─────────────────── Main Page ─────────────────── */

const AdminUsers = () => {
    const { user: currentUser } = useAuth()

    // ── data ──
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')

    // ── action-in-flight ──
    const [busyIds, setBusyIds] = useState(new Set())

    // ── roles modal ──
    const [rolesModal, setRolesModal] = useState({ open: false, user: null })
    const [rolesSaving, setRolesSaving] = useState(false)

    // ── confirm modal (lock / unlock / revoke) ──
    const [confirm, setConfirm] = useState({ open: false, title: '', message: '', danger: false, action: null })
    const [confirmLoading, setConfirmLoading] = useState(false)

    /* ── load users ─────────────────────── */

    const loadUsers = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await adminService.getUsers()
            setUsers(data)
        } catch (err) {
            if (err?.response?.status === 403) {
                setError('Access denied. You do not have admin privileges.')
            } else {
                setError(err)
            }
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadUsers() }, [loadUsers])

    /* ── replace a single user row in state ─── */

    const patchUser = (updated) =>
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))

    const markBusy = (id) => setBusyIds((s) => new Set(s).add(id))
    const clearBusy = (id) => setBusyIds((s) => { const n = new Set(s); n.delete(id); return n })

    /* ── actions ────────────────────────── */

    const handleLock = (user) => {
        setConfirm({
            open: true,
            title: 'Lock User',
            message: `Are you sure you want to lock "${user.fullName}"? They will not be able to log in.`,
            danger: true,
            action: async () => {
                markBusy(user.id)
                try {
                    const updated = await adminService.lockUser(user.id)
                    patchUser(updated)
                } catch (err) {
                    setError(err?.response?.data?.message || 'Failed to lock user')
                } finally {
                    clearBusy(user.id)
                }
            },
        })
    }

    const handleUnlock = async (user) => {
        markBusy(user.id)
        try {
            const updated = await adminService.unlockUser(user.id)
            patchUser(updated)
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to unlock user')
        } finally {
            clearBusy(user.id)
        }
    }

    const handleGrantOrganizer = async (user) => {
        markBusy(user.id)
        try {
            const updated = await adminService.grantOrganizer(user.id)
            patchUser(updated)
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to grant organizer')
        } finally {
            clearBusy(user.id)
        }
    }

    const handleRevokeOrganizer = (user) => {
        setConfirm({
            open: true,
            title: 'Revoke Organizer',
            message: `Remove organizer role from "${user.fullName}"? They will lose access to organizer features.`,
            danger: true,
            action: async () => {
                markBusy(user.id)
                try {
                    const updated = await adminService.revokeOrganizer(user.id)
                    patchUser(updated)
                } catch (err) {
                    setError(err?.response?.data?.message || 'Failed to revoke organizer')
                } finally {
                    clearBusy(user.id)
                }
            },
        })
    }

    const handleSaveRoles = async (userId, roles) => {
        setRolesSaving(true)
        try {
            const updated = await adminService.setRoles(userId, roles)
            patchUser(updated)
            setRolesModal({ open: false, user: null })
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to update roles')
        } finally {
            setRolesSaving(false)
        }
    }

    const executeConfirm = async () => {
        setConfirmLoading(true)
        try {
            await confirm.action?.()
        } finally {
            setConfirmLoading(false)
            setConfirm({ open: false, title: '', message: '', danger: false, action: null })
        }
    }

    /* ── filtered list ──────────────────── */

    const filtered = users.filter((u) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return (
            u.email.toLowerCase().includes(q) ||
            u.fullName.toLowerCase().includes(q) ||
            String(u.id).includes(q)
        )
    })

    /* ── render ─────────────────────────── */

    if (loading) {
        return (
            <div className="py-12">
                <LoadingSpinner size="large" />
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-primary-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600">{users.length} users total</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-9 w-56"
                        />
                    </div>
                    <button onClick={loadUsers} className="btn-secondary flex items-center gap-1" title="Refresh">
                        <RefreshCw className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Error */}
            <ErrorMessage error={error} onClose={() => setError(null)} />

            {/* Empty state */}
            {!error && filtered.length === 0 && (
                <div className="card text-center py-12">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">
                        {search ? 'No users match your search' : 'No users found'}
                    </h3>
                    <p className="text-gray-500 text-sm">
                        {search ? 'Try a different search term.' : 'Users will appear here once they register.'}
                    </p>
                </div>
            )}

            {/* Table */}
            {filtered.length > 0 && (
                <div className="card overflow-x-auto p-0">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Roles</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((u) => {
                                const busy = busyIds.has(u.id)
                                const isSelf = u.email === currentUser?.email

                                return (
                                    <tr key={u.id} className={`transition ${u.locked ? 'bg-red-50/40' : 'hover:bg-gray-50'}`}>
                                        {/* ID */}
                                        <td className="px-4 py-3 text-sm text-gray-500 font-mono">{u.id}</td>

                                        {/* Email */}
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.email}</td>

                                        {/* Full Name */}
                                        <td className="px-4 py-3 text-sm text-gray-700">{u.fullName}</td>

                                        {/* Status badges */}
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {u.locked && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                                                        <Lock className="h-3 w-3" /> Locked
                                                    </span>
                                                )}
                                                {!u.enabled && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                        Disabled
                                                    </span>
                                                )}
                                                {u.enabled && !u.locked && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Roles */}
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {u.roles.map((role) => (
                                                    <span
                                                        key={role}
                                                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${roleBadgeClass(role)}`}
                                                    >
                                                        {ROLE_LABELS[role] || role}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1 flex-wrap">
                                                {/* Edit Roles */}
                                                <button
                                                    onClick={() => setRolesModal({ open: true, user: u })}
                                                    disabled={busy}
                                                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg
                                     text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200
                                     disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                    title="Edit roles"
                                                >
                                                    <Edit3 className="h-3.5 w-3.5" /> Roles
                                                </button>

                                                {/* Lock / Unlock */}
                                                {u.locked ? (
                                                    <button
                                                        onClick={() => handleUnlock(u)}
                                                        disabled={busy}
                                                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg
                                       text-green-700 bg-green-50 hover:bg-green-100 border border-green-200
                                       disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                        title="Unlock user"
                                                    >
                                                        <Unlock className="h-3.5 w-3.5" /> Unlock
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleLock(u)}
                                                        disabled={busy || isSelf}
                                                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg
                                       text-red-700 bg-red-50 hover:bg-red-100 border border-red-200
                                       disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                        title={isSelf ? 'Cannot lock yourself' : 'Lock user'}
                                                    >
                                                        <Lock className="h-3.5 w-3.5" /> Lock
                                                    </button>
                                                )}

                                                {/* Grant / Revoke Organizer — hidden for admins */}
                                                {!isAdminUser(u) && (
                                                    isOrganizerUser(u) ? (
                                                        <button
                                                            onClick={() => handleRevokeOrganizer(u)}
                                                            disabled={busy}
                                                            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg
                                         text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200
                                         disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                            title="Revoke organizer"
                                                        >
                                                            <UserX className="h-3.5 w-3.5" /> Revoke Org
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleGrantOrganizer(u)}
                                                            disabled={busy}
                                                            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg
                                         text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200
                                         disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                            title="Grant organizer"
                                                        >
                                                            <UserCheck className="h-3.5 w-3.5" /> Grant Org
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Roles Modal */}
            <RolesModal
                open={rolesModal.open}
                user={rolesModal.user}
                onSave={handleSaveRoles}
                onCancel={() => setRolesModal({ open: false, user: null })}
                loading={rolesSaving}
            />

            {/* Confirm Modal */}
            <ConfirmModal
                open={confirm.open}
                title={confirm.title}
                message={confirm.message}
                danger={confirm.danger}
                loading={confirmLoading}
                onConfirm={executeConfirm}
                onCancel={() => setConfirm({ open: false, title: '', message: '', danger: false, action: null })}
            />
        </div>
    )
}

export default AdminUsers
