import { request } from './api';

export const missingPersonService = {
  /**
   * Fetch public list of missing person cases (Search & Filter API)
   * GET /api/missing-persons
   */
  async getMissingPersons(params = {}) {
    const searchParams = new URLSearchParams();

    if (params.city && params.city !== 'All Cities' && params.city !== 'all') {
      searchParams.set('city', params.city);
    }
    if (params.area && params.area.trim()) {
      searchParams.set('area', params.area.trim());
    }
    if (params.gender && params.gender !== 'all') {
      searchParams.set('gender', params.gender);
    }
    if (params.status && params.status !== 'all') {
      searchParams.set('status', params.status);
    }
    if (params.q && params.q.trim()) {
      searchParams.set('q', params.q.trim());
    }
    if (params.search && params.search.trim()) {
      searchParams.set('search', params.search.trim());
    }
    if (params.minAge !== undefined && params.minAge !== '') {
      searchParams.set('minAge', params.minAge);
    }
    if (params.maxAge !== undefined && params.maxAge !== '') {
      searchParams.set('maxAge', params.maxAge);
    }
    if (params.fromDate) {
      searchParams.set('fromDate', params.fromDate);
    }
    if (params.toDate) {
      searchParams.set('toDate', params.toDate);
    }
    if (params.sort) {
      searchParams.set('sort', params.sort);
    }
    if (params.page) {
      searchParams.set('page', params.page);
    }
    if (params.limit) {
      searchParams.set('limit', params.limit);
    }

    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request(`/missing-persons${qs}`, {
      method: 'GET',
    });
  },

  /**
   * Fetch single missing person case details
   * GET /api/missing-persons/:id
   */
  async getMissingPersonById(id) {
    return request(`/missing-persons/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Fetch summary statistics for the Find & Reunite module
   * GET /api/missing-persons/stats
   */
  async getStats() {
    return request('/missing-persons/stats', {
      method: 'GET',
    });
  },

  /**
   * Submit a new Missing Person report
   * POST /api/missing-persons
   * Accepts FormData (with photo files) or regular object
   */
  async createMissingPerson(data) {
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
        } else if (key === 'photo' && data.photo instanceof File) {
          formData.append('photo', data.photo);
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      body = formData;
    }

    return request('/missing-persons', {
      method: 'POST',
      body,
    });
  },

  /**
   * Fetch possible matches and sighting leads for a missing person case
   * GET /api/missing-persons/:id/matches
   */
  async getPersonMatches(personId) {
    return request(`/missing-persons/${personId}/matches`, {
      method: 'GET',
    });
  },

  /**
   * Submit a possible match or sighting lead for a missing person case
   * POST /api/missing-persons/:id/matches
   */
  async createPersonMatch(personId, data) {
    return request(`/missing-persons/${personId}/matches`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Fetch deterministic candidate suggestions for possible matches
   * GET /api/missing-persons/:id/candidates
   */
  async getCandidateMatches(personId) {
    return request(`/missing-persons/${personId}/candidates`, {
      method: 'GET',
    });
  },

  /**
   * Controlled status transition (ACTIVE -> LOCATED -> CLOSED)
   * PATCH /api/missing-persons/:id/status
   */
  async updatePersonStatus(personId, data) {
    return request(`/missing-persons/${personId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Review a possible match lead (CONFIRMED or DISMISSED)
   * PATCH /api/missing-persons/matches/:matchId
   */
  async reviewMatch(matchId, data) {
    return request(`/missing-persons/matches/${matchId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get missing person reports created by the current authenticated citizen
   * GET /api/missing-persons/user/my
   */
  async getMyMissingPersons() {
    return request('/missing-persons/user/my', {
      method: 'GET',
    });
  },
};

export default missingPersonService;


