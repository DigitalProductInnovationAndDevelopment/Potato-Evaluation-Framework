import React from 'react';
import './mainDashboard.css';
import ParameterSelection from '../parameterSelection/ParameterSelection';
import ModelSelection from '../modelSelection/ModelSelection';
import Statistics from "../statistics/Statistics";
import {mockData} from "../statistics/mockData";

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
          <div class="col-auto">
              <Statistics data={mockData} />
          </div>
       
      </div>

    </div>
  )
};

export default mainDashboard;

