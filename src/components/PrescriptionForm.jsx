/**
 * Prescription Form Component (EPIC 3.3)
 * Modal form for creating/editing prescriptions
 */

import { useState } from 'react';

export default function PrescriptionForm({ isOpen, onClose, onSubmit, initialData, isEditing }) {
  const [formData, setFormData] = useState(initialData || {
    patient_id: '',
    doctor_id: '',
    visit_id: '',
    medication_name: '',
    dosage: '',
    frequency: '',
    duration: '',
    notes: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.patient_id || !formData.doctor_id || !formData.medication_name || !formData.dosage || !formData.frequency) {
        throw new Error('All required fields must be filled');
      }

      await onSubmit(formData);
      setFormData({
        patient_id: '',
        doctor_id: '',
        visit_id: '',
        medication_name: '',
        dosage: '',
        frequency: '',
        duration: '',
        notes: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Prescription' : 'New Prescription'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">❌ {error}</div>}

            <div className="form-row">
              <div className="form-group">
                <label>Patient ID *</label>
                <input
                  type="text"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  placeholder="Enter patient UUID"
                  disabled={isEditing}
                />
              </div>
              <div className="form-group">
                <label>Doctor ID *</label>
                <input
                  type="text"
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleChange}
                  placeholder="Enter doctor UUID"
                  disabled={isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Related Visit ID (Optional)</label>
              <input
                type="text"
                name="visit_id"
                value={formData.visit_id}
                onChange={handleChange}
                placeholder="Link to visit record (optional)"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Medication Name *</label>
                <input
                  type="text"
                  name="medication_name"
                  value={formData.medication_name}
                  onChange={handleChange}
                  placeholder="e.g., Amoxicillin"
                  required
                />
              </div>
              <div className="form-group">
                <label>Dosage *</label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  placeholder="e.g., 500mg"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Frequency *</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select frequency</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Four times daily">Four times daily</option>
                  <option value="Every 4 hours">Every 4 hours</option>
                  <option value="Every 6 hours">Every 6 hours</option>
                  <option value="Every 8 hours">Every 8 hours</option>
                  <option value="Every 12 hours">Every 12 hours</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 7 days, 2 weeks"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Special instructions or warnings"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="button button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? <span className="loading"></span> : null}
              {isEditing ? 'Update Prescription' : 'Create Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
