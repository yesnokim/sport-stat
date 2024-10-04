import { useReducer } from "react";
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
};

// reducer 함수 정의
function reducer(state, action) {
    switch (action.type) {
        case 'INCREMENT_FORWARD_PASS':
            return { ...state, forwardPass: state.forwardPass + 1 };
        case 'DECREMENT_FORWARD_PASS':
            return { ...state, forwardPass: state.forwardPass - 1 };

        case 'INCREMENT_SIDE_PASS':
            return { ...state, sidePass: state.sidePass + 1 };
        case 'DECREMENT_SIDE_PASS':
            return { ...state, sidePass: state.sidePass - 1 };

        case 'INCREMENT_BACK_PASS':
            return { ...state, backPass: state.backPass + 1 };
        case 'DECREMENT_BACK_PASS':
            return { ...state, backPass: state.backPass - 1 };

        case 'INCREMENT_FAILED_PASS':
            return { ...state, failedPass: state.failedPass + 1, turnover: state.turnover + 1 };
        case 'DECREMENT_FAILED_PASS':
            return { ...state, failedPass: state.failedPass - 1, turnover: state.turnover - 1 };

        case 'INCREMENT_KEY_PASS':
            return { ...state, keyPass: state.keyPass + 1 };
        case 'DECREMENT_KEY_PASS':
            return { ...state, keyPass: state.keyPass - 1 };

        case 'INCREMENT_ASSIST':
            return { ...state, assist: state.assist + 1, keyPass: state.keyPass + 1 };
        case 'DECREMENT_ASSIST':
            return { ...state, assist: state.assist - 1, keyPass: state.keyPass - 1 };

        case 'INCREMENT_GOAL':
            return { ...state, goal: state.goal + 1, shot: state.shot + 1 };
        case 'DECREMENT_GOAL':
            return { ...state, goal: state.goal - 1, shot: state.shot - 1 };

        case 'INCREMENT_DRIBBLE':
            return { ...state, dribble: state.dribble + 1 };
        case 'DECREMENT_DRIBBLE':
            return { ...state, dribble: state.dribble - 1 };

        case 'INCREMENT_FAILED_DRIBBLE':
            return { ...state, failedDribble: state.failedDribble + 1, turnover: state.turnover + 1 };
        case 'DECREMENT_FAILED_DRIBBLE':
            return { ...state, failedDribble: state.failedDribble - 1, turnover: state.turnover - 1 };

        case 'INCREMENT_SUCCESSFUL_DUEL':
            return { ...state, successfulDuel: state.successfulDuel + 1 };
        case 'DECREMENT_SUCCESSFUL_DUEL':
            return { ...state, successfulDuel: state.successfulDuel - 1 };

        case 'INCREMENT_FAILED_DUEL':
            return { ...state, failedDuel: state.failedDuel + 1 };
        case 'DECREMENT_FAILED_DUEL':
            return { ...state, failedDuel: state.failedDuel - 1 };

        case 'INCREMENT_SHOT':
            return { ...state, shot: state.shot + 1 };
        case 'DECREMENT_SHOT':
            return { ...state, shot: state.shot - 1 };

        case 'INCREMENT_INTERCEPT':
            return { ...state, intercept: state.intercept + 1 };
        case 'DECREMENT_INTERCEPT':
            return { ...state, intercept: state.intercept - 1 };

        case 'INCREMENT_SHOT_ON_TARGET':
            return { ...state, shotOnTarget: state.shotOnTarget + 1, shot: state.shot + 1 };
        case 'DECREMENT_SHOT_ON_TARGET':
            return { ...state, shotOnTarget: state.shotOnTarget - 1, shot: state.shot - 1 };

        default:
            return state;
    }
}


const SoccerStatInput = () => {

    const [state, dispatch] = useReducer(reducer, initialState);

    // 통계 UI 항목 컴포넌트
    const StatItem = ({ title, stateKey, incrementType, decrementType }) => (
        <div className={ss.stat_item}>

            <div className={ss.stat_title}>{title}</div>
            <button onClick={() => dispatch({ type: decrementType })}>-</button>
            <div className={ss.stat_value}>{state[stateKey]}</div>
            <button onClick={() => dispatch({ type: incrementType })}>+</button>

        </div>
    );

    const DashboardItem = ({ title, value, isBad }) => {
        return <div className={isBad ? [ss.item, ss.bad_item].join(" ") : ss.item}>
            <div className={ss.title}>{title}</div>
            <div className={ss.value}>{value}</div>
        </div>
    }

    const passSuccess = state["forwardPass"] + state["sidePass"] + state["backPass"];
    const passTries = passSuccess + state["failedPass"];
    const passSuccessRate = (passSuccess * 100 / passTries).toFixed(2)
    const ballTouches = passTries + state["shot"] + state["dribble"] + state["failedDribble"];


    return (
        <div className={ss.bg}>
            <div className={ss.dashboard}>
                <h3>통계</h3>
                <div className={ss.value_group}>
                    <DashboardItem title="볼 터치수" value={ballTouches} />
                    <DashboardItem title="패스 시도" value={passTries} />
                    <DashboardItem title="패스 성공률" value={passSuccessRate} />
                    <DashboardItem title="키패스" value={state["keyPass"]} />
                    <DashboardItem title="어시스트" value={state["assist"]} />
                    <DashboardItem title="슛" value={state["shot"]} />
                    <DashboardItem title="턴 오버" value={state["turnover"]} isBad={true} />
                    <DashboardItem title="인터셉트" value={state["intercept"]} />
                </div>
            </div>
            <div className={ss.controller}>
                <div className={ss.stat_group}>
                    <h3>PASS</h3>
                    <StatItem title="Forward Passes" stateKey="forwardPass" incrementType="INCREMENT_FORWARD_PASS" decrementType="DECREMENT_FORWARD_PASS" />
                    <StatItem title="Side Passes" stateKey="sidePass" incrementType="INCREMENT_SIDE_PASS" decrementType="DECREMENT_SIDE_PASS" />
                    <StatItem title="Back Passes" stateKey="backPass" incrementType="INCREMENT_BACK_PASS" decrementType="DECREMENT_BACK_PASS" />
                    <StatItem title="Failed Passes" stateKey="failedPass" incrementType="INCREMENT_FAILED_PASS" decrementType="DECREMENT_FAILED_PASS" />
                </div>
                <div className={ss.stat_group}>
                    <h3>기회창출</h3>
                    <StatItem title="Assists" stateKey="assist" incrementType="INCREMENT_ASSIST" decrementType="DECREMENT_ASSIST" />
                    <StatItem title="Goals" stateKey="goal" incrementType="INCREMENT_GOAL" decrementType="DECREMENT_GOAL" />
                    <StatItem title="Shots" stateKey="shot" incrementType="INCREMENT_SHOT" decrementType="DECREMENT_SHOT" />
                    <StatItem title="Shot On Target" stateKey="shotOnTarget" incrementType="INCREMENT_SHOT_ON_TARGET" decrementType="DECREMENT_SHOT_ON_TARGET" />
                    <StatItem title="Key Passes" stateKey="keyPass" incrementType="INCREMENT_KEY_PASS" decrementType="DECREMENT_KEY_PASS" />

                </div>
                <div className={ss.stat_group}>
                    <h3>DRIBBLE</h3>
                    <StatItem title="Success Dribbles" stateKey="dribble" incrementType="INCREMENT_DRIBBLE" decrementType="DECREMENT_DRIBBLE" />
                    <StatItem title="Failed Dribbles" stateKey="failedDribble" incrementType="INCREMENT_FAILED_DRIBBLE" decrementType="DECREMENT_FAILED_DRIBBLE" />
                </div>
                <div className={ss.stat_group}>
                    <h3>집중력과 적극성</h3>
                    <StatItem title="Interceptions" stateKey="intercept" incrementType="INCREMENT_INTERCEPT" decrementType="DECREMENT_INTERCEPT" />
                    <StatItem title="Successful Duels" stateKey="successfulDuel"
                        incrementType="INCREMENT_SUCCESSFUL_DUEL" decrementType="DECREMENT_SUCCESSFUL_DUEL" />
                    <StatItem title="Failed Duels" stateKey="failedDuel" incrementType="INCREMENT_FAILED_DUEL" decrementType="DECREMENT_FAILED_DUEL" />
                </div>
            </div>
        </div >
    );
}

export default SoccerStatInput