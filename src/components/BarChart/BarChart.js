import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ChartJS 필수 플러그인 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 차트 색상 팔레트 (고정된 10개 색상)
const chartColors = [
  "rgba(255, 50, 30, 0.8)", // 빨간색
  "rgba(75, 192, 192, 0.8)", // 청록색
  "rgba(54, 162, 235, 0.8)", // 파란색
  "rgba(255, 206, 86, 0.8)", // 노란색
  "rgba(153, 102, 255, 0.8)", // 보라색
  "rgba(255, 159, 64, 0.8)", // 주황색
  "rgba(199, 199, 199, 0.8)", // 회색
  "rgba(83, 102, 255, 0.8)", // 인디고
  "rgba(255, 205, 86, 0.8)", // 금색
  "rgba(99, 255, 132, 0.8)", // 연두색
];

const BarChart = ({
  data,
  xAxisFn,
  xAxisMobileFn,
  yAxisFns,
  labels,
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

  // Firestore 쿼리 결과에서 x축, y축에 사용할 데이터를 추출
  const chartData = {
    labels: isMobile
      ? data.map(xAxisMobileFn)
      : data.map(xAxisFn), // X축 데이터
    datasets: yAxisFns.map((yAxisFn, index) => {
      const backgroundColor =
        chartColors[index % chartColors.length];
      const borderColor = backgroundColor;
      return {
        label: labels[index], // 각 yAxis 데이터의 이름을 label로 사용
        data: data.map(yAxisFn), // 각 yAxisFn으로 y축 값 추출
        backgroundColor: backgroundColor, // 랜덤 배경색
        borderColor: borderColor, // 랜덤 테두리 색
        borderWidth: 1, // 테두리 두께
      };
    }),
  };

  // 옵션 설정 (선택 사항)
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
      x: {
        ticks: {
          maxRotation: 90, // X축 레이블의 최대 회전
          minRotation: 45, // X축 레이블의 최소 회전
        },
      },
      y: {
        beginAtZero: true, // Y축 0부터 시작
      },
    },
  };

  return (
    <Bar
      data={chartData}
      options={options}
    />
  );
};

export default BarChart;
