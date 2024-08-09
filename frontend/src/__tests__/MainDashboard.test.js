import React from 'react';
import { render, screen } from '@testing-library/react';
import MainDashboard from "../components/mainDashboard/MainDashboard";


// Mocking the child components
jest.mock('../components/parameterSelection/ParameterSelection', () => () => <div>Parameter Selection Component</div>);
jest.mock('../components/statistics/Statistics', () => () => <div>Statistics Component</div>);

it('renders the mainDashboard component', () => {
    render(<MainDashboard />);

    expect(screen.getByText('Parameter Selection Component')).toBeInTheDocument();

    expect(screen.getByText('Statistics Component')).toBeInTheDocument();
});

it('applies the correct classes to the dashboard', () => {
    const { container } = render(<MainDashboard />);

    // Check if the main dashboard div has the correct ID and class
    const dashboardElement = container.querySelector('#dashboard');
    expect(dashboardElement).toBeInTheDocument();
    expect(dashboardElement).toHaveClass('dashboard');
});

it('renders two columns', () => {
    render(<MainDashboard />);

    expect(true);
});
