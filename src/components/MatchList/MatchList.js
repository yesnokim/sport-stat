import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import ss from "./MatchList.module.scss"
import { DB_COLLECTION_NAME } from '../../utils/constants';
import { formatDate, getPlayStat } from '../../utils/utils';

const MatchList = () => {
    const [matches, setMatches] = useState([]);

    // Firestore에서 데이터를 불러오는 함수
    const fetchMatches = async () => {
        try {
            // 'matches' 컬렉션에서 match_date로 시간순 정렬
            const q = query(collection(db, DB_COLLECTION_NAME), orderBy("matchDate", "desc"));
            const querySnapshot = await getDocs(q);

            // Firestore에서 가져온 데이터를 배열로 변환
            const matchesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setMatches(matchesList);

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
            <h2>Match List</h2>
            <table>
                <thead>
                    <tr>
                        <th>날짜</th>
                        <th>제목</th>
                        <th>쿼터</th>
                        <th>선수이름</th>
                        <th>볼터치</th>
                        <th>패스성공률</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map(match => {
                        const { passSuccessRate, ballTouches } = getPlayStat(match)
                        return <tr key={match.id}>
                            <td>{formatDate(match.matchDate)}</td>
                            <td>{match.title}</td>
                            <td>{match.matchPeriod}</td>
                            <td>{match.playerName}</td>
                            <td>{`${ballTouches}회`}</td>
                            <td>{`${passSuccessRate}%`}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default MatchList;