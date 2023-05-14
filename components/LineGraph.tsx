import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import type { ChartData, ChartOptions } from 'chart.js';

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import "tailwindcss/tailwind.css";
import { DataRow } from "@/app/types/types";

//@ts-ignore
Chart.defaults.scale.category = {
  display: true,
  title: {
    display: true,
    text: "My Category Axis",
  },
};

interface LineChartProps {
  years: string[];
  data: DataRow[];
  businessCategories: string[];
  assets: string[];
  selectedLocation: [number, number] | null;
}

const LineChart: NextPage<LineChartProps> = ({ data, years, businessCategories, assets, selectedLocation }: LineChartProps) => {

  const initialStateChartData = {
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

  const [descriptionText, setDescriptionText] =  useState<string>("");
  const [chartData, setChartData] = useState<ChartData<'line'>>(initialStateChartData);
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>(""); // state for selected asset
  const [selectedBusinessCategory, setSelectedBusinessCategory] =
    useState<string>(""); // state for selected business category

  const handleAssetChange = (event: SelectChangeEvent) => {
    setSelectedAsset(event.target.value);

    if (data && data.length > 0) {
      if (event.target.value !== "") {
        setDescriptionText("Selected Asset: "+ event.target.value);
        setSelectedBusinessCategory("");
        const filteredData = data.filter((ele:DataRow)=> ele.asset_name == event.target.value);
        const chartDataSet = getChartData(filteredData);
        setChartData(chartDataSet);
      }
    }
  };

  const handleBusinessCategoryChange = ( event: SelectChangeEvent ) => {
    setSelectedBusinessCategory(event.target.value);

    if (data && data.length > 0) {
      if (event.target.value !== "") {
        setSelectedAsset("");
        setDescriptionText("Selected Business Category: "+ event.target.value);
        const filteredData = data.filter((ele:any)=> ele.business_category == event.target.value);
        const chartDataSet = getChartData(filteredData);
        setChartData(chartDataSet);
      }
    }
  };

  const getChartData = (filteredData: DataRow[]): ChartData<'line'> => {
    setFilteredData(filteredData);
    let chartData: ChartData<'line'> = initialStateChartData;
    chartData = {
      labels: filteredData.map((item:DataRow) => item.year),
      datasets: [
        {
          label: "Risk Rating",
          data: filteredData.map((item:DataRow) => Number(item.risk_rating)),
          backgroundColor: filteredData.map((item:DataRow) => {
            if (Number(item.risk_rating) >= 0.8) {
              return "rgba(255, 99, 132, 0.2)";
            } else if (Number(item.risk_rating) >= 0.6) {
              return "rgba(255, 159, 64, 0.2)";
            } else if (Number(item.risk_rating) >= 0.4) {
              return "rgba(255, 205, 86, 0.2)";
            } else {
              return "rgba(75, 192, 192, 0.2)";
            }
          }),
          borderColor: filteredData.map((item:DataRow) => {
            if (Number(item.risk_rating) >= 0.8) {
              return "rgba(255, 99, 132, 1)";
            } else if (Number(item.risk_rating) >= 0.6) {
              return "rgba(255, 159, 64, 1)";
            } else if (Number(item.risk_rating) >= 0.4) {
              return "rgba(255, 205, 86, 1)";
            } else {
              return "rgba(75, 192, 192, 1)";
            }
          }),
          borderWidth: 1,
          hoverBackgroundColor: filteredData.map((item:DataRow) => {
            if (Number(item.risk_rating) >= 0.8) {
              return "rgba(255, 99, 132, 0.4)";
            } else if (Number(item.risk_rating) >= 0.6) {
              return "rgba(255, 159, 64, 0.4)";
            } else if (Number(item.risk_rating) >= 0.4) {
              return "rgba(255, 205, 86, 0.4)";
            } else {
              return "rgba(75, 192, 192, 0.4)";
            }
          }),
          hoverBorderColor: filteredData.map((item:DataRow) => {
            if (Number(item.risk_rating) >= 0.8) {
              return "rgba(255, 99, 132, 1)";
            } else if (Number(item.risk_rating) >= 0.6) {
              return "rgba(255, 159, 64, 1)";
            } else if (Number(item.risk_rating) >= 0.4) {
              return "rgba(255, 205, 86, 1)";
            } else {
              return "rgba(75, 192, 192, 1)";
            }
          }),
        },
      ],
    };
    return chartData;
  }

  useEffect(() => {
    if (data && data.length > 0) {
      if (selectedLocation) {
        setDescriptionText("Selected Location: Lat("+ selectedLocation[0] +"), Long(" + selectedLocation[1] +")");
        setSelectedAsset("");
        setSelectedBusinessCategory("");
        const filteredData = data.filter((ele:DataRow)=> Number(ele.lat) == selectedLocation[0] && Number(ele.long) == selectedLocation[1]);
        const chartDataSet = getChartData(filteredData);
        setChartData(chartDataSet);
      }
    }
  }, [selectedLocation]);

  const options : ChartOptions<'line'> = {
    plugins:{
      tooltip: {
      callbacks: {
        title: (tooltipItem:any) =>{
          const item = filteredData[tooltipItem[0].dataIndex];
          return [`Asset Name: ${item.asset_name}`];
        },
        label: (tooltipItem:any) => {
          const item = filteredData[tooltipItem.dataIndex];
          return [
            `Year: ${item.year}`,
            `Risk Rating: ${item.risk_rating}`,
            `Risk Factors: ${item.risk_factors}`,
          ];
        },
      },
    },
    }
  };

  return (
    <div className="mt-6">
      <div className="text-xl font-bold">Line Graph</div>
      <div className="text-lg my-2">
          {descriptionText}
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

      {(selectedAsset || selectedBusinessCategory || selectedLocation) &&
        chartData &&
        data.length > 0 && (
          <>
            <Line 
              options={options} 
              data={chartData} 
            />
          </>
        )}
    </div>
  );
};

export default LineChart;
