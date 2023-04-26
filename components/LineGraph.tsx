import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import "tailwindcss/tailwind.css";


Chart.defaults.scale.category = {
  display: true,
  title: {
    display: true,
    text: "My Category Axis",
  },
};

const Problem3 = (props) => {
  const { data, years, businessCategories, assets, selectedLocation } = props;

  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>(""); // state for selected asset
  const [selectedBusinessCategory, setSelectedBusinessCategory] =
    useState<string>(""); // state for selected business category

  const handleAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAsset(event.target.value);

    if (data && data.length > 0) {
      if (event.target.value !== "") {
        setSelectedBusinessCategory("");
        var ChartdataSet = {
          labels: [],
          datasets: [
            {
              label: "Risk Rating Over Time",
              data: [],
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        };
        data.forEach((ele: any) => {
          if (ele.asset_name == event.target.value) {
            ChartdataSet.labels.push(parseInt(ele.year));
            ChartdataSet.datasets[0].data.push(parseFloat(ele["risk_rating"]));
          }
        });
        setChartData(ChartdataSet);
      }
    }
  };

  const handleBusinessCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedBusinessCategory(event.target.value);

    if (data && data.length > 0) {
      if (event.target.value !== "") {
        setSelectedAsset("");
        var ChartdataSet = {
          labels: [],
          datasets: [
            {
              label: "Risk Rating Over Time",
              data: [],
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        };
        data.forEach((ele: any) => {
          if (ele.business_category == event.target.value) {
            ChartdataSet.labels.push(parseInt(ele.year));
            ChartdataSet.datasets[0].data.push(parseFloat(ele["risk_rating"]));
          }
        });
        setChartData(ChartdataSet);
      }
    }
  };

  useEffect(() => {
    var ChartdataSet = {
      labels: [],
      datasets: [
        {
          label: "Risk Rating Over Time",
          data: [],
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
    setChartData(ChartdataSet);
  }, []);

  useEffect(() => {
    var ChartdataSet = {
      labels: [],
      datasets: [
        {
          label: "Risk Rating Over Time",
          data: [],
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
    if (data && data.length > 0) {
      if (selectedLocation) {
        data.forEach((ele: any) => {
          if (
            Number(ele.lat) == selectedLocation[0] &&
            Number(ele.long) == selectedLocation[1]
          ) {
            ChartdataSet.labels.push(parseInt(ele.year));
            ChartdataSet.datasets[0].data.push(parseFloat(ele["risk_rating"]));
          }
        });
        setChartData(ChartdataSet);
      }
    }
  }, [selectedLocation]);

  const options = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Year",
        },
      },
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Risk Rating",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          // title: function(tooltipItems: { datasetIndex: string | number; }[], data: { datasets: { [x: string]: { label: any; }; }; }) {
          //   console.log("data ", data);
          //   console.log("data.datasets ", data.datasets);
          //   if()

          //   return `Asset Name: ${data.datasets[tooltipItems[0].datasetIndex].label}`;
          // },
          label: function (
            tooltipItem: {
              datasetIndex: string | number;
              index: string | number;
            },
            data: { datasets: { [x: string]: any } }
          ) {
            if (data?.datasets) {
              console.log("data?.datasets ", data?.datasets);
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const year = dataset.data[tooltipItem.index].x;
              const riskRating = dataset.data[tooltipItem.index].y;
              const riskFactors = dataset.riskFactors[year] || {};
              const riskFactorsStr = Object.entries(riskFactors)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ");
              return `Year: ${year}, Risk Rating: ${riskRating}, Risk Factors: ${riskFactorsStr}`;
            } else {
              return "";
            }
          },
        },
      },
    },
  };

  console.log("chartData", chartData);

  return (
    <div className="mt-6">
      <div className="text-xl font-bold">Line Graph</div>
      <div className="text-lg my-2">
        {selectedAsset
          ? "Selected Asset: " + selectedAsset
          : selectedBusinessCategory
          ? "Selected Business Category: " + selectedBusinessCategory
          : selectedLocation && selectedLocation.length > 0
          ? "Selected Location: " +
            selectedLocation[0] +
            "," +
            selectedLocation[1]
          : null}
      </div>

      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Assets</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={selectedAsset}
          onChange={handleAssetChange}
          autoWidth
          label="Asset"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {assets.map((ele: string) => (
            <MenuItem key={ele} value={ele}>
              {ele}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: 250 }}>
        <InputLabel id="demo-simple-select-autowidth-label">
          Business Category
        </InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={selectedBusinessCategory}
          onChange={handleBusinessCategoryChange}
          autoWidth
          label="Business Category"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {businessCategories.map((ele: string) => (
            <MenuItem key={ele} value={ele}>
              {ele}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Implement a form or dropdown menu to select the item */}
      {(selectedAsset || selectedBusinessCategory || selectedLocation) &&
        chartData &&
        data.length > 0 && (
          <>
            <Line options={options} data={chartData} />
          </>
        )}
    </div>
  );
};

export default Problem3;
