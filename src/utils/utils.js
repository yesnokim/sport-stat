// Timestamp를 'YYYY-MM-DD' 형식으로 변환하는 함수
export const formatDate = (timestamp) => {
    const date = timestamp.toDate(); // Timestamp를 Date 객체로 변환
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // 'YYYY-MM-DD' 형식으로 반환
};

export const getPlayStat = (state) => {
    const passSuccess = state["forwardPass"] + state["sidePass"] + state["backPass"];
    const passTries = passSuccess + state["failedPass"];
    const passSuccessRate = (passSuccess * 100 / passTries).toFixed(2)
    const ballTouches = passTries + state["shot"] + state["dribble"] + state["failedDribble"] + state["successfulDuel"];

    return {
        passSuccess, passTries, passSuccessRate, ballTouches
    }
}