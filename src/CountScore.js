// CountScore.js
let score = 0;
const sizes = [20, 40, 80, 100, 120];

const scoreValues = {
    [sizes[0]]: 5,
    [sizes[1]]: 10,
    [sizes[2]]: 15,
    [sizes[3]]: 20,
    [sizes[4]]: 25
};

// ボールのサイズに基づいて点数を追加する関数
const addScore = (size) => {
    score += scoreValues[size];
    console.log(`Score: ${score}`);
};

// 現在のスコアを取得する関数
const getScore = () => score;

export { addScore, getScore };
