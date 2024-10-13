import { groupBy, sumBy, orderBy } from "lodash";
import { format } from "date-fns"; // 날짜 처리 용이성을 위해 date-fns 사용

// Timestamp를 'YYYY-MM-DD' 형식으로 변환하는 함수
export const formatDate = (timestamp) => {
  const date = timestamp.toDate(); // Timestamp를 Date 객체로 변환
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    "0"
  ); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // 'YYYY-MM-DD' 형식으로 반환
};

export const formatDateDatetimeLocal = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`; // 'YYYY-MM-DDTHH:MM' 형식 반환
};

export const getPlayStat = (state) => {
  const passSuccess =
    state["forwardPass"] +
    state["sidePass"] +
    state["backPass"];
  const passTries = passSuccess + state["failedPass"];
  const passSuccessRate = (
    (passSuccess * 100) /
    passTries
  ).toFixed(2);
  const ballTouches =
    passTries +
    state["shot"] +
    state["dribble"] +
    state["failedDribble"] +
    state["successfulDuel"];
  const attackPoints = state["assist"] + state["goal"];

  return {
    passSuccess,
    passTries,
    passSuccessRate,
    ballTouches,
    attackPoints,
  };
};

// Firestore 데이터 가공 함수
export const processData = (data, sortOrder = "asc") => {
  if (!data) return null;
  // 1. 날짜까지만 고려하여 matchDate를 처리하고 그룹화 기준으로 사용
  const groupedData = groupBy(data, (item) => {
    const dateOnly = format(
      item.matchDate.toDate(),
      "yyyy-MM-dd"
    ); // matchDate를 날짜까지만 사용
    return `${item.title}-${dateOnly}`; // title과 날짜를 조합하여 그룹화 키로 사용
  });

  // 2. 그룹화된 데이터를 합산 처리
  const processedData = Object.keys(groupedData).map(
    (groupKey) => {
      const group = groupedData[groupKey];

      return {
        // title과 matchDate는 그룹 내에서 동일하므로 첫 번째 항목을 사용
        title: group[0].title,
        matchDate: group[0].matchDate, // 첫 번째 항목의 matchDate 사용
        playerName: group[0].playerName, // 여러 값 중 하나의 대표값 사용 (첫 번째 값)

        // matchPeriod: 그룹 내 모든 텍스트 값을 합치기
        matchPeriod: group
          .map((item) => item.matchPeriod)
          .reverse()
          .join(","),

        // 나머지 값들은 합산 처리
        forwardPass: sumBy(group, "forwardPass"),
        sidePass: sumBy(group, "sidePass"),
        backPass: sumBy(group, "backPass"),
        failedPass: sumBy(group, "failedPass"),
        keyPass: sumBy(group, "keyPass"),
        assist: sumBy(group, "assist"),
        goal: sumBy(group, "goal"),
        dribble: sumBy(group, "dribble"),
        failedDribble: sumBy(group, "failedDribble"),
        successfulDuel: sumBy(group, "successfulDuel"),
        failedDuel: sumBy(group, "failedDuel"),
        shot: sumBy(group, "shot"),
        shotOnTarget: sumBy(group, "shotOnTarget"),
        turnover: sumBy(group, "turnover"),
        intercept: sumBy(group, "intercept"),
        pressure: sumBy(group, "pressure"),
      };
    }
  );

  // 3. 시간을 기준으로 정렬 (matchDate 기준)
  const sortedData = orderBy(
    processedData,
    [(item) => item.matchDate.toDate()], // matchDate를 기준으로 정렬
    [sortOrder] // 'asc' 또는 'desc'로 정렬
  );

  return sortedData;
};
