import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";

const Map = dynamic(() => import("../components/Problem1"), {
  ssr: false,
});

const Table = dynamic(() => import("../components/Problem2"), {
    ssr: false,
});

const LineChart = dynamic(() => import("../components/Problem3"), {
    ssr: false,
});
  

const Home = () => {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);
  const [businessCategories, setBusinessCategories] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);

  const [selectedDecade, setSelectedDecade] = useState(null);

  useEffect(() => {
    setMounted(true);
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => {
        setData(data.data);
        const uniqueYears = [...new Set(data.data.map((item: { year: any; }) => item.year))].sort((a, b) => a - b);
        const uniqueAssets = [...new Set(data.data.map((item: { year: any; }) => item.asset_name))].sort();
        const uniqueBusinessCategories = [...new Set(data.data.map((item: { year: any; }) => item.business_category))].sort();

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
      <div>
          <h1 className="text-2xl font-bold mb-4">
          Welcome To Risk Visualization Map
          </h1>
          {/* <LineChart
                years={years}
                businessCategories={businessCategories}
                assets={assets}
           /> */}
        {/* <Map 
            data={data} years={years} 
            selectedDecade={selectedDecade}
            setSelectedDecade={setSelectedDecade}
        /> */}
        <Table 
            data={data} years={years} 
            selectedDecade={selectedDecade}
            setSelectedDecade={setSelectedDecade}
        />
      </div>
    );
  }
};

export default Home;
