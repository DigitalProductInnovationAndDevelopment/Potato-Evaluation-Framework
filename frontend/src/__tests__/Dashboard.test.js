import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../components/dashboard/Dashboard';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';

// Mock child components
jest.mock('../components/trackingHistory/TrackingHistory', () => () => <div>Tracking History Content</div>);
jest.mock('../components/defectConfig/DefectConfig', () => () => <div>Defect Config Content</div>);
jest.mock('../components/dashboard/AdminView', () => () => <div>Admin View Content</div>);

// Create a mock theme
const theme = createTheme();

// Helper to wrap components in necessary providers
const renderWithProviders = (ui) => {
    return render(
        <ThemeProvider theme={theme}>
            <MemoryRouter> {/* Wrap with MemoryRouter */}
                {ui}
            </MemoryRouter>
        </ThemeProvider>
    );
};

describe('Dashboard Component', () => {
    test('renders AdminView when view is "admin"', () => {
        renderWithProviders(<Dashboard view="admin" onLogout={() => {}} />);

        expect(screen.getByText('Admin View Content')).toBeInTheDocument();
    });

    test('renders TrackingHistory and DefectConfig when view is not "admin"', () => {
        renderWithProviders(<Dashboard view="user" onLogout={() => {}} />);

        expect(screen.getByText('Tracking History Content')).toBeInTheDocument();
        expect(screen.getByText('Defect Config Content')).toBeInTheDocument();
    });

    test('renders the AppBar and Drawer components', () => {
        renderWithProviders(<Dashboard view="user" onLogout={() => {}} />);

        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
});
