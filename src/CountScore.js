import { sizes } from "./Sizes.js";

let score = 0;

const scoreValues = {
    [sizes[0]]: 5,
    [sizes[1]]: 10,
    [sizes[2]]: 15,
    [sizes[3]]: 20,
    [sizes[4]]: 25,
    [sizes[5]]: 30,
    [sizes[6]]: 35,
    [sizes[7]]: 40,
    [sizes[8]]: 45,
    [sizes[9]]: 50,
    [sizes[10]]: 55
};

// ボールのサイズに基づいて点数を追加する関数
const addScore = (size) => {
    score += scoreValues[size];
};

// 現在のスコアを取得する関数
const getScore = () => score;

export { addScore, getScore };