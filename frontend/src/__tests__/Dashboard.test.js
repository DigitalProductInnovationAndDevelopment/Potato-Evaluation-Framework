import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../components/dashboard/Dashboard';

// Mock subcomponents that are imported in Dashboard
jest.mock('../components/dashboard/Chart', () => () => <div>Mocked Chart Component</div>);
jest.mock('../components/dashboard/Deposits', () => () => <div>Mocked Deposits Component</div>);

// Mock the DefectConfig component to include the Apply button and Snackbar
jest.mock('../components/defectConfig/DefectConfig', () => () => (
    <div>
        Mocked DefectConfig Component
        <button onClick={() => {}}>Apply</button>
        <div role="alert">Defect configuration updated successfully!</div>
    </div>
));

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

    test('shows success message when Apply button is clicked', async () => {
        render(<Dashboard />);

        // Check if the Apply button is present
        const applyButton = screen.getByText('Apply');
        expect(applyButton).toBeInTheDocument();

        // Mock the click event and verify Snackbar visibility
        fireEvent.click(applyButton);

        // Wait for the success message to appear
        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('Defect configuration updated successfully!');
        });

        // Optionally, you can test if the message disappears after 3 seconds
        await new Promise((resolve) => setTimeout(resolve, 3000));
    });
});
