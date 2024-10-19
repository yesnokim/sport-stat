import { Link } from "react-router-dom";
import {
  calculateOverallRating,
  getPlayStat,
} from "../../utils/utils";
import BaseTable from "../BaseTable/BaseTable";
import ss from "./MatchList.module.scss";

const ColDef = [
  {
    header: "날짜",
    cell: ({ row }) => {
      const timestamp = row.original.matchDate; // Firestore Timestamp
      const date = timestamp.toDate(); // JavaScript Date 객체로 변환
      const formattedDate = `${date.getFullYear()}-${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${date
        .getDate()
        .toString()
        .padStart(2, "0")}`;
      return formattedDate; // YYYY-MM-DD 형식으로 날짜 표시
    },
  },
  { header: "상대팀", accessorKey: "title" },
  { header: "쿼터", accessorKey: "matchPeriod" },
  {
    header: "평점",
    accessorFn: (row) => {
      const overall = calculateOverallRating(row);
      return overall;
    },
    cell: ({ getValue }) => {
      const value = getValue();
      let color = "";

      // 패스 성공률에 따른 색상 및 레이블 설정
      if (value >= 7) {
        color = "#006400"; // Dark Green
      } else if (value >= 6) {
        color = "#00008B"; // Navy
      } else if (value >= 5) {
        color = "#FF8C00"; // Dark Orange
      } else if (value >= 4) {
        color = "#8B4513"; // Brown
      } else {
        color = "red"; // Dark Red
      }

      return (
        <span style={{ color, fontWeight: "bold" }}>
          {value}
        </span>
      );
    },
  },
  {
    header: "볼터치",
    accessorFn: (row) => {
      const { ballTouches } = getPlayStat(row);
      return ballTouches;
    },
    cell: ({ getValue }) => {
      const value = getValue();
      let color = "";

      // 패스 성공률에 따른 색상 및 레이블 설정
      if (value >= 23) {
        color = "#006400"; // Dark Green
      } else if (value >= 20) {
        color = "#00008B"; // Navy
      } else if (value >= 15) {
        color = "#FF8C00"; // Dark Orange
      } else if (value >= 10) {
        color = "#8B4513"; // Brown
      } else {
        color = "red"; // Dark Red
      }

      return (
        <span style={{ color, fontWeight: "bold" }}>
          {value}
        </span>
      );
    },
  },
  {
    header: "패스성공률",
    accessorFn: (row) => {
      const { passSuccessRate } = getPlayStat(row);
      return passSuccessRate;
    },
    cell: ({ getValue }) => {
      const value = getValue();
      let color = "";

      // 패스 성공률에 따른 색상 및 레이블 설정
      if (value >= 90) {
        color = "#006400"; // Dark Green
      } else if (value >= 80) {
        color = "#00008B"; // Navy
      } else if (value >= 70) {
        color = "#FF8C00"; // Dark Orange
      } else if (value >= 60) {
        color = "#8B4513"; // Brown
      } else {
        color = "red"; // Dark Red
      }

      return (
        <span style={{ color, fontWeight: "bold" }}>
          {value}%
        </span>
      );
    },
  },
  { header: "득점", accessorKey: "goal" },
  { header: "도움", accessorKey: "assist" },
  { header: "키패스", accessorKey: "keyPass" },
  { header: "인터셉트", accessorKey: "intercept" },
  {
    header: "턴오버",
    accessorKey: "turnover",
    cell: ({ getValue }) => {
      const value = getValue(); // 현재 셀의 값 가져오기
      return (
        <span
          style={{ color: value > 4 ? "red" : "black" }}>
          {value}
        </span>
      );
    },
  },
  {
    header: "상세보기",
    cell: ({ row }) => (
      <Link to={`/soccer-stat?matchId=${row.original.id}`}>
        보기
      </Link>
    ),
  },
];

const MatchList = ({ data }) => {
  return (
    <div className={ss.bg}>
      <BaseTable
        columns={ColDef}
        data={data}
      />
    </div>
  );
};

export default MatchList;
