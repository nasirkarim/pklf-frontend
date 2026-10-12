import { request } from './api';

export const adminService = {
  /**
   * Get Admin dashboard statistics and recent activity
   * GET /api/admin/dashboard
   */
  async getDashboard() {
    return request('/admin/dashboard', {
      method: 'GET',
    });
  },

  /**
   * Get users list with optional search and filters
   * GET /api/admin/users
   */
  async getUsers(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.role) query.append('role', params.role);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    return request(`/admin/users${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  /**
   * Get user details with their reports and claims
   * GET /api/admin/users/:userId
   */
  async getUserDetails(userId) {
    return request(`/admin/users/${userId}`, {
      method: 'GET',
    });
  },

  /**
   * Activate or deactivate user account
   * PUT /api/admin/users/:userId/status
   */
  async updateUserStatus(userId, isActive) {
    return request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive }),
    });
  },

  /**
   * Get reports with filters and search
   * GET /api/admin/reports
   */
  async getReports(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.type) query.append('type', params.type);
    if (params.status) query.append('status', params.status);
    if (params.category) query.append('category', params.category);
    if (params.city) query.append('city', params.city);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    return request(`/admin/reports${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  /**
   * Get report details
   * GET /api/admin/reports/:reportId
   */
  async getReportDetails(reportId) {
    return request(`/admin/reports/${reportId}`, {
      method: 'GET',
    });
  },

  /**
   * Update report status (ACTIVE, MATCHED, RECOVERED, CLOSED)
   * PUT /api/admin/reports/:reportId/status
   */
  async updateReportStatus(reportId, status) {
    return request(`/admin/reports/${reportId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Delete report and its claims
   * DELETE /api/admin/reports/:reportId
   */
  async deleteReport(reportId) {
    return request(`/admin/reports/${reportId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get claims for moderation
   * GET /api/admin/claims
   */
  async getClaims(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.q) query.append('q', params.q);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    return request(`/admin/claims${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  /**
   * Approve a claim as Admin
   * PUT /api/admin/claims/:claimId/approve
   */
  async approveClaim(claimId) {
    return request(`/admin/claims/${claimId}/approve`, {
      method: 'PUT',
    });
  },

  /**
   * Reject a claim as Admin
   * PUT /api/admin/claims/:claimId/reject
   */
  async rejectClaim(claimId, rejectionReason) {
    return request(`/admin/claims/${claimId}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rejectionReason }),
    });
  },

  /**
   * Complete recovery as Admin
   * PUT /api/admin/claims/:claimId/recover
   */
  async recoverClaim(claimId) {
    return request(`/admin/claims/${claimId}/recover`, {
      method: 'PUT',
    });
  },
};

export default adminService;
