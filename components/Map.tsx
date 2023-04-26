import React from "react";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  MarkerProps,
  Popup,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import dynamic from "next/dynamic";
import "tailwindcss/tailwind.css";
import * as L from "leaflet";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
// import "leaflet/dist/images/marker-shadow.png";
// import { icon } from "leaflet"
// const Map = dynamic(() => import('../components/Map'), {
//   ssr: false
// });

const Problem1 = (props) => {
  const {
    data,
    years,
    selectedDecade,
    setSelectedDecade,
    setSelectedLocation,
  } = props;

  // console.log("props", props);
  const position = [51.505, -0.09];
  // const decadeOptions = [
  //   { label: 2050, value: 2050 },
  //   { label: 2060, value: 2060 },
  //   { label: 2070, value: 2070 },
  //   { label: 2080, value: 2080 },
  // ];
  // const [selectedDecade, setSelectedDecade] = useState(decadeOptions[0].value);

  const [mounted, setMounted] = useState(false);

  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const getData = data.filter((asset: any) => asset.year == selectedDecade);
    setFilteredData(getData);
  }, [data, selectedDecade]);

  // console.log("filteredData ", filteredData);

  function getMarkerColor(riskRating: number) {
    if (riskRating >= 0.8) {
      return "red";
    } else if (riskRating >= 0.6) {
      return "orange";
    } else if (riskRating >= 0.4) {
      return "yellow";
    } else {
      return "green";
    }
  }
  const getMarkerIcon =( )=>{

  }

  if (!mounted) {
    return null;
  }

  function handleMarkerClick(item: any) {
    setSelectedLocation([item.lat, item.long]);
  }

  if (typeof window !== "undefined") {
    return (
      <div>
        <div className=" items-center">
          <div className="text-xl font-bold mb-4">Risk Visualization Map</div>
          <div className="mb-4">
            <FormControl sx={{ m: 1, minWidth: 80 }}>
              <InputLabel id="demo-simple-select-autowidth-label">
                Select Decade:
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={selectedDecade}
                onChange={(e: any) => {
                  setSelectedDecade(e.target.value);
                  setSelectedLocation(null);
                }}
                autoWidth
                label="Select Decade:"
              >
                {years.map((ele: string) => (
                  <MenuItem key={ele} value={ele}>
                    {ele}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="container mx-auto">
          <MapContainer
            center={[46.1351, -60.1831]}
            zoom={5}
            style={{ height: "450px", width: "80vw" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredData &&
              filteredData.length > 0 &&
              filteredData.map((item, idx) => (
                <Marker
                  key={idx}
                  position={[item.lat, item.long]}
                  color={getMarkerColor(item.riskRating)}
                  eventHandlers={{ click: () => handleMarkerClick(item) }}
                  // icon={icon({
                  //   iconUrl: "/marker.png",
                  //   iconSize: [32, 32],
                  // })}
                >
                  <Popup>
                    <div>{item.asset_name}</div>
                    <div>{item.business_category}</div>
                    <div>Risk Rating: {item.risk_rating}</div>
                  </Popup>
                  <Tooltip>{`${item.asset_name}, ${item.business_category}`}</Tooltip>
                </Marker>
              ))}
          </MapContainer>
        </div>
      </div>
    );
  }

  return null;
};

export default Problem1;
