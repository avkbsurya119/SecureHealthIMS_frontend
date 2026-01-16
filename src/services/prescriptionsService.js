/**
 * Prescriptions Service (EPIC 3.3, 3.4)
 * API calls for medication prescription management
 */

import { apiRequest } from './api.js';

export const prescriptionsService = {
  /**
   * Create a new prescription (3.3)
   */
  createPrescription: async (prescriptionData) => {
    return apiRequest('/api/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescriptionData),
    });
  },

  /**
   * Get patient's prescriptions (3.4)
   */
  getPatientPrescriptions: async (patientId) => {
    return apiRequest(`/api/prescriptions/patient/${patientId}`);
  },

  /**
   * Get specific prescription (3.4)
   */
  getPrescriptionById: async (prescriptionId) => {
    return apiRequest(`/api/prescriptions/${prescriptionId}`);
  },

  /**
   * Get doctor's prescriptions
   */
  getDoctorPrescriptions: async (doctorId) => {
    return apiRequest(`/api/prescriptions/doctor/${doctorId}`);
  },

  /**
   * Update prescription (3.3)
   */
  updatePrescription: async (prescriptionId, updateData) => {
    return apiRequest(`/api/prescriptions/${prescriptionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  /**
   * Delete prescription
   */
  deletePrescription: async (prescriptionId) => {
    return apiRequest(`/api/prescriptions/${prescriptionId}`, {
      method: 'DELETE',
    });
  },
};
