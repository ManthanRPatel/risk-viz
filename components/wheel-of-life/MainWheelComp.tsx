"use client";
import React, { useState, useEffect } from "react";
import WheelOfLife from "./WheelOfLife";
import WheelEditor from "./WheelEditor";

export interface WheelItem {
  id: number;
  title: string;
  progress: number;
  color: string;
}

const DEFAULT_WHEEL: WheelItem[] = [
  { id: 1, title: "Romance", progress: 7, color: "#ff6bcb" },
  { id: 2, title: "Family", progress: 8, color: "#ff9800" },
  { id: 3, title: "Friendships", progress: 6, color: "#f4c542" },
  { id: 4, title: "Soul", progress: 8, color: "#f44336" },
  { id: 5, title: "Mission/Career", progress: 7, color: "#2196f3" },
  { id: 6, title: "Body", progress: 6, color: "#4caf50" },
  { id: 7, title: "Joy", progress: 9, color: "#7b4cff" },
  { id: 8, title: "Money", progress: 5, color: "#c0a000" },
  { id: 9, title: "Mind", progress: 7, color: "#009688" },
  { id: 10, title: "Personal Growth", progress: 8, color: "#b388ff" },
];

export default function MainWheelComp() {
  const [wheelArr, setWheelArr] = useState<WheelItem[]>(DEFAULT_WHEEL);

  useEffect(() => {
    const storedData = localStorage.getItem("wheelData");
    if (storedData) {
      try {
        setWheelArr(JSON.parse(storedData));
      } catch (e) {
        console.error("Failed to parse wheel data:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wheelData", JSON.stringify(wheelArr));
  }, [wheelArr]);

  return (
    <div style={{ padding: 20 }}>
      <div>
        <WheelOfLife items={wheelArr} />
      </div>
      <div style={{ marginTop: 40 }}>
        <WheelEditor wheelArr={wheelArr} setWheelArr={setWheelArr} />
      </div>
    </div>
  );
}
