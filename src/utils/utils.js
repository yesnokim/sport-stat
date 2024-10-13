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
