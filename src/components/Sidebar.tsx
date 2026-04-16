import React from 'react';

interface SidebarProps {
  activeTab: 'dashboard' | 'appointments' | 'medications';
  setActiveTab: (tab: 'dashboard' | 'appointments' | 'medications') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="sidebar">
      <nav className="nav-menu">
        <button
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="icon">📊</span>
          <span>Dashboard</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          <span className="icon">📅</span>
          <span>Appointments</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'medications' ? 'active' : ''}`}
          onClick={() => setActiveTab('medications')}
        >
          <span className="icon">💊</span>
          <span>Medications</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
