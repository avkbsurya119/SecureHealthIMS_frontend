/**
 * Prescriptions Page (EPIC 3.3, 3.4)
 * Manage and view patient prescriptions
 */

import { useState, useEffect } from 'react';
import PrescriptionForm from '../components/PrescriptionForm';
import { prescriptionsService } from '../services/prescriptionsService';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [patientId, setPatientId] = useState('');

  // Fetch prescriptions for patient
  const fetchPatientPrescriptions = async (pid) => {
    if (!pid.trim()) {
      setPrescriptions([]);
      return;
    }

    setLoading(true);
    try {
      const data = await prescriptionsService.getPatientPrescriptions(pid);
      setPrescriptions(data.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch prescriptions');
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrescription = async (formData) => {
    try {
      await prescriptionsService.createPrescription(formData);
      setSuccess('Prescription created successfully');
      setShowForm(false);
      await fetchPatientPrescriptions(patientId);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create prescription');
    }
  };

  const handleUpdatePrescription = async (formData) => {
    try {
      await prescriptionsService.updatePrescription(editingId, formData);
      setSuccess('Prescription updated successfully');
      setShowForm(false);
      setEditingId(null);
      await fetchPatientPrescriptions(patientId);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update prescription');
    }
  };

  const handleDeletePrescription = async (prescriptionId) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;

    try {
      await prescriptionsService.deletePrescription(prescriptionId);
      setSuccess('Prescription deleted successfully');
      await fetchPatientPrescriptions(patientId);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete prescription');
    }
  };

  const handleEditPrescription = (prescription) => {
    setEditingId(prescription.id);
    setShowForm(true);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Patient Prescriptions</h1>
        <p>Prescribe and manage patient medications</p>
      </div>

      {error && <div className="alert alert-error">❌ {error}</div>}
      {success && <div className="alert alert-success">✓ {success}</div>}

      <div className="card">
        <div className="card-header">
          <h2>Prescriptions</h2>
          <button className="button button-primary" onClick={() => setShowForm(true)}>
            + New Prescription
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
                fetchPatientPrescriptions(e.target.value);
              }
            }}
            placeholder="Enter patient UUID to view prescriptions"
          />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading" style={{ margin: '0 auto' }}></div>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="empty-state">
            <h3>No prescriptions found</h3>
            <p>Enter a patient ID to view their prescriptions</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Doctor</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map(prescription => (
                  <tr key={prescription.id}>
                    <td>
                      <strong>{prescription.medication_name}</strong>
                    </td>
                    <td>{prescription.dosage}</td>
                    <td>{prescription.frequency}</td>
                    <td>{prescription.duration || '-'}</td>
                    <td>
                      {prescription.doctors?.name || '-'}
                      {prescription.doctors?.specialization && ` (${prescription.doctors.specialization})`}
                    </td>
                    <td>{prescription.created_at ? new Date(prescription.created_at).toLocaleDateString() : '-'}</td>
                    <td>
                      <div className="button-group">
                        <button className="button button-small button-primary" onClick={() => handleEditPrescription(prescription)}>
                          Edit
                        </button>
                        <button className="button button-small button-danger" onClick={() => handleDeletePrescription(prescription.id)}>
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

      <PrescriptionForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingId(null);
        }}
        onSubmit={editingId ? handleUpdatePrescription : handleCreatePrescription}
        isEditing={!!editingId}
      />
    </div>
  );
}
