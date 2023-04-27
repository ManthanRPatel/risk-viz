import React from "react";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  MarkerProps,
  Popup,
  Tooltip,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "tailwindcss/tailwind.css";
import L from "leaflet";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";


type RiskFactor = {
  [key: string]: number;
};

type Asset = {
  assetName: string;
  lat: number;
  long: number;
  businessCategory: string;
  riskRating: number;
  riskFactors: RiskFactor;
  year: number;
};

type Problem1Props = {
  data: Asset[];
  years: number[];
  selectedDecade: number;
  setSelectedDecade: (decade: number) => void;
  setSelectedLocation: (asset: Asset) => void;
};

const Problem1 = (props:any) => {
  const {
    data,
    years,
    selectedDecade,
    setSelectedDecade,
    setSelectedLocation,
  } = props;

  // console.log("props", props);
  const [mounted, setMounted] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const getData = data.filter((asset: any) => asset.year == selectedDecade);
    setFilteredData(getData);
  }, [data, selectedDecade]);


  function getMarkerIcon(riskRating: number) {
    let iconUrl = "";
    if (riskRating >= 0.8) {
      iconUrl = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
    } else if (riskRating >= 0.6) {
      iconUrl = "https://maps.google.com/mapfiles/ms/icons/orange-dot.png";
    } else if (riskRating >= 0.4) {
      iconUrl = "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    } else {
      iconUrl = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";
    }
    return L.icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
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
                  // color={getMarkerColor(item.riskRating)}
                  eventHandlers={{ click: () => handleMarkerClick(item) }}
                  icon={getMarkerIcon(item.risk_rating)}
                  // icon={icon({
                  //   iconUrl: "/marker.png",
                  //   iconSize: [32, 32],
                  // })}
                >
                  <Popup>
                    <div><b>Asset Name:</b> {item.asset_name}</div>
                    <div><b>Business Category:</b> {item.business_category}</div>
                    <div><b>Risk Rating:</b> {item.risk_rating}</div>
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
