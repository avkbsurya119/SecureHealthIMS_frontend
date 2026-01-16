/**
 * Visits Service (EPIC 3.1, 3.2, 3.6)
 * API calls for clinical visit management
 */

import { apiRequest } from './api.js';

export const visitsService = {
  /**
   * Create a new visit (3.1)
   */
  createVisit: async (visitData) => {
    return apiRequest('/api/visits', {
      method: 'POST',
      body: JSON.stringify(visitData),
    });
  },

  /**
   * Get patient's visit history (3.2)
   */
  getPatientVisits: async (patientId) => {
    return apiRequest(`/api/visits/patient/${patientId}`);
  },

  /**
   * Get specific visit (3.2)
   */
  getVisitById: async (visitId) => {
    return apiRequest(`/api/visits/${visitId}`);
  },

  /**
   * Get doctor's visits (3.6)
   */
  getDoctorVisits: async (doctorId) => {
    return apiRequest(`/api/visits/doctor/${doctorId}`);
  },

  /**
   * Update visit record (3.6)
   */
  updateVisit: async (visitId, updateData) => {
    return apiRequest(`/api/visits/${visitId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  /**
   * Delete visit (3.6)
   */
  deleteVisit: async (visitId) => {
    return apiRequest(`/api/visits/${visitId}`, {
      method: 'DELETE',
    });
  },
};
