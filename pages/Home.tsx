import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { DataRow } from "@/app/types/types";
import "tailwindcss/tailwind.css";

type Data = {
  columns: string[];
  data: DataRow[];
};

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
});

const Table = dynamic(() => import("../components/DataTable"), {
  ssr: false,
});

const LineChart = dynamic(() => import("../components/LineGraph"), {
  ssr: false,
});

const Home: () => JSX.Element | null | undefined = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [data, setData] = useState<DataRow[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [businessCategories, setBusinessCategories] = useState<string[]>([]);
  const [assets, setAssets] = useState<string[]>([]);

  const [selectedDecade, setSelectedDecade] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);

  useEffect(() => {
    setMounted(true);
    fetch("/api/data")
      .then((response) => response.json())
      .then((data: Data) => {
        // console.log("data",data)
        setData(data.data);
        const uniqueYears = [
          ...Array.from(new Set(data.data.map((item: any) => item.year))),
        ].sort((a: any, b: any) => a - b);
        const uniqueAssets = [
          ...Array.from(new Set(data.data.map((item: any) => item.asset_name))),
        ].sort();
        const uniqueBusinessCategories = [
          ...Array.from(
            new Set(data.data.map((item: any) => item.business_category))
          ),
        ].sort();

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
        <Paper className="flex justify-center	p-8 overflow-auto" elevation={3}>
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
