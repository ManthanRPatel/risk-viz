import { useEffect, useRef } from 'react';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

type MapProps = {
  decadeYear: number;
  data: {
    assetName: string;
    lat: number;
    long: number;
    businessCategory: string;
    riskRating: number;
    riskFactors: { [key: string]: number };
    year: number;
  }[];
};

const Map = ({ decadeYear, data }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      const markers = L.layerGroup().addTo(mapRef.current);

      // Filter data for the given decade year
      const filteredData = data.filter((item) => {
        const yearDiff = item.year - decadeYear;
        return yearDiff >= 0 && yearDiff < 10;
      });

      // Create a marker for each location in the filtered data
      filteredData.forEach((item) => {
        const { lat, long, assetName, businessCategory, riskRating } = item;
        const popupContent = `
          <div>
            <h3>${assetName}</h3>
            <p><strong>Business Category:</strong> ${businessCategory}</p>
            <p><strong>Risk Rating:</strong> ${riskRating}</p>
          </div>
        `;
        const marker = L.marker([lat, long]).bindPopup(popupContent);
        markers.addLayer(marker);
      });
    }
  }, [decadeYear, data]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if ('redraw' in layer) {
          layer.redraw(); // Redraw the layer to update the markers
        }
      });
    }
  }, [decadeYear, data]);

  useEffect(() => {
    // Initialize the map
    mapRef.current = L.map('map', {
      center: [40, -100],
      zoom: 4,
    });

    // Add a tile layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current);

    // Add zoom control to the map
    L.control.zoom().addTo(mapRef.current);

    return () => {
      // Clean up the map when the component is unmounted
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div id="map" style={{ height: '600px' }}></div>;
};

export default Map;
