import React from 'react';
import './mainDashboard.css';
import ParameterSelection from '../parameterSelection/ParameterSelection';
import Statistics from "../statistics/Statistics";
import { mockData } from "../statistics/mockData";

function mainDashboard() {
  return (
    <div id="dashboard" className="dashboard">
        <div className="row">
            <div className="col-sm-4">
                <ParameterSelection/>
            </div>
            <div className="col-sm-4">
                <Statistics data={mockData}/>
            </div>
        </div>
    </div>
  )
}

export default mainDashboard;

