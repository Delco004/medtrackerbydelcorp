import React from 'react';

const Header: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="med-tracker-header">
      <div className="header-content">
        <div className="logo-section">
          <h1>💊 MedTracker</h1>
          <p className="tagline">Your Personal Health Management System</p>
        </div>
        <div className="header-info">
          <p className="current-date">{currentDate}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
