import {
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import _ from "lodash";
import { useEffect, useReducer, useState } from "react";
import { FaYoutube } from "react-icons/fa";
import { db } from "../../firebase";
import { DB_COLLECTION_NAME } from "../../utils/constants";
import {
  calculateAttackingMidfielderScore,
  calculateOverallRating,
  getPlayStat,
} from "../../utils/utils";
import DoughnutChart from "../DoughnutChart/DoughnutChart";
import RadarChart from "../RadarChart/RadarChart";
import ss from "./SoccerStatInput.module.scss";

// 초기 상태 정의
const initialState = {
  forwardPass: 0,
  sidePass: 0,
  backPass: 0,
  failedPass: 0,
  keyPass: 0,
  assist: 0,
  goal: 0,
  dribble: 0,
  failedDribble: 0,
  successfulDuel: 0,
  failedDuel: 0,
  shot: 0,
  shotOnTarget: 0,
  turnover: 0,
  intercept: 0,
  pressure: 0,
  goalsScored: [], // 각 득점 정보를 저장하는 리스트 [{ scorer: "선수1", assister: "선수2" }]
  goalsConceded: 0, // 실점 수
};

// reducer 함수 정의
function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_STATE":
      const newObj = {};
      Object.keys(state).forEach((key) => {
        newObj[key] = action.payload[key];
      });
      return {
        ...state,
        ...newObj,
      };
    case "INCREMENT_FORWARD_PASS":
      return {
        ...state,
        forwardPass: state.forwardPass + 1,
      };
    case "DECREMENT_FORWARD_PASS":
      return {
        ...state,
        forwardPass: state.forwardPass - 1,
      };

    case "INCREMENT_SIDE_PASS":
      return { ...state, sidePass: state.sidePass + 1 };
    case "DECREMENT_SIDE_PASS":
      return { ...state, sidePass: state.sidePass - 1 };

    case "INCREMENT_BACK_PASS":
      return { ...state, backPass: state.backPass + 1 };
    case "DECREMENT_BACK_PASS":
      return { ...state, backPass: state.backPass - 1 };

    case "INCREMENT_FAILED_PASS":
      return {
        ...state,
        failedPass: state.failedPass + 1,
        turnover: state.turnover + 1,
      };
    case "DECREMENT_FAILED_PASS":
      return {
        ...state,
        failedPass: state.failedPass - 1,
        turnover: state.turnover - 1,
      };

    case "INCREMENT_KEY_PASS":
      return { ...state, keyPass: state.keyPass + 1 };
    case "DECREMENT_KEY_PASS":
      return { ...state, keyPass: state.keyPass - 1 };

    case "INCREMENT_ASSIST":
      return {
        ...state,
        assist: state.assist + 1,
        keyPass: state.keyPass + 1,
      };
    case "DECREMENT_ASSIST":
      return {
        ...state,
        assist: state.assist - 1,
        keyPass: state.keyPass - 1,
      };

    case "INCREMENT_GOAL":
      return {
        ...state,
        goal: state.goal + 1,
        shot: state.shot + 1,
      };
    case "DECREMENT_GOAL":
      return {
        ...state,
        goal: state.goal - 1,
        shot: state.shot - 1,
      };

    case "INCREMENT_DRIBBLE":
      return { ...state, dribble: state.dribble + 1 };
    case "DECREMENT_DRIBBLE":
      return { ...state, dribble: state.dribble - 1 };

    case "INCREMENT_FAILED_DRIBBLE":
      return {
        ...state,
        failedDribble: state.failedDribble + 1,
        turnover: state.turnover + 1,
      };
    case "DECREMENT_FAILED_DRIBBLE":
      return {
        ...state,
        failedDribble: state.failedDribble - 1,
        turnover: state.turnover - 1,
      };

    case "INCREMENT_TURNOVER":
      return { ...state, turnover: state.turnover + 1 };
    case "DECREMENT_TURNOVER":
      return { ...state, turnover: state.turnover - 1 };

    case "INCREMENT_SUCCESSFUL_DUEL":
      return {
        ...state,
        successfulDuel: state.successfulDuel + 1,
      };
    case "DECREMENT_SUCCESSFUL_DUEL":
      return {
        ...state,
        successfulDuel: state.successfulDuel - 1,
      };

    case "INCREMENT_FAILED_DUEL":
      return { ...state, failedDuel: state.failedDuel + 1 };
    case "DECREMENT_FAILED_DUEL":
      return { ...state, failedDuel: state.failedDuel - 1 };

    case "INCREMENT_SHOT":
      return { ...state, shot: state.shot + 1 };
    case "DECREMENT_SHOT":
      return { ...state, shot: state.shot - 1 };

    case "INCREMENT_INTERCEPT":
      return { ...state, intercept: state.intercept + 1 };
    case "DECREMENT_INTERCEPT":
      return { ...state, intercept: state.intercept - 1 };

    case "INCREMENT_PRESSURE":
      return { ...state, pressure: state.pressure + 1 };
    case "DECREMENT_PRESSURE":
      return { ...state, pressure: state.pressure - 1 };

    case "INCREMENT_SHOT_ON_TARGET":
      return {
        ...state,
        shotOnTarget: state.shotOnTarget + 1,
        shot: state.shot + 1,
      };
    case "DECREMENT_SHOT_ON_TARGET":
      return {
        ...state,
        shotOnTarget: state.shotOnTarget - 1,
        shot: state.shot - 1,
      };

    case "ADD_GOAL":
      return {
        ...state,
        goalsScored: [
          ...state.goalsScored,
          {
            scorer: action.payload.scorer,
            assister: action.payload.assister,
          },
        ],
      };

    case "REMOVE_GOAL":
      return {
        ...state,
        goalsScored: state.goalsScored.filter(
          (_, index) => index !== action.payload.index
        ),
      };

    // 실점 추가
    case "INCREMENT_GOALS_CONCEDED":
      return {
        ...state,
        goalsConceded: state.goalsConceded + 1,
      };
    case "DECREMENT_GOALS_CONCEDED":
      return {
        ...state,
        goalsConceded: state.goalsConceded - 1,
      };

    default:
      return state;
  }
}

const SoccerStatInput = ({
  playerName = "Ian Kim",
  matchData,
  initTitle = "",
  initMatchDate = "",
  initPlaytime = "",
  initMatchPeriod = "전반",
  initVideoUrl = "",
  matchId,
}) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );
  const [title, setTitle] = useState(initTitle);
  const [playtime, setPlaytime] = useState(initPlaytime);
  const [matchDate, setMatchDate] = useState(initMatchDate);
  const [matchPeriod, setMatchPeriod] =
    useState(initMatchPeriod); // 초기값을 설정
  const [videoUrl, setVideoUrl] = useState(initVideoUrl); // 초기값을 설정
  const [scorer, setScorer] = useState(""); // 득점 선수
  const [assister, setAssister] = useState(""); // 도움 선수
  const [showGoalInput, setShowGoalInput] = useState(false); // 득점 입력창 표시 여부
  const [editIndex, setEditIndex] = useState(null); // 수정 중인 득점 항목의 인덱스
  const [editedScorer, setEditedScorer] = useState(""); // 수정 중인 득점 선수 이름
  const [editedAssister, setEditedAssister] = useState(""); // 수정 중인 도움 선수 이름

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

  // matchData가 있으면 initialState와 병합
  useEffect(() => {
    if (matchData) {
      const mergedState = { ...initialState, ...matchData }; // initialState와 matchData 병합
      dispatch({
        type: "UPDATE_STATE",
        payload: mergedState,
      });
    }
  }, [matchData]);

  const handleChange = (e) => {
    setMatchPeriod(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value?.trim?.());
  };

  const handlePlaytimeChange = (e) => {
    setPlaytime(e.target.value);
  };

  const handleDateChange = (e) => {
    setMatchDate(e.target.value);
  };

  const handleVideoUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };

  const handleAddGoal = () => {
    if (scorer) {
      dispatch({
        type: "ADD_GOAL",
        payload: { scorer, assister: assister || "" },
      });
      setScorer(""); // 입력 후 초기화
      setAssister(""); // 입력 후 초기화
      setShowGoalInput(false); // 입력창 닫기
    } else {
      alert("득점 선수를 입력하세요.");
    }
  };

  const handleRemoveGoal = (index) => {
    dispatch({ type: "REMOVE_GOAL", payload: { index } });
  };

  // 득점 수정 모드를 저장하는 함수
  const handleEditGoal = (index) => {
    setEditIndex(index); // 수정할 득점 항목의 인덱스 설정
    setEditedScorer(state.goalsScored[index].scorer); // 기존 득점자 이름을 초기화
    setEditedAssister(state.goalsScored[index].assister); // 기존 도움자 이름을 초기화
  };

  // 득점 수정 완료 처리 함수
  const handleSaveEditedGoal = () => {
    const updatedGoals = state.goalsScored.map(
      (goal, index) =>
        index === editIndex
          ? {
              scorer: editedScorer,
              assister: editedAssister,
            }
          : goal
    );
    dispatch({
      type: "UPDATE_STATE",
      payload: { ...state, goalsScored: updatedGoals },
    });
    setEditIndex(null); // 수정 완료 후 수정 모드 종료
    setEditedScorer(""); // 수정 필드 초기화
    setEditedAssister(""); // 수정 필드 초기화
  };

  const saveMatchResult = async () => {
    const isConfirmed =
      window.confirm("정말 저장하시겠습니까?");

    if (isConfirmed && matchDate) {
      const matchTimestamp = Timestamp.fromDate(
        new Date(matchDate)
      );

      const matchId = `${title}_${matchDate}_${matchPeriod}_${playerName}`; // SQL의 복합 키와 유사한 방식으로 key 생성

      const matchData = {
        title,
        matchDate: matchTimestamp,
        matchPeriod,
        playerName,
        playtime,
        videoUrl,
        ...state, // 경기 관련 통계 (useReducer로 관리하는 state)
      };

      try {
        // 'matches' 컬렉션에 문서를 만들고 데이터를 저장
        await setDoc(
          doc(db, DB_COLLECTION_NAME, matchId),
          matchData,
          { merge: true }
        );
        alert("성공적으로 저장되었습니다.");
      } catch (error) {
        console.error("Error saving document: ", error);
      }
    } else {
      alert("저장 작업이 취소되었습니다.");
    }
  };

  // 문서 삭제 함수
  const deleteMatch = async () => {
    try {
      await deleteDoc(doc(db, "matches", matchId));
      console.log("성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("삭제 실패: ", error);
    }
  };

  const handleDelete = () => {
    // 사용자에게 삭제 여부를 확인
    const confirmDelete = window.confirm(
      `정말로 이 항목을 삭제하시겠습니까? \n${matchId}`
    );
    if (confirmDelete) {
      deleteMatch();
    }
  };

  // 통계 UI 항목 컴포넌트
  const StatItem = ({
    title,
    stateKey,
    incrementType,
    decrementType,
    showButton = !isMobile,
  }) => (
    <div className={ss.stat_item}>
      <div className={ss.stat_title}>{title}</div>
      {showButton && (
        <button
          className={ss.stat_btn}
          onClick={() => dispatch({ type: decrementType })}>
          -
        </button>
      )}
      <div className={ss.stat_value}>{state[stateKey]}</div>
      {showButton && (
        <button
          className={ss.stat_btn}
          onClick={() => dispatch({ type: incrementType })}>
          +
        </button>
      )}
    </div>
  );

  const DashboardItem = ({
    title,
    subTitle,
    value,
    isBad,
    suffix = "",
  }) => {
    return (
      <div
        className={
          isBad ? [ss.item, ss.bad_item].join(" ") : ss.item
        }>
        <div className={ss.title_box}>
          <div className={ss.title}>{title}</div>
          {subTitle && (
            <div className={ss.sub_title}>
              {`(${subTitle})`}
            </div>
          )}
        </div>
        <div
          className={ss.value}>{`${value}${suffix}`}</div>
      </div>
    );
  };

  const { passSuccessRate, passTries, ballTouches } =
    getPlayStat(state);
  const attackingScore =
    calculateAttackingMidfielderScore(state);
  const overallRating = calculateOverallRating(state);

  return (
    <div className={ss.bg}>
      {!isMobile && (
        <div className={ss.header}>
          <div className={ss.basic_info}>
            <input
              className={ss.input_item}
              type="datetime-local"
              value={matchDate}
              onChange={handleDateChange}
            />
            <input
              className={ss.input_item}
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="예) 대구ㅇㅇ초"
            />
            <select
              className={ss.input_item}
              value={matchPeriod}
              onChange={handleChange}>
              <option value="전반">전반</option>
              <option value="후반">후반</option>
              <option value="3">3Q</option>
              <option value="4">4Q</option>
            </select>
          </div>
          <div className={ss.additional_info}>
            <input
              className={ss.input_item}
              type="number"
              value={playtime}
              onChange={handlePlaytimeChange}
              placeholder="출전시간(단위:분)"
            />
            <input
              className={ss.input_item}
              style={{ width: "300px" }}
              type="text"
              value={videoUrl}
              onChange={handleVideoUrlChange}
              placeholder="https://www.youtube.com/watch?..."
            />
            {!isMobile && (
              <>
                <button
                  className={ss.btn}
                  onClick={() => {
                    saveMatchResult();
                  }}>
                  SAVE
                </button>
                {matchId && (
                  <button
                    className={ss.btn}
                    onClick={() => handleDelete()}>
                    DELETE
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
      <div className={ss.title}>
        {title && (
          <h3>{` vs ${title} (${matchDate}, ${matchPeriod})`}</h3>
        )}
        {videoUrl && (
          <div>
            <a
              href={videoUrl}
              target="_blank" // 새 창에서 링크 열기
              rel="noopener noreferrer" // 보안 설정
              className={ss.video_url} // 아이콘 스타일 설정
            >
              <FaYoutube />
            </a>
          </div>
        )}
      </div>
      <div className={ss.dashboard}>
        <div className={ss.chart_group}>
          <div className={ss.chart_item}>
            <RadarChart
              playerState={state}
              playerName={playerName}
            />
          </div>
          <div className={ss.chart_item}>
            <DoughnutChart
              labels={[
                "전진 패스",
                "사이드 패스",
                "백 패스",
              ]}
              dataValues={_.values(
                _.pick(state, [
                  "forwardPass",
                  "sidePass",
                  "backPass",
                ])
              )}
              title="패스 구성"
              centerTitle="패스 성공률"
              centerValue={`${passSuccessRate}%`}
            />
          </div>
        </div>
        <div className={ss.value_group}>
          <DashboardItem
            title="평점"
            value={overallRating}
            subTitle="10점 만점"
          />
          <DashboardItem
            title="공격력"
            value={attackingScore}
            subTitle="100점 만점"
          />
          <DashboardItem
            title="볼 터치수"
            value={ballTouches}
          />
          <DashboardItem
            title="패스 시도"
            value={passTries}
          />
          <DashboardItem
            title="패스 성공률"
            value={passSuccessRate}
            suffix="%"
          />
          <DashboardItem
            title="키패스"
            value={state["keyPass"]}
          />
          <DashboardItem
            title="어시스트"
            value={state["assist"]}
          />
          <DashboardItem
            title="슛"
            value={state["shot"]}
          />
          <DashboardItem
            title="골"
            value={state["goal"]}
          />
          <DashboardItem
            title="인터셉트"
            value={state["intercept"]}
          />
          <DashboardItem
            title="적극성"
            value={
              state["intercept"] +
              state["successfulDuel"] +
              state["failedDuel"]
            }
          />
          <DashboardItem
            title="턴 오버"
            value={state["turnover"]}
            isBad={true}
          />
        </div>
      </div>
      <div className={ss.controller}>
        <div className={ss.stat_group}>
          <h3>패스</h3>
          <StatItem
            title="Forward Passes"
            stateKey="forwardPass"
            incrementType="INCREMENT_FORWARD_PASS"
            decrementType="DECREMENT_FORWARD_PASS"
          />
          <StatItem
            title="Side Passes"
            stateKey="sidePass"
            incrementType="INCREMENT_SIDE_PASS"
            decrementType="DECREMENT_SIDE_PASS"
          />
          <StatItem
            title="Back Passes"
            stateKey="backPass"
            incrementType="INCREMENT_BACK_PASS"
            decrementType="DECREMENT_BACK_PASS"
          />
          <StatItem
            title="Failed Passes"
            stateKey="failedPass"
            incrementType="INCREMENT_FAILED_PASS"
            decrementType="DECREMENT_FAILED_PASS"
          />
        </div>
        <div className={ss.stat_group}>
          <h3>공격력</h3>
          <StatItem
            title="Assists"
            stateKey="assist"
            incrementType="INCREMENT_ASSIST"
            decrementType="DECREMENT_ASSIST"
          />
          <StatItem
            title="Goals"
            stateKey="goal"
            incrementType="INCREMENT_GOAL"
            decrementType="DECREMENT_GOAL"
          />
          <StatItem
            title="Shots"
            stateKey="shot"
            incrementType="INCREMENT_SHOT"
            decrementType="DECREMENT_SHOT"
          />
          <StatItem
            title="Shot On Target"
            stateKey="shotOnTarget"
            incrementType="INCREMENT_SHOT_ON_TARGET"
            decrementType="DECREMENT_SHOT_ON_TARGET"
          />
          <StatItem
            title="Key Passes"
            stateKey="keyPass"
            incrementType="INCREMENT_KEY_PASS"
            decrementType="DECREMENT_KEY_PASS"
          />
        </div>
        <div className={ss.stat_group}>
          <h3>드리블</h3>
          <StatItem
            title="Success Dribbles"
            stateKey="dribble"
            incrementType="INCREMENT_DRIBBLE"
            decrementType="DECREMENT_DRIBBLE"
          />
          <StatItem
            title="Failed Dribbles"
            stateKey="failedDribble"
            incrementType="INCREMENT_FAILED_DRIBBLE"
            decrementType="DECREMENT_FAILED_DRIBBLE"
          />
        </div>
        <div className={ss.stat_group}>
          <h3>집중력과 적극성</h3>
          <StatItem
            title="Interceptions"
            stateKey="intercept"
            incrementType="INCREMENT_INTERCEPT"
            decrementType="DECREMENT_INTERCEPT"
          />
          <StatItem
            title="Pressure"
            stateKey="pressure"
            incrementType="INCREMENT_PRESSURE"
            decrementType="DECREMENT_PRESSURE"
          />
          <StatItem
            title="Successful Duels"
            stateKey="successfulDuel"
            incrementType="INCREMENT_SUCCESSFUL_DUEL"
            decrementType="DECREMENT_SUCCESSFUL_DUEL"
          />
          <StatItem
            title="Failed Duels"
            stateKey="failedDuel"
            incrementType="INCREMENT_FAILED_DUEL"
            decrementType="DECREMENT_FAILED_DUEL"
          />
          <StatItem
            title="Turnover"
            stateKey="turnover"
            incrementType="INCREMENT_TURNOVER"
            decrementType="DECREMENT_TURNOVER"
          />
        </div>
        <div className={ss.stat_group}>
          <h3>득점/실점 관리</h3>

          {/* 득점 수 */}
          <div className={ss.stat_item}>
            <div className={ss.stat_title}>득점</div>
            {!isMobile && (
              <button
                className={ss.stat_btn}
                onClick={() =>
                  handleRemoveGoal(
                    state.goalsScored.length - 1
                  )
                }
                disabled={state.goalsScored.length === 0}>
                -
              </button>
            )}
            <div className={ss.stat_value}>
              {state.goalsScored.length}
            </div>
            {!isMobile && (
              <button
                className={ss.stat_btn}
                onClick={() => setShowGoalInput(true)}>
                +
              </button>
            )}
          </div>

          {/* 득점 입력 */}
          {showGoalInput && (
            <div className={ss.input_group}>
              <input
                type="text"
                value={scorer}
                onChange={(e) => setScorer(e.target.value)}
                placeholder="득점 선수 이름"
              />
              <input
                type="text"
                value={assister}
                onChange={(e) =>
                  setAssister(e.target.value)
                }
                placeholder="도움 선수 이름"
              />
              <button
                className={ss.stat_btn}
                onClick={handleAddGoal}>
                ADD
              </button>
            </div>
          )}

          {/* 득점 리스트 */}
          {state.goalsScored?.length > 0 && (
            <div className={ss.goals_list}>
              {state.goalsScored.map((goal, index) => (
                <div
                  key={index}
                  className={ss.goal_item}>
                  {editIndex === index ? (
                    <div className={ss.input_group}>
                      <input
                        type="text"
                        value={editedScorer}
                        onChange={(e) =>
                          setEditedScorer(e.target.value)
                        }
                        placeholder="득점 선수 이름 수정"
                      />
                      <input
                        type="text"
                        value={editedAssister}
                        onChange={(e) =>
                          setEditedAssister(e.target.value)
                        }
                        placeholder="도움 선수 이름 수정"
                      />
                      <button
                        className={ss.stat_btn}
                        onClick={handleSaveEditedGoal}>
                        SAVE
                      </button>
                      <button
                        className={ss.stat_btn}
                        onClick={() => setEditIndex(null)}>
                        CANCEL
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{`G: ${goal.scorer} / A: ${goal.assister}`}</span>
                      <button
                        className={ss.btn}
                        onClick={() =>
                          handleRemoveGoal(index)
                        }>
                        -
                      </button>
                      <button
                        className={ss.btn}
                        onClick={() =>
                          handleEditGoal(index)
                        }>
                        EDIT
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 실점 관리 */}
          <StatItem
            title="실점"
            stateKey="goalsConceded"
            incrementType="INCREMENT_GOALS_CONCEDED"
            decrementType="DECREMENT_GOALS_CONCEDED"
          />
        </div>
      </div>
    </div>
  );
};

export default SoccerStatInput;
