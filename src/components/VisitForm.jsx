/**
 * Visit Form Component (EPIC 3.1)
 * Modal form for creating/editing visit records
 */

import { useState } from 'react';

export default function VisitForm({ isOpen, onClose, onSubmit, initialData, isEditing }) {
  const [formData, setFormData] = useState(initialData || {
    patient_id: '',
    doctor_id: '',
    visit_date: '',
    visit_time: '',
    chief_complaint: '',
    findings: '',
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
      if (!formData.patient_id || !formData.doctor_id || !formData.visit_date || !formData.visit_time) {
        throw new Error('All required fields must be filled');
      }

      await onSubmit(formData);
      setFormData({
        patient_id: '',
        doctor_id: '',
        visit_date: '',
        visit_time: '',
        chief_complaint: '',
        findings: '',
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
          <h2>{isEditing ? 'Edit Visit' : 'New Clinical Visit'}</h2>
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

            <div className="form-row">
              <div className="form-group">
                <label>Visit Date *</label>
                <input
                  type="date"
                  name="visit_date"
                  value={formData.visit_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Visit Time *</label>
                <input
                  type="time"
                  name="visit_time"
                  value={formData.visit_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Chief Complaint</label>
              <textarea
                name="chief_complaint"
                value={formData.chief_complaint}
                onChange={handleChange}
                placeholder="Patient's main complaint or reason for visit"
              />
            </div>

            <div className="form-group">
              <label>Findings</label>
              <textarea
                name="findings"
                value={formData.findings}
                onChange={handleChange}
                placeholder="Clinical findings and observations"
              />
            </div>

            <div className="form-group">
              <label>Clinical Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional clinical notes"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="button button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? <span className="loading"></span> : null}
              {isEditing ? 'Update Visit' : 'Create Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
