import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

Chart.defaults.scale.category = {
  display: true,
  title: {
    display: true,
    text: "My Category Axis",
  },
};

const Problem3 = () => {
  const [data, setData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedLatLang, setselectedLatLang] = useState([
    "42.8334",
    "-80.38297",
  ]);

  const [selectedItem, setSelectedItem] = useState(null);

  const [selectedLocation, setSelectedLocation] = useState<string>(""); // state for selected location
  const [selectedAsset, setSelectedAsset] = useState<string>(""); // state for selected asset
  const [selectedBusinessCategory, setSelectedBusinessCategory] =
    useState<string>(""); // state for selected business category

    const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedLocation(event.target.value);
    };
    
    const handleAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedAsset(event.target.value);
    };
    
    const handleBusinessCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedBusinessCategory(event.target.value);
    };

  useEffect(() => {
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => {
        setData(data.data);

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

        console.log("selectedLatLang[0] ", selectedLatLang[0]);
        console.log("selectedLatLang[1] ", selectedLatLang[1]);

        data.data.forEach((ele: any) => {
          // console.log("ele ", ele);
          // console.log("ele.lat ", parseFloat(ele.lat), "type", typeof(parseFloat(ele.lat)));
          // console.log("ele.lang ", parseFloat(ele.long), "type", typeof(parseFloat(ele.long)));

          if (Number(ele.lat) == 42.8334 && Number(ele.long) == -80.38297) {
            // console.log("ele ", ele);
            ChartdataSet.labels.push(parseInt(ele.year));
            ChartdataSet.datasets[0].data.push(parseFloat(ele["risk_rating"]));
          }
        });

        setChartData(ChartdataSet);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
    <div>
      <h1>Problem 3</h1>
      <h2>Select a location, asset, or business category:</h2>
      {/* Implement a form or dropdown menu to select the item */}
      {chartData && data.length > 0 && (
        <Line options={options} data={chartData} />
      )}
    </div>
  );
};

export default Problem3;
