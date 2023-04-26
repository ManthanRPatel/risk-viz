import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import "tailwindcss/tailwind.css";

//@ts-ignore
Chart.defaults.scale.category = {
  display: true,
  title: {
    display: true,
    text: "My Category Axis",
  },
};

const Problem3 = (props:any) => {
  const { data, years, businessCategories, assets, selectedLocation } = props;

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
  const [chartData, setChartData] = useState<any>(initialStateChartData);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  // const [chartOptions, setchartOptions] = useState(initialState);
  const [selectedAsset, setSelectedAsset] = useState<string>(""); // state for selected asset
  const [selectedBusinessCategory, setSelectedBusinessCategory] =
    useState<string>(""); // state for selected business category

  const handleAssetChange = (event: any) => {
    setSelectedAsset(event.target.value);

    if (data && data.length > 0) {
      if (event.target.value !== "") {
        setDescriptionText("Selected Asset: "+ event.target.value);
        setSelectedBusinessCategory("");
        const filteredData = data.filter((ele:any)=> ele.asset_name == event.target.value);
        const chartDataSet = getChartData(filteredData);
        setChartData(chartDataSet);
      }
    }
  };

  const handleBusinessCategoryChange = (
    event: any
  ) => {
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

  const getChartData = (filteredData: any) => {
    setFilteredData(filteredData);
    const chartData = {
      labels: filteredData.map((item:any) => item.year),
      datasets: [
        {
          label: "Risk Rating",
          data: filteredData.map((item:any) => item.risk_rating),
          backgroundColor: filteredData.map((item:any) => {
            if (item.risk_rating >= 0.8) {
              return "rgba(255, 99, 132, 0.2)";
            } else if (item.risk_rating >= 0.6) {
              return "rgba(255, 159, 64, 0.2)";
            } else if (item.risk_rating >= 0.4) {
              return "rgba(255, 205, 86, 0.2)";
            } else {
              return "rgba(75, 192, 192, 0.2)";
            }
          }),
          borderColor: filteredData.map((item:any) => {
            if (item.risk_rating >= 0.8) {
              return "rgba(255, 99, 132, 1)";
            } else if (item.risk_rating >= 0.6) {
              return "rgba(255, 159, 64, 1)";
            } else if (item.risk_rating >= 0.4) {
              return "rgba(255, 205, 86, 1)";
            } else {
              return "rgba(75, 192, 192, 1)";
            }
          }),
          borderWidth: 1,
          hoverBackgroundColor: filteredData.map((item:any) => {
            if (item.risk_rating >= 0.8) {
              return "rgba(255, 99, 132, 0.4)";
            } else if (item.risk_rating >= 0.6) {
              return "rgba(255, 159, 64, 0.4)";
            } else if (item.risk_rating >= 0.4) {
              return "rgba(255, 205, 86, 0.4)";
            } else {
              return "rgba(75, 192, 192, 0.4)";
            }
          }),
          hoverBorderColor: filteredData.map((item:any) => {
            if (item.risk_rating >= 0.8) {
              return "rgba(255, 99, 132, 1)";
            } else if (item.risk_rating >= 0.6) {
              return "rgba(255, 159, 64, 1)";
            } else if (item.risk_rating >= 0.4) {
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
        const filteredData = data.filter((ele:any)=> Number(ele.lat) == selectedLocation[0] && Number(ele.long) == selectedLocation[1]);
        const chartDataSet = getChartData(filteredData);
        setChartData(chartDataSet);
      }
    }
  }, [selectedLocation]);

  // const options = {
  //   scales: {
  //     x: {
  //       type: "linear",
  //       position: "bottom",
  //       title: {
  //         display: true,
  //         text: "Year",
  //       },
  //     },
  //     y: {
  //       type: "linear",
  //       position: "left",
  //       title: {
  //         display: true,
  //         text: "Risk Rating",
  //       },
  //     },
  //   },
  //   plugins: {
  //     tooltip: {
  //       callbacks: {
  //         // title: function(tooltipItems: { datasetIndex: string | number; }[], data: { datasets: { [x: string]: { label: any; }; }; }) {
  //         //   console.log("data ", data);
  //         //   console.log("data.datasets ", data.datasets);
  //         //   if()

  //         //   return `Asset Name: ${data.datasets[tooltipItems[0].datasetIndex].label}`;
  //         // },
  //         label: function (
  //           tooltipItem: {
  //             datasetIndex: string | number;
  //             index: string | number;
  //           },
  //           data: { datasets: { [x: string]: any } }
  //         ) {
  //           if (data?.datasets) {
  //             // console.log("data?.datasets ", data?.datasets);
  //             const dataset = data.datasets[tooltipItem.datasetIndex];
  //             const year = dataset.data[tooltipItem.index].x;
  //             const risk_rating = dataset.data[tooltipItem.index].y;
  //             const riskFactors = dataset.riskFactors[year] || {};
  //             const riskFactorsStr = Object.entries(riskFactors)
  //               .map(([key, value]) => `${key}: ${value}`)
  //               .join(", ");
  //             return `Year: ${year}, Risk Rating: ${risk_rating}, Risk Factors: ${riskFactorsStr}`;
  //           } else {
  //             return "";
  //           }
  //         },
  //       },
  //     },
  //   },
  // };

  // const options = {
  //   tooltips: {
  //     callbacks: {
  //       label: function (tooltipItem:any, data:any) {
  //         const assetName = 'Asset Name: ' + 'Asset ' + tooltipItem.index;
  //         const risk_rating = 'Risk Rating: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
  //         const riskFactors = 'Risk Factors: ' + 'Factor A, Factor B, Factor C';
  //         const year = 'Year: ' + data.labels[tooltipItem.index];
  //         return [assetName, risk_rating, riskFactors, year];
  //       },
  //     },
  //   },
  // };

  const options = {
    plugins:{
      tooltip: {
      callbacks: {
        title: (tooltipItem:any) =>{
          const item = filteredData[tooltipItem[0].dataIndex];
          return [`Asset Name: ${item.asset_name}`];
        },
        label: (tooltipItem:any) => {
          const item = filteredData[tooltipItem.dataIndex];
          let riskFactors = JSON.parse(item.risk_factors);
          const riskFactorKeys = Object.keys(riskFactors);
          const riskFactorValues = Object.values(riskFactors);

          var str = [];
          for(let i = 0; i < riskFactorKeys.length; i++){
            str.push(riskFactorKeys[i]+':'+riskFactorValues[i])
          }
          riskFactors = str.join(', ');
          return [
            `Year: ${item.year}`,
            `Risk Rating: ${item.risk_rating}`,
            `Risk Factors: ${riskFactors}`,
          ];
        },
      },
    },
    }
  };

  // const options = {
  //   scales: {
  //     yAxes: [
  //       {
  //         ticks: {
  //           beginAtZero: true,
  //         },
  //       },
  //     ],
  //   },
  //   tooltips: {
  //     callbacks: {
  //       label: function (tooltipItem:any, data:any) {
  //         const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
  //         const value = tooltipItem.yLabel;
  //         const year = data.datasets[tooltipItem.datasetIndex].year[tooltipItem.index];
  //         const riskFactors = Object.entries(data.datasets[tooltipItem.datasetIndex].riskFactors[tooltipItem.index]).map(
  //           ([key, value]) => `${key}: ${value}`
  //         );
  //         const tooltipContent = [`${datasetLabel}: ${value}`, `Year: ${year}`, ...riskFactors].join('\n');
  //         return tooltipContent;
  //       },
  //     },
  //   },
  // };

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
              //@ts-ignore
              options={options} 
              data={chartData} 
            />
          </>
        )}
    </div>
  );
};

export default Problem3;
