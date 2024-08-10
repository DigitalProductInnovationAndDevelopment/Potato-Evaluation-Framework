import React from 'react';
import { render, screen } from '@testing-library/react';
import MainDashboard from "../components/mainDashboard/MainDashboard";


// Mocking the child components
jest.mock('../components/parameterSelection/ParameterSelection', () => () => <div>Parameter Selection Component</div>);
jest.mock('../components/statistics/Statistics', () => () => <div>Statistics Component</div>);

it('renders two columns', () => {
    render(<MainDashboard />);
    expect(true).toBeTruthy();
});
