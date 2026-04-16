import React, { useState } from 'react';
import '../styles/MedTracker.css';
import Header from './Header';
import Sidebar from './Sidebar';
import AppointmentList from './AppointmentList';
import MedicationTracker from './MedicationTracker';
import ProgressRing from './ProgressRing';

interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: string;
  reason: string;
  notes: string;
}

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  prescriber: string;
  startDate: string;
  endDate: string;
  refillsRemaining: number;
  adherenceRate?: number;
  lastTaken?: string;
}

interface MedicationLog {
  medicationId: number;
  date: string;
  taken: boolean;
}

const MedTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'medications'>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      date: '2026-04-20',
      time: '10:00 AM',
      doctor: 'Dr. Smith',
      reason: 'Annual Checkup',
      notes: 'Bring insurance card',
    },
    {
      id: 2,
      date: '2026-04-25',
      time: '2:30 PM',
      doctor: 'Dr. Johnson',
      reason: 'Follow-up',
      notes: 'Lab results reviewed',
    },
  ]);

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: 'Aspirin',
      dosage: '100mg',
      frequency: 'Daily',
      prescriber: 'Dr. Smith',
      startDate: '2026-01-15',
      endDate: '2026-12-31',
      refillsRemaining: 5,
      adherenceRate: 92,
      lastTaken: '2026-04-15',
    },
    {
      id: 2,
      name: 'Vitamin D',
      dosage: '1000 IU',
      frequency: 'Daily',
      prescriber: 'Dr. Johnson',
      startDate: '2026-02-01',
      endDate: '2026-08-31',
      refillsRemaining: 3,
      adherenceRate: 88,
      lastTaken: '2026-04-15',
    },
  ]);

  const [medicationLog, setMedicationLog] = useState<MedicationLog[]>([]);

  // Calculate overall medication adherence percentage
  const calculateOverallAdherence = (): number => {
    if (medications.length === 0) return 0;
    const totalAdherence = medications.reduce((sum, med) => sum + (med.adherenceRate || 0), 0);
    return Math.round(totalAdherence / medications.length);
  };

  // Log medication intake
  const logMedicationIntake = (medicationId: number): void => {
    const today = new Date().toISOString().split('T')[0];
    setMedicationLog([...medicationLog, { medicationId, date: today, taken: true }]);
    
    // Update adherence rate
    setMedications(medications.map(med => {
      if (med.id === medicationId) {
        return {
          ...med,
          adherenceRate: Math.min((med.adherenceRate || 0) + 1, 100),
          lastTaken: today,
        };
      }
      return med;
    }));
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = {
      ...appointment,
      id: Math.max(...appointments.map(a => a.id), 0) + 1,
    };
    setAppointments([...appointments, newAppointment]);
  };

  const addMedication = (medication: Omit<Medication, 'id'>) => {
    const newMedication = {
      ...medication,
      id: Math.max(...medications.map(m => m.id), 0) + 1,
    };
    setMedications([...medications, newMedication]);
  };

  const deleteAppointment = (id: number) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const deleteMedication = (id: number) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  return (
    <div className="med-tracker-container">
      <Header />
      <div className="main-content">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="content-area">
          {activeTab === 'dashboard' && (
            <div className="dashboard">
              <h2>Health Dashboard</h2>
              <div className="progress-section">
                <ProgressRing 
                  percentage={calculateOverallAdherence()} 
                  label="Medication Adherence"
                  size={200}
                  strokeWidth={8}
                />
              </div>
              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <h3>Upcoming Appointments</h3>
                  <p className="count">{appointments.length}</p>
                </div>
                <div className="dashboard-card">
                  <h3>Current Medications</h3>
                  <p className="count">{medications.length}</p>
                </div>
                <div className="dashboard-card">
                  <h3>Medication Refills Needed</h3>
                  <p className="count">
                    {medications.filter(m => m.refillsRemaining <= 1).length}
                  </p>
                </div>
              </div>
              <div className="medications-summary">
                <h3>Your Medications</h3>
                <div className="medications-list">
                  {medications.map(med => (
                    <div key={med.id} className="medication-item">
                      <div className="med-info">
                        <p className="med-name">{med.name}</p>
                        <p className="med-dosage">{med.dosage} • {med.frequency}</p>
                        <p className="med-adherence">Adherence: {med.adherenceRate || 0}%</p>
                      </div>
                      <button 
                        className="btn btn-take"
                        onClick={() => logMedicationIntake(med.id)}
                      >
                        ✓ Taken
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'appointments' && (
            <AppointmentList
              appointments={appointments}
              onAdd={addAppointment}
              onDelete={deleteAppointment}
            />
          )}
          {activeTab === 'medications' && (
            <MedicationTracker
              medications={medications}
              onAdd={addMedication}
              onDelete={deleteMedication}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MedTracker;
