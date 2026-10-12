import { request } from './api';

export const claimService = {
  /**
   * Submit an ownership claim request
   * POST /api/claims
   * Accepts FormData (with proof files) or regular object
   */
  async createClaim(data) {
    let body;
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      body = data;
    } else {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === 'proofFiles' && Array.isArray(data.proofFiles)) {
          data.proofFiles.forEach((file) => {
            if (file instanceof File) {
              formData.append('proofFiles', file);
            } else if (typeof file === 'string') {
              formData.append('proofFiles', file);
            }
          });
        } else if (key === 'securityAnswers' && (Array.isArray(data.securityAnswers) || typeof data.securityAnswers === 'object')) {
          formData.append('securityAnswers', JSON.stringify(data.securityAnswers));
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      body = formData;
    }

    return request('/claims', {
      method: 'POST',
      body,
    });
  },

  /**
   * Get claims submitted by the current authenticated user
   * GET /api/claims/my
   */
  async getMyClaims() {
    return request('/claims/my', {
      method: 'GET',
    });
  },

  /**
   * Get claims received on items reported as FOUND by the current user
   * GET /api/claims/my-found-items
   */
  async getMyFoundItemsClaims() {
    return request('/claims/my-found-items', {
      method: 'GET',
    });
  },

  /**
   * Get detailed claim information by claim ID
   * GET /api/claims/:claimId
   */
  async getClaimById(claimId) {
    return request(`/claims/${claimId}`, {
      method: 'GET',
    });
  },

  /**
   * Finder or Admin approves an ownership claim
   * PUT /api/claims/:claimId/approve
   */
  async approveClaim(claimId) {
    return request(`/claims/${claimId}/approve`, {
      method: 'PUT',
    });
  },

  /**
   * Finder or Admin rejects an ownership claim
   * PUT /api/claims/:claimId/reject
   */
  async rejectClaim(claimId, rejectionReason) {
    return request(`/claims/${claimId}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rejectionReason }),
    });
  },

  /**
   * Complete item recovery / handover
   * PUT /api/claims/:claimId/recover
   */
  async recoverClaim(claimId) {
    return request(`/claims/${claimId}/recover`, {
      method: 'PUT',
    });
  },

  /**
   * Cancel own pending claim
   * PATCH /api/claims/:claimId/cancel
   */
  async cancelClaim(claimId) {
    return request(`/claims/${claimId}/cancel`, {
      method: 'PATCH',
    });
  },
};

export default claimService;
