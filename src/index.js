import { addScore, getScore } from "./CountScore.js";
import { sizes } from "./Sizes.js";

const addRectangle = (matter, { x, y, width, height }, options) => {
    matter.add.rectangle(x, y, width, height, options);
};

const drawRect = (graphics, { x, y, width, height }) => {
    graphics.fillRect(x - width / 2, y - height / 2, width, height);
};

const removeBalls = (scene, bodyA, bodyB) => {
    bodyA.gameObject.destroy();
    bodyB.gameObject.destroy();
    scene.matter.world.remove(bodyA);
    scene.matter.world.remove(bodyB);
};

let nextBallSize = sizes[Math.floor(Math.random() * 5)];

const createBall = (scene, x, y, newSize) => {
    const colorsSizes = {
        0xFF0000: sizes[0], // 赤
        0x0000FF: sizes[1], // 青
        0xFFFF00: sizes[2], // 黄
        0x800080: sizes[3], // 紫
        0x808080: sizes[4], // 灰
        0x00FFFF: sizes[5], // 水色
        0xFFA500: sizes[6], // オレンジ
        0x00FF00: sizes[7], // 緑
        0xFFC0CB: sizes[8], // ピンク
        0xFFFDD0: sizes[9], // クリーム色
        0xFF7F50: sizes[10] // コーラル
    };

    // ０～５までの乱数を生成。
    const randomSize = newSize || nextBallSize;
    console.log("randomSize:" + randomSize);
    // サイズに基づいて対応する色を検索。
    // colorsSizes オブジェクトが一意のサイズに対して一意の色を持っていることが前提。
    const randomColorKey = Object.keys(colorsSizes).find(key => colorsSizes[key] === randomSize);
    console.log("randomColorKey:" + randomColorKey);
    // カラーコードを数値に変換。
    const colorValue = parseInt(randomColorKey, 16);
    console.log(colorValue);
    console.log("colorValue:" + colorValue);

    const matter = scene.matter;
    const ball = matter.add.circle(x, y, randomSize, {
        restitution: 0.8,
        friction: 0.01,
        density: 0.04,
    });
    ball.size = randomSize;

    const graphics = scene.add.graphics();
    graphics.fillStyle(colorValue, 1);
    graphics.fillCircle(x, y, randomSize);

    ball.gameObject = graphics;
    // ball.gameObject.setInteractive();

    scene.matter.world.on('beforeupdate', () => {
        if (ball.gameObject) {
            ball.gameObject.clear();
            ball.gameObject.fillStyle(colorValue, 1);
            ball.gameObject.fillCircle(ball.position.x, ball.position.y, randomSize);
        }
    });

    nextBallSize = sizes[Math.floor(Math.random() * 5)];
    console.log("次に出るボールのサイズ:" + nextBallSize);
    console.log("次に出るボールの色" + colorValue);

    addScore(randomSize);
    console.log(`Score: ${getScore()}`);
};

const getNextSize = (randomSize) => {
    const index = sizes.indexOf(randomSize);
    let nextSize = null;
    if (index < sizes.length - 1) {
        nextSize = sizes[index + 1];
    }
    return nextSize;
};

const createNewBall = (scene, bodyA, bodyB, newSize) => {
    const collisionNormal = Matter.Vector.normalise({
        x: bodyA.position.x - bodyB.position.x,
        y: bodyA.position.y - bodyB.position.y
    });

    const offset = 5;
    const x = bodyB.position.x + (collisionNormal.x * offset);
    const y = bodyB.position.y + (collisionNormal.y * offset);

    createBall(scene, x, y, newSize);

    removeBalls(scene, bodyA, bodyB);
};

const handleCollision = (scene, bodyA, bodyB) => {
    if (bodyA && bodyB && bodyA.size === bodyB.size) {
        const newSize = getNextSize(bodyA.size);

        if (newSize && newSize <= sizes[sizes.length - 1]) {
            createNewBall(scene, bodyA, bodyB, newSize);
        } else if (bodyA.size === sizes[sizes.length - 1] && bodyB.size === sizes[sizes.length - 1]) {
            removeBalls(scene, bodyA, bodyB);
        } else {
            removeBalls(scene, bodyA, bodyB);
        }
    }
};

const ball_game = () => {

    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        physics: {
            default: 'matter',
            matter: {
                gravity: { y: 1 },
                debug: false
            }
        },
        scene: {
            preload: () => { },
            create: function create() {
                // graphicsを定義
                const graphics = this.add.graphics();
                graphics.fillStyle(0xFFFFFF, 1);

                const underWallConfig = {
                    x: config.width / 2,
                    y: config.height - 10,
                    width: config.width,
                    height: 20
                };
                const leftWallConfig = {
                    x: 10,
                    y: config.height / 2,
                    width: 20,
                    height: config.height
                };
                const rightWallConfig = {
                    x: config.width - 10,
                    y: config.height / 2,
                    width: 20,
                    height: config.height
                };

                addRectangle(this.matter, underWallConfig, { isStatic: true });
                addRectangle(this.matter, leftWallConfig, { isStatic: true });
                addRectangle(this.matter, rightWallConfig, { isStatic: true });

                const wallGraphics = this.add.graphics();
                wallGraphics.fillStyle(0x00FFFF, 1);
                drawRect(wallGraphics, underWallConfig);
                drawRect(wallGraphics, leftWallConfig);
                drawRect(wallGraphics, rightWallConfig);

                this.input.on('pointerdown', (pointer) => {
                    if (pointer.y < config.height / 2 - 200) {
                        createBall(this, pointer.x, pointer.y);
                    }
                });

                this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
                    const { gameObject: gameObjectA } = bodyA;
                    const { gameObject: gameObjectB } = bodyB;

                    if (gameObjectA && gameObjectB) {
                        handleCollision(this, bodyA, bodyB);
                    }
                });
            },
            update: () => { }
        }
    };

    const game = new Phaser.Game(config);
}

ball_game();