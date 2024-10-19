import _ from "lodash";
import {
  FaAngleDown,
  FaAngleRight,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  calculateOverallRating,
  getPlayStat,
} from "../../utils/utils";
import BaseTable from "../BaseTable/BaseTable";
import RadarChart from "../RadarChart/RadarChart";
import ss from "./MatchList.module.scss";

const COLUMN_DEF_BASE = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <div
          {...{
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: "pointer" },
          }}>
          {row.getIsExpanded() ? (
            <FaAngleDown className={ss.expand_icon} />
          ) : (
            <FaAngleRight className={ss.expand_icon} />
          )}
        </div>
      ) : null;
    },
  },
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
  {
    header: "쿼터",
    accessorKey: "matchPeriod",
    isQuarterOnly: true,
  },
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
      if (value >= 40) {
        color = "#006400"; // Dark Green
      } else if (value >= 30) {
        color = "#00008B"; // Navy
      } else if (value >= 20) {
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
    isQuarterOnly: true,
    cell: ({ row }) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}>
        <Link
          to={`/soccer-stat?matchId=${row.original.id}`}>
          보기
        </Link>
        {row.original.videoUrl && (
          <a
            href={row.original.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: "10px",
              color: "red",
              fontSize: "large",
            }}>
            <FaYoutube />
          </a>
        )}
      </div>
    ),
  },
];

export const MATCH_COLUMN_TYPES = {
  QUARTER: COLUMN_DEF_BASE,
  GAME: _.filter(
    COLUMN_DEF_BASE,
    (colDef) => !colDef.isQuarterOnly
  ),
};

const MatchList = ({
  data,
  colDef = MATCH_COLUMN_TYPES.QUARTER,
}) => {
  return (
    <div className={ss.bg}>
      <BaseTable
        columns={colDef}
        data={data}
        getRowCanExpand={() => true}
        renderSubComponent={({ row }) => {
          return (
            <div className={ss.sub_render_row}>
              <RadarChart
                playerState={row.original}
                playerName={row.original?.playerName}
              />
            </div>
          );
        }}
      />
    </div>
  );
};

export default MatchList;
