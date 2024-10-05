import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import ss from "./Home.module.scss";
import Main from "./pages/Main/Main";
import SoccerStat from "./pages/SoccerStat/SoccerStat";
import ProfileImage from './components/ProfileImage/ProfileImage';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Login from './pages/Login/Login';

const Home = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();  // 컴포넌트 언마운트 시 구독 해제
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Login />
    }


    return (
        <div className={ss.bg}>
            <div className={ss.left_box}>
                <div className={ss.profile}>
                    <ProfileImage />
                </div>
                <div className={ss.menu}>
                    <div className={ss.menu_item} onClick={() => navigate("/")}>Home</div>
                    <div className={ss.menu_item} onClick={() => navigate("/soccer-stat")}>Enter stats</div>
                </div>
            </div>
            <div className={ss.contents}>
                <div>
                    <Routes>
                        <Route
                            path="/login"
                            element={user ? <Navigate to="/" /> : <Login />}
                        />
                        <Route path="/" element={<Main />} />
                        <Route path="/soccer-stat" element={<SoccerStat />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Home;