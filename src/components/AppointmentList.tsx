import React, { useState } from 'react';

interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: string;
  reason: string;
  notes: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  onAdd: (appointment: Omit<Appointment, 'id'>) => void;
  onDelete: (id: number) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, onAdd, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Appointment, 'id'>>({
    date: '',
    time: '',
    doctor: '',
    reason: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.date && formData.time && formData.doctor) {
      onAdd(formData);
      setFormData({
        date: '',
        time: '',
        doctor: '',
        reason: '',
        notes: '',
      });
      setShowForm(false);
    }
  };

  return (
    <div className="section-container">
      <h2>Appointments</h2>
      
      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : '+ Add Appointment'}
      </button>

      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="doctor">Doctor:</label>
            <input
              type="text"
              id="doctor"
              name="doctor"
              value={formData.doctor}
              onChange={handleInputChange}
              placeholder="Doctor's name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="reason">Reason:</label>
            <input
              type="text"
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Reason for visit"
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes:</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes"
              rows={3}
            />
          </div>
          <button type="submit" className="btn btn-success">Save Appointment</button>
        </form>
      )}

      <div className="list-container">
        {appointments.length === 0 ? (
          <p className="empty-message">No appointments scheduled</p>
        ) : (
          appointments.map(appointment => (
            <div key={appointment.id} className="item-card">
              <div className="item-header">
                <h3>{appointment.doctor}</h3>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => onDelete(appointment.id)}
                >
                  Delete
                </button>
              </div>
              <p><strong>Date:</strong> {appointment.date}</p>
              <p><strong>Time:</strong> {appointment.time}</p>
              <p><strong>Reason:</strong> {appointment.reason}</p>
              {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
