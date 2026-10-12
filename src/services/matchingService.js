import { request } from './api';

export const matchingService = {
  /**
   * Fetch smart matching suggestions for a specific report
   * GET /api/reports/:reportId/matches
   */
  async getReportMatches(reportId, params = {}) {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set('limit', params.limit);
    if (params.threshold) searchParams.set('threshold', params.threshold);

    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request(`/reports/${reportId}/matches${qs}`, {
      method: 'GET',
    });
  },
};

export default matchingService;
