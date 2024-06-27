import React from 'react';
import './logo.css';

function Logo() {
    const handleToggleSideBar = () => {
        document.body.classList.toggle('toggle-sidebar')
        document.body.classList.toggle('toggle-dashboard')
    };

  return (
    <div className="d-flex align-items-center justify-content-between">
      <i 
        className="bi bi-list toggle-sidebar-btn" 
        onClick={handleToggleSideBar}>
        </i>
        <a href="/mainDashboard" className="logo d-flex align-items-center">
        {/* <img src="" alt=""/> */}
        <span className="d-none d-lg-block">Karevo Dashboard</span>
        </a>
        
    </div>
  );
}

export default Logo;