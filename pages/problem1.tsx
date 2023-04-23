import React from "react";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
// import Map from "../components/Map";
import dynamic from 'next/dynamic';


// const Map = dynamic(() => import('../components/Map'), {
//   ssr: false
// });

const Problem1 = () => {
  const position = [51.505, -0.09];
  const decadeOptions = [
    { label: 2050, value: 2050 },
    { label: 2060, value: 2060 },
    { label: 2070, value: 2070 },
    { label: 2080, value: 2080 },
  ];

  const [mounted, setMounted] = useState(false);
  const [selectedDecade, setSelectedDecade] = useState(decadeOptions[0].value);

  const [data, setData] = useState<any[]>([]);
  const [filteredData, setfilteredData] = useState<any[]>([]);


  useEffect(() => {
    setMounted(true);
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => {
        setData(data.data);
        const getData = data.data.filter((asset: any) => asset.year == selectedDecade)
        setfilteredData(getData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(()=>{

    const getData = data.filter((asset: any) => asset.year == selectedDecade)
    setfilteredData(getData);

  },[selectedDecade])

  console.log("filteredData ", filteredData);

  function getMarkerColor(riskRating: number) {
    if (riskRating >= 0.8) {
      return 'red';
    } else if (riskRating >= 0.6) {
      return 'orange';
    } else if (riskRating >= 0.4) {
      return 'yellow';
    } else {
      return 'green';
    }
  }

  if (!mounted) {
    return null;
  }

  if (typeof window !== "undefined") {
    return (
      <div>
        {/* <MapContainer
          center={position}
          zoom={13}
          style={{ height: "450px", width: "700px" }}
        >
          <TileLayer
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredData.map((asset) => (
            <Marker key={asset.assetName} position={[asset.lat, asset.long]} />
          ))}
        </MapContainer> */}

        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">
            Infinity X Manthan Map : Risk Visualization Map
          </h1>
          <div className="mb-4">
            <label htmlFor="decade-select" className="mr-2">
              Select Decade:
            </label>
            <select
              id="decade-select"
              value={selectedDecade}
              onChange={(e: any) => setSelectedDecade(e.target.value)}
            >
              {decadeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <MapContainer center={[46.1351, -60.1831]} zoom={5}  style={{ height: "450px", width: "700px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredData && filteredData.length>0 && filteredData.map((item, idx) => (
          <Marker key={idx} position={[item.lat, item.long]} color={getMarkerColor(item.riskRating)}>
            <Popup>
              <div>{item.asset_name}</div>
              <div>{item.business_category}</div>
              <div>Risk Rating: {item.risk_rating}</div>
            </Popup>
            <Tooltip>{`${item.asset_name}, ${item.business_category}`}</Tooltip>
          </Marker>
        ))}
      </MapContainer>
          {/* <Map decade={selectedDecade} data={data} /> */}
          {/* <Map data={filteredData} /> */}
        </div>
      </div>
    );
  }

  return null;
};

export default Problem1;
