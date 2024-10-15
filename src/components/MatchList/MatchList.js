import { Link } from "react-router-dom";
import { getPlayStat } from "../../utils/utils";
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
  { header: "제목", accessorKey: "title" },
  { header: "쿼터", accessorKey: "matchPeriod" },
  {
    header: "볼터치",
    accessorFn: (row) => {
      const { ballTouches } = getPlayStat(row);
      return ballTouches;
    },
  },
  {
    header: "패스성공률",
    accessorFn: (row) => {
      const { passSuccessRate } = getPlayStat(row);
      return `${passSuccessRate}%`;
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
          style={{ color: value < 50 ? "red" : "black" }}>
          {value}
        </span>
      );
    },
  },
  {
    header: "보기",
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
