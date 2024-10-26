import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import BarChart from "../../components/BarChart/BarChart";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart";
import GoalScoreInfo from "../../components/GoalScoreInfo/GoalScoreInfo";
import LineChart from "../../components/LineChart/LineChart";
import MatchList, {
  COLUMN_DEFINITION_MATCH_RESULT,
  MATCH_COLUMN_TYPES,
} from "../../components/MatchList/MatchList";
import MixedChart from "../../components/MixedChart/MixedChart";
import RadarChart from "../../components/RadarChart/RadarChart";
import SignOutButton from "../../components/SignOutButton/SignOutButton";
import { db } from "../../firebase";
import { DB_COLLECTION_NAME } from "../../utils/constants";
import {
  calculateAttackingMidfielderScore,
  calculateOverallRating,
  getPlayStat,
  getTotalPasses,
  processData,
} from "../../utils/utils";
import ss from "./Main.module.scss";

const LOCAL_STORAGE_KEY_MATCH_LIST_TYPE =
  "main-local-match-list-type";
const MATCH_LIST_TYPES = {
  QUARTER: "quarter",
  GAME: "game",
};

const GAME_TO_SHOW = 10;

const Main = () => {
  const [matchData, setMatchData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [selectedMatchType, setSelectedMatchListType] =
    useState(
      localStorage.getItem(
        LOCAL_STORAGE_KEY_MATCH_LIST_TYPE
      ) || MATCH_LIST_TYPES.QUARTER
    );

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY_MATCH_LIST_TYPE,
      selectedMatchType
    );
  }, [selectedMatchType]);

  // Firestore에서 데이터를 불러오는 함수
  const fetchMatches = async () => {
    try {
      // 'matches' 컬렉션에서 match_date로 시간순 정렬
      const q = query(
        collection(db, DB_COLLECTION_NAME),
        orderBy("matchDate", "desc")
      );
      const querySnapshot = await getDocs(q);

      // Firestore에서 가져온 데이터를 배열로 변환
      const matchesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMatchData(matchesList);
      setProcessedData(processData(matchesList));
    } catch (error) {
      console.error("Error fetching matches: ", error);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 Firestore에서 데이터를 불러옴
  useEffect(() => {
    fetchMatches();
  }, []);

  const getMatchData = useCallback(() => {
    switch (selectedMatchType) {
      case MATCH_LIST_TYPES.GAME:
        return Array.isArray(processedData)
          ? [...processedData].reverse()
          : [];
      case MATCH_LIST_TYPES.QUARTER:
        return Array.isArray(matchData) ? matchData : [];
      default:
        return [];
    }
  }, [matchData, processedData, selectedMatchType]);

  const getMatchColumnDef = useCallback(() => {
    switch (selectedMatchType) {
      case MATCH_LIST_TYPES.GAME:
        return MATCH_COLUMN_TYPES.GAME;
      case MATCH_LIST_TYPES.QUARTER:
      default:
        return MATCH_COLUMN_TYPES.QUARTER;
    }
  }, [selectedMatchType]);

  return (
    <div className={ss.bg}>
      <div className={ss.header}>
        <SignOutButton />
      </div>
      <div className={ss.contents}>
        <div className={ss.charts}>
          <div className={ss.title}>
            종합평가 (최근 10경기)
          </div>
          <div className={ss.chart}>
            {processedData && (
              <BarChart
                title="종합평가"
                data={processedData?.slice(-10)}
                xAxisMobileFn={(row) => {
                  return row.title;
                }}
                xAxisFn={(row) => {
                  const timestamp = row.matchDate; // Firestore의 Timestamp 값
                  const date = timestamp.toDate(); // Timestamp를 JavaScript Date 객체로 변환
                  const month = (date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0"); // 월 (MM) 형식
                  const day = date
                    .getDate()
                    .toString()
                    .padStart(2, "0"); // 일 (DD) 형식
                  return `${month}/${day} ${row.title} ${row.matchPeriod}`;
                }}
                yAxisFns={[
                  (row) => {
                    const ovrRatings =
                      calculateOverallRating(row);
                    return ovrRatings;
                  },
                ]}
                labels={["평점"]}
              />
            )}
          </div>
          <div className={ss.chart}>
            {processedData && (
              <MixedChart
                data={processedData?.slice(-10)}
                xAxisMobileFn={(row) => {
                  return row.title;
                }}
                xAxisFn={(row) => {
                  const timestamp = row.matchDate; // Firestore의 Timestamp 값
                  const date = timestamp.toDate(); // Timestamp를 JavaScript Date 객체로 변환
                  const month = (date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0"); // 월 (MM) 형식
                  const day = date
                    .getDate()
                    .toString()
                    .padStart(2, "0"); // 일 (DD) 형식
                  return `${month}/${day} ${row.title} ${row.matchPeriod}`;
                }}
                yLineFns={[
                  (row) => {
                    const { passSuccessRate } =
                      getPlayStat(row);
                    return passSuccessRate;
                  },
                  (row) => {
                    const attackScore =
                      calculateAttackingMidfielderScore(
                        row
                      );
                    return attackScore;
                  },
                ]}
                labelsLine={["패스성공률", "공격능력"]}
                yBarFns={[
                  (row) => {
                    const { ballTouches } =
                      getPlayStat(row);
                    return ballTouches;
                  },
                  (row) => {
                    const { passTries } = getPlayStat(row);
                    return passTries;
                  },
                  (row) => row.forwardPass,
                  (row) => {
                    return row.keyPass;
                  },
                  (row) => row.turnover,
                ]}
                labelsBar={[
                  "볼터치횟수",
                  "패스횟수",
                  "전진패스",
                  "키패스",
                  "턴오버",
                ]}
              />
            )}
          </div>
          <div className={ss.chart}>
            <DoughnutChart
              labels={[
                "전진 패스",
                "사이드 패스",
                "백 패스",
                "패스 실패",
              ]}
              dataValues={_.values(
                _.pick(
                  getTotalPasses(processedData?.slice(-10)),
                  [
                    "forwardPass",
                    "sidePass",
                    "backPass",
                    "failedPass",
                  ]
                )
              )}
              centerTitle={`${GAME_TO_SHOW}경기 패스성공률`}
              centerValue={`${
                getTotalPasses(processedData?.slice(-10))
                  ?.passSuccessRate
              }%`}
            />
          </div>
          <div className={ss.chart}>
            <LineChart
              title="적극성"
              data={processedData?.slice(-10)}
              xAxisMobileFn={(row) => {
                return row.title;
              }}
              xAxisFn={(row) => {
                const timestamp = row.matchDate; // Firestore의 Timestamp 값
                const date = timestamp.toDate(); // Timestamp를 JavaScript Date 객체로 변환
                const month = (date.getMonth() + 1)
                  .toString()
                  .padStart(2, "0"); // 월 (MM) 형식
                const day = date
                  .getDate()
                  .toString()
                  .padStart(2, "0"); // 일 (DD) 형식
                return `${month}/${day} ${row.title} ${row.matchPeriod}`;
              }}
              yAxisFns={[
                (row) => {
                  const { attackPoints } = getPlayStat(row);
                  return attackPoints;
                },
                (row) => row.successfulDuel,
                (row) => {
                  return row.intercept;
                },
                (row) => row.shot,
              ]}
              labels={[
                "공격포인트",
                "경합성공",
                "인터셉트",
                "슛",
              ]}
            />
          </div>
        </div>
        <div className={ss.match_list}>
          <div className={ss.title_box}>
            <div className={ss.title}>경기별 상세 통계</div>
            <div className={ss.radio_buttons}>
              <label>
                <input
                  type="radio"
                  value={MATCH_LIST_TYPES.QUARTER}
                  checked={
                    selectedMatchType ===
                    MATCH_LIST_TYPES.QUARTER
                  }
                  onChange={() =>
                    setSelectedMatchListType(
                      MATCH_LIST_TYPES.QUARTER
                    )
                  }
                />
                세션별
              </label>

              <label>
                <input
                  type="radio"
                  value={MATCH_LIST_TYPES.GAME}
                  checked={
                    selectedMatchType ===
                    MATCH_LIST_TYPES.GAME
                  }
                  onChange={() =>
                    setSelectedMatchListType(
                      MATCH_LIST_TYPES.GAME
                    )
                  }
                />
                게임별
              </label>
            </div>
          </div>
          <div className={ss.content}>
            <MatchList
              data={getMatchData()}
              colDef={getMatchColumnDef()}
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
          <div className={ss.match_list}>
            <div className={ss.title_box}>
              <div className={ss.title}>
                경기결과 및 공격포인트
              </div>
            </div>
            <div className={ss.content}>
              <MatchList
                data={
                  Array.isArray(processedData)
                    ? [...processedData].reverse()
                    : []
                }
                colDef={COLUMN_DEFINITION_MATCH_RESULT}
                renderSubComponent={({ row }) => {
                  return (
                    <div className={ss.sub_render_row}>
                      <GoalScoreInfo
                        goalsScored={
                          row?.original?.goalsScored
                        }
                      />
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
