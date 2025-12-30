import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  PolarAreaController,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Title,
  ChartOptions,
  ChartData,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";

ChartJS.register(
  PolarAreaController,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Title
);

export type WheelItem = {
  id: number;
  title: string;
  progress: number; // 0..10
  color?: string;
};

export type WheelOfLifeProps = {
  items: WheelItem[];
  size?: number;
};

const outsideLabelsPlugin = {
  id: "outsideLabels",
  afterDraw: (chart: any) => {
    const ctx = chart.ctx;
    const meta = chart.getDatasetMeta(0);
    if (!meta || !meta.data) return;

    const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
    const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;

    ctx.save();

    // draw center average value
    const values: number[] = chart.data.datasets[0].data as number[];
    const avg = values.length ? Math.round(values.reduce((s, v) => s + v, 0) / values.length) : 0;
    ctx.font = "700 28px Inter, Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#222";
    ctx.fillText(String(avg), centerX, centerY - 8);
    ctx.font = "500 12px Inter, Roboto, sans-serif";
    ctx.fillStyle = "#222"; //"#666";
    ctx.fillText("Average", centerX, centerY + 14);

    meta.data.forEach((arc: any, index: number) => {
      const startAngle = arc.startAngle;
      const endAngle = arc.endAngle;
      const midAngle = (startAngle + endAngle) / 2;

      const outerRadius = arc.outerRadius;
      const labelRadius = outerRadius + 36; // increased padding to prevent cropping

      const x = centerX + Math.cos(midAngle - Math.PI / 2) * labelRadius;
      const y = centerY + Math.sin(midAngle - Math.PI / 2) * labelRadius;

      const lineStartX = centerX + Math.cos(midAngle - Math.PI / 2) * (outerRadius - 4);
      const lineStartY = centerY + Math.sin(midAngle - Math.PI / 2) * (outerRadius - 4);

      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(lineStartX, lineStartY);
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = chart.data.datasets[0].backgroundColor[index];
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();

    //   const isLeft = x < centerX;
    //   const textX = x + (isLeft ? -70 : 70); // move further out
    //   const title = chart.data.labels[index] || "";
    //   const value = chart.data.datasets[0].data[index];

    //   ctx.fillStyle = "#222";
    //   ctx.font = "600 13px Inter, Roboto, sans-serif";
    //   ctx.textAlign = isLeft ? "right" : "left";
    //   ctx.fillText(title, textX, y - 6);

    //   ctx.font = "500 12px Inter, Roboto, sans-serif";
    //   ctx.fillStyle = "#444";
    //   ctx.fillText(`${value} / 10`, textX, y + 10);
    });

    ctx.restore();
  },
};

// ChartJS.register(outsideLabelsPlugin);
export default function WheelOfLife({ items, size = 420 }: WheelOfLifeProps) {
  const chartRef = useRef<any>(null);

  const labels = items.map((it) => it.title);
  const dataValues = items.map((it) => Math.max(0, Math.min(10, it.progress)));
  const backgroundColors = items.map((it) => (it.color));

  const data: ChartData<"polarArea", number[], string> = {
    labels,
    datasets: [
      {
        label: "Wheel of Life",
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map((c) => c),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"polarArea"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.chart.data.labels?.[ctx.dataIndex] as string;
            return `${label}: ${ctx.formattedValue} / 10`; 
          },
        },
      },
      title: {
        display: true,
        text: "Wheel of Life - My Progress",
        font: {
          size: 20,
          weight: "bold",
        },
        color: "#222",
        padding: {
          bottom: 20,
        },
      },
    },
    layout: { padding: 40 }, // extra padding to avoid cropped labels
    scales: {
      r: {
        angleLines: { display: false },
        grid: { circular: true, color: "rgba(0,0,0,0.06)" },
        ticks: {
          display: false,
          beginAtZero: true,
          max: 10,
        },
        pointLabels: { display: true , font: { size: 16, weight: "400" }, color: "#666", },
      },
    },
    elements: { arc: { borderRadius: 8 } },
  };

  useEffect(() => {
    const chart = chartRef.current?.chart;
    if (!chart) return;
    chart.update();
  }, [items]);

  return (
    <div style={{ width: "100%", height: size + 200 , display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <PolarArea ref={chartRef} data={data} options={options} />
    </div>
  );
}
