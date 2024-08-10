import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ParameterSelection from '../components/parameterSelection/ParameterSelection';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('ParameterSelection Component', () => {
    beforeEach(() => {
        // Mock Axios responses
        axios.get.mockResolvedValue({
            data: {
                dynamic_defekt_proportion_thresholds: {
                    exampleParameter: 0.5
                },
            },
        });

        axios.post.mockResolvedValue({ status: 200 });
    });

    test('renders and handles slider and text field changes', async () => {
        render(<ParameterSelection />);

        // Wait for the slider to appear
        await waitFor(() => {
            expect(screen.getByRole('slider')).toBeInTheDocument();
        });

        // Wait for the text field to appear
        await waitFor(() => {
            expect(screen.getByRole('spinbutton')).toBeInTheDocument(); // This targets the number input (TextField)
        });

        // Example slider interaction
        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '0.8' } });

        // Verify that the slider value changed correctly (as string)
        await waitFor(() => {
            expect(slider.value).toBe('0.8');
        });

        // Example text field interaction
        const textField = screen.getByRole('spinbutton'); // This targets the number input (TextField)
        fireEvent.change(textField, { target: { value: '0.8' } });

        // Verify that the text field value changed correctly (as string)
        await waitFor(() => {
            expect(textField.value).toBe('0.8');
        });
    });
});
