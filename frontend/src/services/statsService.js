import api from './api'

/**
 * Organizer stats service.
 * Endpoint: GET /api/organizer/stats/overview?from=&to=
 *
 * Response shape (StatsOverviewDto):
 *   { registrations, paid, canceled, revenue, byEvent: EventStatsDto[] }
 *
 * EventStatsDto:
 *   { eventId, title, registrations, paid, canceled, revenue }
 */
const statsService = {
    /**
     * Get organizer stats overview with optional date range.
     * @param {{ from?: string, to?: string }} params  ISO-8601 datetime strings
     * @returns {Promise<{
     *   registrations: number,
     *   paid: number,
     *   canceled: number,
     *   revenue: number,
     *   byEvent: Array<{ eventId: number, title: string, registrations: number, paid: number, canceled: number, revenue: number }>
     * }>}
     */
    getOverview: async ({ from, to } = {}) => {
        const params = {}
        if (from) params.from = from
        if (to) params.to = to
        const response = await api.get('/organizer/stats/overview', { params })
        return response.data
    },
}

export default statsService
