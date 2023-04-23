import React, { useState, useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import chroma from "chroma-js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


function filterDataByDecadeYear(data: any[], decadeYear: number) {
    const decadeStartYear = decadeYear - (decadeYear % 10);
    const decadeEndYear = decadeStartYear + 9;
    return data.filter((item) => item.year >= decadeStartYear && item.year <= decadeEndYear);
  }


  function createMarkers(data: any[]) {
    const markers: L.Marker<any>[] = [];
    const maxRiskRating = Math.max(...data.map((item) => item.riskRating));
    const colorScale = chroma.scale(['green', 'red']).domain([0, maxRiskRating]);
    data.forEach((item) => {
      const { lat, long, assetName, businessCategory, riskRating } = item;
      const marker = L.marker([lat, long], {
        icon: L.divIcon({
          className: 'marker',
          html: `<div class="marker-color" style="background-color: ${colorScale(
            riskRating
          )}"></div>`,
        }),
      }).bindTooltip(`<b>${assetName}</b><br>${businessCategory}`, { sticky: true });
      markers.push(marker);
    });
    return markers;
  }
  
  
  
export const createMarkerIcon = (color: string) => {
  const isBrowser = typeof window !== "undefined";
  const backgroundColor = isBrowser ? chroma(color).alpha(0.8).css() : color;
  const borderColor = isBrowser ? chroma(color).darken().css() : color;

  return L.divIcon({
    className: "marker-icon",
    html: `<div style="background-color:${backgroundColor};border-color:${borderColor};"></div>`,
  });
};

interface Props {
  data: {
    assetName: string;
    lat: number;
    long: number;
    businessCategory: string;
    riskRating: number;
    riskFactors: { [key: string]: number };
    year: number;
  }[];
}

export default function Map({ decadeYear }) {
    const [dataFiltered, setDataFiltered] = useState([]);
    const [markers, setMarkers] = useState([]);
  
    useEffect(() => {
      const dataFiltered = filterDataByDecadeYear(data, decadeYear);
      const markers = createMarkers(dataFiltered);
      setDataFiltered(dataFiltered);
      setMarkers(markers);
    }, [decadeYear]);
  
    return (
      <div className="map-container">
        <MapContainer center={[51.505, -0.09]} zoom={2}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markers.map((marker) => marker.addTo(map))}
        </MapContainer>
      </div>
    );
  }
  

// export default function Map({ data }: Props) {
//   const mapRef = useRef(null);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (data.length > 0 && mapRef.current) {
//         const map = L.map(mapRef.current);
//         map.setView([data[0].lat, data[0].long], 5);
//         L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//           attribution: "&copy; OpenStreetMap contributors",
//         }).addTo(map);
      
//         // Add markers to the map
//         data.forEach((item) => {
//           const marker = L.marker([item.lat, item.long]).addTo(map);
//         });
//       }
      
//   }, [data]);

//   if (!mounted) {
//     return null;
//   }

//   if (typeof window !== "undefined") {
//     return (
//       <div className="h-96" ref={mapRef}>
//         {data.map((item) => (
//           <Marker
//             key={item.assetName}
//             position={[item.lat, item.long]}
//             icon={createMarkerIcon("#ff0000")}
//           >
//             <Popup>
//               <div>
//                 <p>
//                   <strong>{item.assetName}</strong>
//                 </p>
//                 <p>{item.businessCategory}</p>
//                 <p>Risk Rating: {item.riskRating}</p>
//               </div>
//             </Popup>
//           </Marker>
//         ))}
//       </div>
//     );
//   }
//   else{
//       return null;
//   }
// }
