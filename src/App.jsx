import { useEffect, useState } from 'react'
import './App.css'
import './styles/healthcare.css'
import Visits from './pages/Visits'
import Prescriptions from './pages/Prescriptions'

function App() {
  const [patients, setPatients] = useState([])
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/patients`)
      .then(res => res.json())
      .then(data => setPatients(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="App">
      {/* Navigation */}
      <nav style={{
        backgroundColor: 'white',
        padding: '0 24px',
        display: 'flex',
        gap: '32px',
        color: '#333',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        borderBottom: '1px solid #E8E8ED',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <button 
          onClick={() => setCurrentPage('home')}
          style={{
            background: 'transparent',
            color: currentPage === 'home' ? '#007AFF' : '#6E6E73',
            border: 'none',
            padding: '16px 0',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '15px',
            letterSpacing: '-0.5px',
            borderBottom: currentPage === 'home' ? '3px solid #007AFF' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          Home
        </button>
        <button 
          onClick={() => setCurrentPage('visits')}
          style={{
            background: 'transparent',
            color: currentPage === 'visits' ? '#007AFF' : '#6E6E73',
            border: 'none',
            padding: '16px 0',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '15px',
            letterSpacing: '-0.5px',
            borderBottom: currentPage === 'visits' ? '3px solid #007AFF' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          Clinical Visits
        </button>
        <button 
          onClick={() => setCurrentPage('prescriptions')}
          style={{
            background: 'transparent',
            color: currentPage === 'prescriptions' ? '#007AFF' : '#6E6E73',
            border: 'none',
            padding: '16px 0',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '15px',
            letterSpacing: '-0.5px',
            borderBottom: currentPage === 'prescriptions' ? '3px solid #007AFF' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          Prescriptions
        </button>
      </nav>

      {/* Page Content */}
      {currentPage === 'home' && (
        <div style={{ padding: '48px 24px', maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 700, margin: '0 0 16px 0', letterSpacing: '-1px', color: '#1D1D1F' }}>
              Hospital Management System
            </h1>
            <p style={{ fontSize: '16px', color: '#6E6E73', margin: 0, fontWeight: 400 }}>
              Secure Healthcare Information & Management System
            </p>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', border: '1px solid #E8E8ED' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 24px 0', color: '#1D1D1F' }}>
              Registered Patients
            </h2>
            {patients.length === 0 ? (
              <p style={{ color: '#6E6E73', margin: 0 }}>No patients found</p>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {patients.map((p, idx) => (
                  <li 
                    key={p.id}
                    style={{
                      padding: '16px',
                      borderBottom: idx !== patients.length - 1 ? '1px solid #E8E8ED' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#1D1D1F' }}>
                        {p.name}
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6E6E73' }}>
                        {p.gender && p.gender.charAt(0).toUpperCase() + p.gender.slice(1)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      
      {currentPage === 'visits' && <Visits />}
      {currentPage === 'prescriptions' && <Prescriptions />}
    </div>
  )
}

export default App
