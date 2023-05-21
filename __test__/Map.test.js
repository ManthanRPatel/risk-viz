import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Map from '../components/Map';

describe('Map', () => {
  test('renders the component', () => {
    render(<Map />);

    const headerElement = screen.getByText(/Risk Visualization Map/i);
    expect(headerElement).toBeInTheDocument();

    const selectElement = screen.getByLabelText(/Select Decade:/i);
    expect(selectElement).toBeInTheDocument();
  });

  test('changes selected decade when a new value is selected', () => {
    render(<Map />);

    const selectElement = screen.getByLabelText(/Select Decade:/i);

    fireEvent.change(selectElement, { target: { value: '2030' } });

    expect(selectElement.value).toBe('2030');
  });

  test('handles marker click and shows popup with asset details', () => {
    render(<Map />);

    const markerElement = screen.getByTitle('Marker');
    fireEvent.click(markerElement);

    const popupElement = screen.getByText(/Asset Name:/i);
    expect(popupElement).toBeInTheDocument();
  });
});
