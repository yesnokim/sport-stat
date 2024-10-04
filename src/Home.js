import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import ss from "./Home.module.scss";
import Main from "./pages/Main/Main";
import SoccerStat from "./pages/SoccerStat/SoccerStat";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className={ss.bg}>
            <div className={ss.menu}>
                <div className={ss.menu_item} onClick={() => navigate("/")}>Home</div>
                <div className={ss.menu_item} onClick={() => navigate("/soccer-stat")}>Soccer Stat</div>
            </div>
            <div className={ss.contents}>
                <div>
                    <Routes>
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