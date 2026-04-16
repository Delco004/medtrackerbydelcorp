import React, { useState } from 'react';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  prescriber: string;
  startDate: string;
  endDate: string;
  refillsRemaining: number;
}

interface MedicationTrackerProps {
  medications: Medication[];
  onAdd: (medication: Omit<Medication, 'id'>) => void;
  onDelete: (id: number) => void;
}

const MedicationTracker: React.FC<MedicationTrackerProps> = ({ medications, onAdd, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Medication, 'id'>>({
    name: '',
    dosage: '',
    frequency: '',
    prescriber: '',
    startDate: '',
    endDate: '',
    refillsRemaining: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'refillsRemaining' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.dosage && formData.frequency) {
      onAdd(formData);
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        prescriber: '',
        startDate: '',
        endDate: '',
        refillsRemaining: 0,
      });
      setShowForm(false);
    }
  };

  return (
    <div className="section-container">
      <h2>Medications</h2>
      
      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : '+ Add Medication'}
      </button>

      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Medication Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Medication name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dosage">Dosage:</label>
            <input
              type="text"
              id="dosage"
              name="dosage"
              value={formData.dosage}
              onChange={handleInputChange}
              placeholder="e.g., 100mg"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="frequency">Frequency:</label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleInputChange}
              required
            >
              <option value="">Select frequency</option>
              <option value="Daily">Daily</option>
              <option value="Twice Daily">Twice Daily</option>
              <option value="Three Times Daily">Three Times Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="As Needed">As Needed</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="prescriber">Prescriber:</label>
            <input
              type="text"
              id="prescriber"
              name="prescriber"
              value={formData.prescriber}
              onChange={handleInputChange}
              placeholder="Doctor's name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="refillsRemaining">Refills Remaining:</label>
            <input
              type="number"
              id="refillsRemaining"
              name="refillsRemaining"
              value={formData.refillsRemaining}
              onChange={handleInputChange}
              min="0"
            />
          </div>
          <button type="submit" className="btn btn-success">Save Medication</button>
        </form>
      )}

      <div className="list-container">
        {medications.length === 0 ? (
          <p className="empty-message">No medications tracked</p>
        ) : (
          medications.map(medication => (
            <div key={medication.id} className={`item-card ${medication.refillsRemaining <= 1 ? 'low-refills' : ''}`}>
              <div className="item-header">
                <h3>{medication.name}</h3>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => onDelete(medication.id)}
                >
                  Delete
                </button>
              </div>
              <p><strong>Dosage:</strong> {medication.dosage}</p>
              <p><strong>Frequency:</strong> {medication.frequency}</p>
              <p><strong>Prescriber:</strong> {medication.prescriber || 'N/A'}</p>
              <p><strong>Start Date:</strong> {medication.startDate || 'N/A'}</p>
              <p><strong>End Date:</strong> {medication.endDate || 'N/A'}</p>
              <p className={medication.refillsRemaining <= 1 ? 'warning' : ''}>
                <strong>Refills Remaining:</strong> {medication.refillsRemaining}
                {medication.refillsRemaining <= 1 && ' ⚠️ Refill needed soon'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicationTracker;
