import React from "react";
import ss from "./GoalScoreInfo.module.scss";

const GoalScoreInfo = ({ goalsScored }) => {
  if (!goalsScored || goalsScored.length === 0) {
    return (
      <p className={ss.noData}>득점 기록이 없습니다.</p>
    );
  }

  return (
    <table className={ss.table}>
      <thead>
        <tr>
          <th>순번</th>
          <th>득점자</th>
          <th>도움자</th>
        </tr>
      </thead>
      <tbody>
        {goalsScored.map((goal, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{goal.scorer || "-"}</td>
            <td>{goal.assister || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GoalScoreInfo;
