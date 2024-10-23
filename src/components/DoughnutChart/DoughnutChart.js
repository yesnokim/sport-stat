import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import ss from "./DoughnutChart.module.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

// 차트 색상 팔레트 (고정된 10개 색상)
const chartColors = [
  "rgba(75, 192, 192)", // 청록색
  "rgba(54, 162, 235)", // 파란색
  "rgba(255, 99, 132, 0.8)", // 빨간색
  "rgba(255, 206, 86, 0.8)", // 노란색
  "rgba(153, 102, 255, 0.8)", // 보라색
  "rgba(255, 159, 64, 0.8)", // 주황색
  "rgba(199, 199, 199, 0.8)", // 회색
  "rgba(83, 102, 255, 0.8)", // 인디고
  "rgba(255, 205, 86, 0.8)", // 금색
  "rgba(99, 255, 132, 0.8)", // 연두색
];

// Custom plugin to render text in the center of the Doughnut chart
const centerTextPlugin = {
  id: "centerText",
  beforeDraw: (chart) => {
    if (!chart.config.options.centerValue) return null;
    const { ctx, width, height } = chart;
    ctx.save();

    const fontSize = (height / 114).toFixed(2); // Dynamically adjust font size based on chart size
    ctx.font = `1em sans-serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center"; // Ensure the text is horizontally centered

    const centerTitle =
      chart.config.options.centerTitle || ""; // Title for the center
    const centerValue =
      chart.config.options.centerValue || ""; // Value for the center

    const textX = width / 2;
    let textY = height / 2;

    // Draw the value (e.g., "75%")
    if (centerValue) {
      ctx.fillText(
        centerValue,
        textX,
        textY + fontSize * 3
      ); // Position the value below the title
    }

    // Draw the title (e.g., "Pass Success")
    if (centerTitle) {
      ctx.fillText(
        centerTitle,
        textX,
        textY + fontSize * 10
      ); // Position the title above the value
    }
    ctx.restore();
  },
};

ChartJS.register(centerTextPlugin);

const DoughnutChart = ({
  labels,
  dataValues,
  title,
  centerValue,
  centerTitle,
}) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: title || "Doughnut Chart",
        data: dataValues,
        backgroundColor: chartColors,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    // Custom plugin for rendering text in the middle of the chart
    centerValue: centerValue,
    centerTitle: centerTitle,
  };

  return (
    <div className={ss.bg}>
      <Doughnut
        data={data}
        options={options}
      />
    </div>
  );
};

export default DoughnutChart;
