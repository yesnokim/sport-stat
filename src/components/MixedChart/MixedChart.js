import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js 필수 플러그인 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 차트 색상 팔레트 (고정된 10개 색상)
const chartColors = [
  "rgba(75, 192, 192, 0.8)", // 청록색
  "rgba(255, 99, 132, 0.8)", // 빨간색
  "rgba(54, 162, 235, 0.8)", // 파란색
  "rgba(255, 206, 86, 0.8)", // 노란색
  "rgba(153, 102, 255, 0.8)", // 보라색
  "rgba(255, 159, 64, 0.8)", // 주황색
  "rgba(199, 199, 199, 0.8)", // 회색
  "rgba(83, 102, 255, 0.8)", // 인디고
  "rgba(255, 205, 86, 0.8)", // 금색
  "rgba(99, 255, 132, 0.8)", // 연두색
];

const MixedChart = ({
  data,
  xAxisFn,
  xAxisMobileFn,
  yLineFns,
  yBarFns,
  labelsLine,
  labelsBar,
  title,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // 화면 크기에 따라 isMobile 상태 설정
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // 768px 이하이면 모바일로 간주
    };

    handleResize(); // 초기 설정
    window.addEventListener("resize", handleResize); // 화면 크기 변화 감지
    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  const chartData = {
    labels: isMobile
      ? data.map(xAxisMobileFn)
      : data.map(xAxisFn), // X축 데이터
    datasets: [
      // Line Chart에 해당하는 데이터셋들
      ...yLineFns.map((yLineFn, index) => ({
        type: "line",
        label: labelsLine[index],
        data: data.map(yLineFn),
        fill: false,
        backgroundColor:
          chartColors[index % chartColors.length], // 고정된 색상 셋트
        borderColor:
          chartColors[index % chartColors.length], // 동일한 색상 사용
        tension: 0.1,
        yAxisID: "y", // Line Chart 전용 Y축
      })),
      // Bar Chart에 해당하는 데이터셋들
      ...yBarFns.map((yBarFn, index) => ({
        type: "bar",
        label: labelsBar[index],
        data: data.map(yBarFn),
        backgroundColor:
          chartColors[
            (index + yLineFns.length) % chartColors.length
          ], // 고정된 색상 셋트
        borderColor: "rgba(55,55,55,1)", // 동일한 색상 사용
        borderWidth: 1,
        yAxisID: "y1", // Bar Chart 전용 Y축
      })),
    ],
  };

  // 옵션 설정
  const options = {
    responsive: true,
    maintainAspectRatio: false, // 기본 가로세로 비율 유지하지 않음
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        type: "linear",
        position: "left", // Line chart 전용 Y축
      },
      y1: {
        type: "linear",
        position: "right", // Bar chart 전용 Y축
        grid: {
          drawOnChartArea: false, // 왼쪽 Y축과 중첩되지 않도록 설정
        },
      },
    },
  };

  return (
    <Line
      data={chartData}
      options={options}
    />
  );
};

export default MixedChart;
