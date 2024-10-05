import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import ss from "./RadarChart.module.scss"

// Chart.js 요소들을 등록
ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const MAX_BALL_TOUCHES = 30;
const MAX_KEY_PASSES = 5;
const MAX_ATTACK_POINTS = 5;
const MAX_ENGAGEMENTS = 10;

const RadarChart = ({ playerState, playerName = "Player 1" }) => {

    const calculateDerivedValues = (state) => {
        const passSuccess = state["forwardPass"] + state["sidePass"] + state["backPass"];
        const passTries = passSuccess + state["failedPass"];
        const passSuccessRate = (passSuccess * 100 / passTries).toFixed(2);
        const ballTouches = passTries + state["shot"] + state["dribble"] + state["failedDribble"] + state["successfulDuel"];

        return {
            "공격력": ((state["shot"] + state["assist"]) / MAX_ATTACK_POINTS).toFixed(2) * 100,
            "패스 성공률": passSuccessRate,
            "키패스": (state["keyPass"] / MAX_KEY_PASSES).toFixed(2) * 100,
            "볼 터치수": (ballTouches / MAX_BALL_TOUCHES).toFixed(2) * 100,
            "적극성과 집중력": ((state["intercept"] + state["successfulDuel"] + state["failedDuel"]) / MAX_ENGAGEMENTS).toFixed(2) * 100,
            "볼 키핑능력": ((ballTouches - state["turnover"]) / ballTouches).toFixed(2) * 100,
        };
    };


    // Radar 차트에서 사용할 labels와 values 추출
    const generateLabelsAndValues = (state) => {
        const derivedValues = calculateDerivedValues(state);
        const labels = Object.keys(derivedValues); // 자동으로 label 생성
        const values = Object.values(derivedValues); // 자동으로 value 생성

        return { labels, values };
    };

    const { labels, values } = generateLabelsAndValues(playerState);

    // Radar chart 구성
    const data = {
        labels: labels, // 자동 생성된 labels 사용
        datasets: [
            {
                label: playerName,
                data: values, // 자동 생성된 values 사용
                backgroundColor: 'rgba(34, 202, 236, 0.2)',
                borderColor: 'rgba(34, 202, 236, 1)',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        scales: {
            r: {
                suggestedMin: 0,
                suggestedMax: 100, // 값의 최대 범위 설정
                ticks: {
                    beginAtZero: true,
                },
            },
        },
    };

    if (!data) return null

    return (
        <div className={ss.bg}>
            <Radar data={data} options={options} />
        </div>
    );
};

export default RadarChart;
