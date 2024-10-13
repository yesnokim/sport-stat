import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import LineChart from "../../components/LineChart/LineChart";
import MatchList from "../../components/MatchList/MatchList";
import SignOutButton from "../../components/SignOutButton/SignOutButton";
import { db } from "../../firebase";
import { DB_COLLECTION_NAME } from "../../utils/constants";
import ss from "./Main.module.scss";
import {
  getPlayStat,
  processData,
} from "../../utils/utils";
import MixedChart from "../../components/MixedChart/MixedChart";

const Main = () => {
  const [matchData, setMatchData] = useState([]);
  const [processedDate, setProcessedData] = useState([]);

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

  return (
    <div className={ss.bg}>
      <div className={ss.header}>
        <SignOutButton />
      </div>
      <div className={ss.contents}>
        <div className={ss.charts}>
          <div className={ss.title}>통계 (최근 10경기)</div>
          <div className={ss.chart}>
            {processedDate && (
              <MixedChart
                title="종합평가"
                data={processedDate}
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
                ]}
                labelsLine={["패스성공률"]}
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
            <LineChart
              title="적극성"
              data={processedDate}
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
                (row) =>
                  row.successfulDuel + row.failedDuel,
                (row) => {
                  return row.intercept;
                },
                (row) => row.shot,
              ]}
              labels={[
                "공격포인트",
                "경합",
                "인터셉트",
                "슛",
              ]}
            />
          </div>
        </div>
        <div className={ss.match_list}>
          <div className={ss.title}>경기목록 및 통계</div>
          <div className={ss.content}>
            <MatchList data={matchData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
