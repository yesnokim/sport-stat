import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SoccerStatInput from "../../components/SoccerStatInput/SoccerStatInput";
import { db } from "../../firebase";
import { formatDateDatetimeLocal } from "../../utils/utils";

const SoccerStat = () => {
  const location = useLocation();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = new URLSearchParams(location.search);
  const matchId = searchParams.get("matchId");

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const matchDoc = await getDoc(
          doc(db, "matches", matchId)
        ); // Firestore에서 matchId로 문서 가져오기
        if (matchDoc.exists()) {
          setMatchData(matchDoc.data()); // 문서 데이터를 상태에 저장
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [matchId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg">
      <SoccerStatInput
        matchId={matchId}
        initTitle={matchData?.title}
        initMatchDate={formatDateDatetimeLocal(
          matchData?.matchDate.toDate()
        )}
        initMatchPeriod={matchData?.matchPeriod}
        initVideoUrl={matchData?.videoUrl}
        initPlaytime={matchData?.playtime}
        matchData={matchData}
      />
    </div>
  );
};

export default SoccerStat;
