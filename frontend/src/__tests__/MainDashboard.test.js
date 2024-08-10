import React from 'react';
import { render, screen } from '@testing-library/react';
import MainDashboard from '../components/mainDashboard/MainDashboard';

// Mock the child components
jest.mock('../components/parameterSelection/ParameterSelection', () => () => <div data-testid="parameter-selection">ParameterSelection Component</div>);
jest.mock('../components/statistics/Statistics', () => ({ data }) => <div data-testid="statistics">Statistics Component</div>);

describe('MainDashboard Component', () => {
    it('renders ParameterSelection and Statistics components', () => {
        render(<MainDashboard />); // Use PascalCase if it's a React component

        // Check if ParameterSelection component is rendered
        const parameterSelectionElement = screen.getByTestId('parameter-selection');
        expect(parameterSelectionElement).toBeInTheDocument();

        // Check if Statistics component is rendered
        const statisticsElement = screen.getByTestId('statistics');
        expect(statisticsElement).toBeInTheDocument();
    });
});
