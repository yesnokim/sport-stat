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
const MAX_KEY_PASSES = 6;
const MAX_ATTACK_POINTS = 5;
const MAX_FORWARD_PASSES = 10;
const MAX_SHOTS = 5;

const RadarChart = ({ playerState, playerName = "Player 1" }) => {

    const calculateDerivedValues = (state) => {
        const passSuccess = state["forwardPass"] + state["sidePass"] + state["backPass"];
        const passTries = passSuccess + state["failedPass"];
        const passSuccessRate = (passSuccess / passTries).toFixed(2);
        const ballTouches = passTries + state["shot"] + state["dribble"] + state["failedDribble"] + state["successfulDuel"];

        const passSuccessWeight = 0.2;
        const keyPassWeight = 0.10;
        const attackPointWeight = 0.35;
        const shotWeight = 0.1;
        const forwardPassWeight = 0.25;

        // 각 지표의 정규화된 값과 가중치를 곱하여 합산
        const max_pass_score = state["keyPass"] > MAX_KEY_PASSES ? MAX_KEY_PASSES : state["keyPass"]
        const max_attpts_score = (state["assist"] + state["goal"]) > MAX_ATTACK_POINTS ? MAX_ATTACK_POINTS : (state["assist"] + state["goal"]);
        const max_shots_score = state["shot"] > MAX_SHOTS ? MAX_SHOTS : state["shot"]
        const max_fwdpass_score = state["forwardPass"] > MAX_FORWARD_PASSES ? MAX_FORWARD_PASSES : state["forwardPass"]

        const attackScore = (
            passSuccessRate * passSuccessWeight +
            (max_pass_score / MAX_KEY_PASSES) * keyPassWeight +
            (max_attpts_score / MAX_ATTACK_POINTS) * attackPointWeight +
            (max_shots_score / MAX_SHOTS) * shotWeight +
            (max_fwdpass_score / MAX_FORWARD_PASSES) * forwardPassWeight
        ) * 100; // 최종 점수를 100점 만점으로 환산


        // console.log(passSuccessRate, max_pass_score / MAX_KEY_PASSES, max_attpts_score / MAX_ATTACK_POINTS, max_shots_score / MAX_SHOTS, max_fwdpass_score / MAX_FORWARD_PASSES, attackScore)


        const keypass_ratio = (state["keyPass"] / MAX_KEY_PASSES).toFixed(2) * 100;
        const ball_touch_ratio = (ballTouches / MAX_BALL_TOUCHES).toFixed(2) * 100;
        const engagement_ratio = ((state["intercept"] + state["successfulDuel"]) / (state["intercept"] + state["successfulDuel"] + state["failedDuel"] + state["turnover"])).toFixed(2) * 100
        const ball_keeping_ratio = ((ballTouches - state["turnover"]) / ballTouches).toFixed(2) * 100;

        return {
            "공격력": attackScore.toFixed(2),
            "패스 성공률": passSuccessRate * 100,
            "키패스": keypass_ratio > 100 ? 100 : keypass_ratio,
            "볼 터치": ball_touch_ratio > 100 ? 100 : ball_touch_ratio,
            "적극성과 집중력": engagement_ratio > 100 ? 100 : engagement_ratio,
            "볼 키핑능력": ball_keeping_ratio > 100 ? 100 : ball_keeping_ratio,
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
