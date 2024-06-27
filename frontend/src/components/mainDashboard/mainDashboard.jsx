import React from 'react';
import './mainDashboard.css';
import ParameterSelection from '../parameterSelection/parameterSelection';
import ModelSelection from '../modelSelection/modelSelection';

function mainDashboard() {
  return (
    <div id="dashboard" className="dashboard">
      <div class="row">
        <div class="col-sm">
        <ParameterSelection />
        </div>
        <div class="col-sm">
        <ModelSelection />
      </div>
       
      </div>

    </div>
  )
};

export default mainDashboard;

