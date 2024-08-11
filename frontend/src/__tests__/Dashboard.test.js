import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../components/dashboard/Dashboard';

// Mock subcomponents that are imported in Dashboard
jest.mock('../components/dashboard/Chart', () => () => <div>Mocked Chart Component</div>);
jest.mock('../components/dashboard/Deposits', () => () => <div>Mocked Deposits Component</div>);
jest.mock('../components/defectConfig/DefectConfig', () => () => <div>Mocked Orders Component</div>);

describe('Dashboard Component', () => {
    test('renders the Dashboard component', () => {
        render(<Dashboard />);

        // Check for the presence of the Dashboard title
        expect(screen.getByText('Karevo Dashboard')).toBeInTheDocument();

        // Check if the sub-components are rendered
        expect(screen.getByText('Mocked Chart Component')).toBeInTheDocument();
        expect(screen.getByText('Mocked Deposits Component')).toBeInTheDocument();
        expect(screen.getByText('Mocked DefectConfig Component')).toBeInTheDocument();

        // Check for the presence of the copyright text
        expect(screen.getByText(/Copyright ©/i)).toBeInTheDocument();
        expect(screen.getByText('Karevo')).toBeInTheDocument();
    });
});
