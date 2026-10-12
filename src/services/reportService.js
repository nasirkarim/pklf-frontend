import { request } from './api';

export const reportService = {
  /**
   * Submit a new Lost Item report
   * POST /api/reports/lost
   * Accepts FormData (with photo files) or regular object
   */
  async createLostReport(data) {
    let body;
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      body = data;
    } else {
      // Build FormData if photos contain File objects, otherwise send JSON
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === 'photos' && Array.isArray(data.photos)) {
          data.photos.forEach((photo) => {
            if (photo instanceof File) {
              formData.append('photos', photo);
            } else if (typeof photo === 'string') {
              formData.append('photos', photo);
            }
          });
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      body = formData;
    }

    return request('/reports/lost', {
      method: 'POST',
      body,
    });
  },

  /**
   * Submit a new Found Item report
   * POST /api/reports/found
   * Accepts FormData (with photo files) or regular object
   */
  async createFoundReport(data) {
    let body;
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      body = data;
    } else {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === 'photos' && Array.isArray(data.photos)) {
          data.photos.forEach((photo) => {
            if (photo instanceof File) {
              formData.append('photos', photo);
            } else if (typeof photo === 'string') {
              formData.append('photos', photo);
            }
          });
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      body = formData;
    }

    return request('/reports/found', {
      method: 'POST',
      body,
    });
  },

  /**
   * Get reports filed by the authenticated user
   * GET /api/reports/my
   */
  async getMyReports(type) {
    const query = type ? `?type=${encodeURIComponent(type)}` : '';
    return request(`/reports/my${query}`, {
      method: 'GET',
    });
  },

  /**
   * Get report details by ID
   * GET /api/reports/:id
   */
  async getReportById(id) {
    return request(`/reports/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Search and filter reports with pagination and sorting
   * GET /api/reports/search
   */
  async searchReports(params = {}) {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((k) => {
      if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
        searchParams.set(k, params[k]);
      }
    });
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request(`/reports/search${qs}`, {
      method: 'GET',
    });
  },

  /**
   * Get smart matches for a report
   * GET /api/reports/:id/matches
   */
  async getReportMatches(id, params = {}) {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set('limit', params.limit);
    if (params.threshold) searchParams.set('threshold', params.threshold);
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request(`/reports/${id}/matches${qs}`, {
      method: 'GET',
    });
  },

  /**
   * Get all public reports
   * GET /api/reports
   */
  async getAllReports(params = {}) {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((k) => {
      if (params[k]) searchParams.set(k, params[k]);
    });
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request(`/reports${qs}`, {
      method: 'GET',
    });
  },
};

export default reportService;
