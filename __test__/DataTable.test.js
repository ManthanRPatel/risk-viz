import React from 'react';
import { render, screen } from '@testing-library/react';
import DataTable from '../components/DataTablele';

const mockData = [
    {
        "id": 21,
        "asset_name": "Mcknight, Beasley and Stewart",
        "lat": "50.26729",
        "long": "-119.27337",
        "business_category": "Manufacturing",
        "risk_rating": "0.27",
        "risk_factors": "Drought: 0.03, Tornado: 0.02, Sea level rise: 0.04, Volcano: 0.04, Extreme heat: 0.05, Flooding: 0.05, Wildfire: 0.04",
        "year": "2030"
    },
    {
        "id": 83,
        "asset_name": "Wagner, Curry and Pearson",
        "lat": "50.26729",
        "long": "-119.27337",
        "business_category": "Manufacturing",
        "risk_rating": "0.13",
        "risk_factors": "Earthquake: 0.05, Wildfire: 0.04, Extreme heat: 0.04",
        "year": "2030"
    },
    {
        "id": 130,
        "asset_name": "Roberts, Burke and Williams",
        "lat": "50.26729",
        "long": "-119.27337",
        "business_category": "Retail",
        "risk_rating": "0.9",
        "risk_factors": "Extreme heat: 0.1, Flooding: 0.14, Tornado: 0.15, Volcano: 0.09, Wildfire: 0, Sea level rise: 0.09, Earthquake: 0.04, Hurricane: 0.09, Drought: 0.08, Extreme cold: 0.12",
        "year": "2030"
    },
    {
        "id": 132,
        "asset_name": "Taylor, Mitchell and Ward",
        "lat": "50.26729",
        "long": "-119.27337",
        "business_category": "Technology",
        "risk_rating": "0.13",
        "risk_factors": "Wildfire: 0.01, Tornado: 0.01, Extreme cold: 0.01, Sea level rise: 0.02, Flooding: 0.01, Drought: 0.01, Earthquake: 0.02, Volcano: 0.02, Hurricane: 0.02",
        "year": "2030"
    },
    {
        "id": 204,
        "asset_name": "Patel, Norris and Jackson",
        "lat": "50.26729",
        "long": "-119.27337",
        "business_category": "Retail",
        "risk_rating": "0.55",
        "risk_factors": "Wildfire: 0.039999999999999994, Flooding: 0.01, Tornado: 0.08, Earthquake: 0.04, Extreme heat: 0.1, Drought: 0.07, Hurricane: 0.09, Volcano: 0.08, Sea level rise: 0.03, Extreme cold: 0.01",
        "year": "2030"
    },
    {
        "id": 260,
        "asset_name": "Thompson, Davis and Brown",
        "lat": "50.26729",
        "long": "-119.27337",
        "business_category": "Retail",
        "risk_rating": "0.26",
        "risk_factors": "Hurricane: 0.13, Earthquake: 0.06, Extreme cold: 0.07",
        "year": "2030"
    },
    {
        "id": 274,
        "asset_name": "Landry, Molina and Green",
        "lat": "50.26729",
        "long": "-119.27337",
        "business_category": "Energy",
        "risk_rating": "0.36",
        "risk_factors": "Hurricane: 0.1, Earthquake: 0.06, Tornado: 0.2",
        "year": "2030"
    },
    {
        "id": 300,
        "asset_name": "Gray-Evans",
        "lat": "50.26729",
        "long": "-119.27337",
        "business_category": "Technology",
        "risk_rating": "0.47",
        "risk_factors": "Volcano: 0.47",
        "year": "2030"
    },
    {
        "id": 322,
        "asset_name": "Mejia, Roberts and Gay",
        "lat": "50.26729",
        "long": "-119.27337",
        "business_category": "Retail",
        "risk_rating": "0.84",
        "risk_factors": "Drought: 0.01, Sea level rise: 0.28, Extreme cold: 0.55",
        "year": "2030"
    },
    {
        "id": 375,
        "asset_name": "Fox, Daniel and Coleman",
        "lat": "50.26729",
        "long": "-119.27337",
        "business_category": "Manufacturing",
        "risk_rating": "0.27",
        "risk_factors": "Extreme cold: 0.06999999999999999, Wildfire: 0.01, Volcano: 0.1, Drought: 0.05, Earthquake: 0.04, Flooding: 0",
        "year": "2030"
    }
];

const mockYears = [
  2020,2030, 2040, 2050
];

const mockSelectedDecade = 2020;
const mockSelectedLocation = [40.7128, -74.0060];

describe('DataTable', () => {
  test('renders the component with data and description text', () => {
    render(
      <DataTable
        data={mockData}
        years={mockYears}
        selectedDecade={mockSelectedDecade}
        setSelectedDecade={() => {}}
        selectedLocation={mockSelectedLocation}
      />
    );

    const dataTableElement = screen.getByText(/Data Table/i);
    expect(dataTableElement).toBeInTheDocument();

    const descriptionTextElement = screen.getByText(/Selected Decade: 2020/i);
    expect(descriptionTextElement).toBeInTheDocument();
  });

  // Add more tests for other functionalities as needed
});
