import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import "tailwindcss/tailwind.css";

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
});

const Table = dynamic(() => import("../components/DataTable"), {
  ssr: false,
});

const LineChart = dynamic(() => import("../components/LineGraph"), {
  ssr: false,
});

const Home = () => {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);
  const [businessCategories, setBusinessCategories] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);

  const [selectedDecade, setSelectedDecade] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => {
        setData(data.data);
        const uniqueYears = [ ...Array.from(new Set(data.data.map((item: any) => item.year)))].sort((a:any, b:any) => a - b);
        const uniqueAssets = [ ...Array.from(new Set(data.data.map((item: any) => item.asset_name)))].sort((a:any, b:any) => a - b);
        const uniqueBusinessCategories = [ ...Array.from(new Set(data.data.map((item: any) => item.business_category)))].sort((a:any, b:any) => a - b);

        setAssets(uniqueAssets);
        setBusinessCategories(uniqueBusinessCategories);
        setYears(uniqueYears);
        setSelectedDecade(uniqueYears[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!mounted) {
    return null;
  }

  if (typeof window !== "undefined") {
    return (
      <div className=" p-4 ">
        <Paper className="flex justify-center	p-8" elevation={3}>
          <div>
          <Map
            data={data}
            years={years}
            selectedDecade={selectedDecade}
            setSelectedDecade={setSelectedDecade}
            setSelectedLocation={setSelectedLocation}
          />
          <Table
            data={data}
            years={years}
            selectedDecade={selectedDecade}
            setSelectedDecade={setSelectedDecade}
            selectedLocation={selectedLocation}
          />
          <LineChart
            years={years}
            data={data}
            businessCategories={businessCategories}
            assets={assets}
            selectedLocation={selectedLocation}
          />
          </div>
        </Paper>
      </div>
    );
  }
};

export default Home;
