import React from 'react';
import './mainDashboard.css';
import ParameterSelection from '../parameterSelection/parameterSelection';

function mainDashboard() {
  return (
    <div id="dashboard" className="dashboard">
      <ParameterSelection />
    </div>
  )
};

export default mainDashboard;

