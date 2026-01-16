/**
 * Visits Page (EPIC 3.1, 3.2, 3.6)
 * Manage clinical visit records and view visit history
 */

import { useState, useEffect } from 'react';
import VisitForm from '../components/VisitForm';
import { visitsService } from '../services/visitsService';

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [patientId, setPatientId] = useState('');

  // Fetch visits for patient
  const fetchPatientVisits = async (pid) => {
    if (!pid.trim()) {
      setVisits([]);
      return;
    }

    setLoading(true);
    try {
      const data = await visitsService.getPatientVisits(pid);
      setVisits(data.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch visits');
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVisit = async (formData) => {
    try {
      await visitsService.createVisit(formData);
      setSuccess('Visit record created successfully');
      setShowForm(false);
      await fetchPatientVisits(patientId);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create visit');
    }
  };

  const handleUpdateVisit = async (formData) => {
    try {
      await visitsService.updateVisit(editingId, formData);
      setSuccess('Visit record updated successfully');
      setShowForm(false);
      setEditingId(null);
      await fetchPatientVisits(patientId);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update visit');
    }
  };

  const handleDeleteVisit = async (visitId) => {
    if (!window.confirm('Are you sure you want to delete this visit?')) return;

    try {
      await visitsService.deleteVisit(visitId);
      setSuccess('Visit record deleted successfully');
      await fetchPatientVisits(patientId);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete visit');
    }
  };

  const handleEditVisit = (visit) => {
    setEditingId(visit.id);
    setShowForm(true);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Clinical Visit Records</h1>
        <p>Manage and view patient visit history</p>
      </div>

      {error && <div className="alert alert-error">❌ {error}</div>}
      {success && <div className="alert alert-success">✓ {success}</div>}

      <div className="card">
        <div className="card-header">
          <h2>View Patient Visits</h2>
          <button className="button button-primary" onClick={() => setShowForm(true)}>
            + New Visit
          </button>
        </div>

        <div className="form-group">
          <label>Patient ID</label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => {
              setPatientId(e.target.value);
              if (e.target.value.trim()) {
                fetchPatientVisits(e.target.value);
              }
            }}
            placeholder="Enter patient UUID to view visits"
          />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading" style={{ margin: '0 auto' }}></div>
          </div>
        ) : visits.length === 0 ? (
          <div className="empty-state">
            <h3>No visits found</h3>
            <p>Enter a patient ID to view their visit history</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Visit Date</th>
                  <th>Time</th>
                  <th>Chief Complaint</th>
                  <th>Doctor</th>
                  <th>Findings</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visits.map(visit => (
                  <tr key={visit.id}>
                    <td>{visit.visit_date || '-'}</td>
                    <td>{visit.visit_time || '-'}</td>
                    <td>{visit.chief_complaint || '-'}</td>
                    <td>
                      {visit.doctors?.name || '-'}
                      {visit.doctors?.specialization && ` (${visit.doctors.specialization})`}
                    </td>
                    <td>{visit.findings ? visit.findings.substring(0, 50) + '...' : '-'}</td>
                    <td>
                      <div className="button-group">
                        <button className="button button-small button-primary" onClick={() => handleEditVisit(visit)}>
                          Edit
                        </button>
                        <button className="button button-small button-danger" onClick={() => handleDeleteVisit(visit.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <VisitForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingId(null);
        }}
        onSubmit={editingId ? handleUpdateVisit : handleCreateVisit}
        isEditing={!!editingId}
      />
    </div>
  );
}
