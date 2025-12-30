import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "tailwindcss/tailwind.css";

import MainWheelComp from "../components/wheel-of-life/MainWheelComp";
import RiskAssessment from "../components/RiskAssessment";

const Home: () => JSX.Element | null = () => {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <div className="p-4">
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Wheel Of Life" />
          <Tab label="Risk Assessment Project" />
        </Tabs>

      <Box mt={4}>
        {tab === 0 && <MainWheelComp />}
        {tab === 1 && <RiskAssessment />}
      </Box>
    </div>
  );
};

export default Home;