import { addScore, getScore } from "./CountScore.js";
import { sizes } from "./Sizes.js";

// 要素を取得
const canvas = document.getElementById('canvas');

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
            preload: preload,
            create: create,
            update: update
        }
    };

    const game = new Phaser.Game(config);

    function preload() { }

    function create() {
        // 箱を描画
        const graphics = this.add.graphics();
        graphics.fillStyle(0xFFFFFF, 1);

        // 壁の定義
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

        // Matter.jsの物体としての壁を追加
        this.matter.add.rectangle(underWallConfig.x, underWallConfig.y, underWallConfig.width, underWallConfig.height, { isStatic: true });
        this.matter.add.rectangle(leftWallConfig.x, leftWallConfig.y, leftWallConfig.width, leftWallConfig.height, { isStatic: true });
        this.matter.add.rectangle(rightWallConfig.x, rightWallConfig.y, rightWallConfig.width, rightWallConfig.height, { isStatic: true });

        // Phaserのグラフィックスでの壁を描画
        let wallGraphics = this.add.graphics();
        wallGraphics.fillStyle(0x00FFFF, 1);
        wallGraphics.fillRect(0, underWallConfig.y, underWallConfig.width, underWallConfig.height);
        wallGraphics.fillRect(0, 0, leftWallConfig.width, leftWallConfig.height);
        wallGraphics.fillRect(rightWallConfig.x, 0, rightWallConfig.width, rightWallConfig.height);

        this.input.on('pointerdown', (pointer) => {
            if (pointer.y < config.height / 2 - 200) {
                createBall(this, pointer.x, pointer.y);
            }
        });

        // 新しいサイズを取得する関数
        function getNextSize(size) {
            const index = sizes.indexOf(size);
            let nextSize = null;
            if (index < sizes.length - 1) {
                nextSize = sizes[index + 1];
            }
            return nextSize;
        }

        function handleCollision(bodyA, bodyB) {

            // 同じサイズのボール同士の衝突時に、新しいボールを一つだけ作成。
            if (bodyA && bodyB && bodyA.circleRadius === bodyB.circleRadius) {

                const newSize = getNextSize(bodyA.circleRadius);

                if (newSize && newSize <= sizes[sizes.length - 1]) {

                    // 衝突点から方向ベクトルを取得
                    const collisionNormal = Matter.Vector.normalise({
                        x: bodyA.position.x - bodyB.position.x,
                        y: bodyA.position.y - bodyB.position.y
                    });

                    // 方向ベクトルから空いている位置を計算  
                    const offset = 5;
                    const x = bodyB.position.x + (collisionNormal.x * offset);
                    const y = bodyB.position.y + (collisionNormal.y * offset);

                    // その位置に新しいボールを作成
                    createBall(this, x, y, newSize);

                    // 衝突したボールを消す。描画と物体の両方を消す必要がある。
                    bodyA.gameObject.destroy();
                    bodyB.gameObject.destroy();
                    this.matter.world.remove(bodyA);
                    this.matter.world.remove(bodyB);
                } else if (bodyA.circleRadius === sizes[sizes.length - 1] && bodyB.circleRadius === sizes[sizes.length - 1]) {
                    bodyA.gameObject.destroy();
                    bodyB.gameObject.destroy();
                    this.matter.world.remove(bodyA);
                    this.matter.world.remove(bodyB);
                }
            }

        }

        // 衝突時には、handleCollision関数を呼び出し、AとBの物体を消す。
        this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
            handleCollision.call(this, bodyA, bodyB);
        });
    }

    function createBall(scene, x, y, size) {
        const colorsSizes = {
            0xFF0000: sizes[0],  // 赤
            0x0000FF: sizes[1],  // 青
            0xFFFF00: sizes[2],  // 黄
            0x800080: sizes[3],  // 紫
            0x808080: sizes[4]   // 灰
        };

        const colors = Object.keys(colorsSizes);
        const getKeyByValue = (object, value) => Object.keys(object).find(key => object[key] === value);
        const randomColor = size ? getKeyByValue(colorsSizes, size) : colors[Math.floor(Math.random() * colors.length)];

        // サイズを指定していない場合は最初のサイズを使用
        if (!size) {
            size = randomColor ? colorsSizes[randomColor] : sizes[0];
        }

        // Matter.jsでの物体定義
        const ball = scene.matter.add.circle(x, y, size, {
            restitution: 0.8,
            friction: 0.01,
            density: 0.04
        });

        // Phaserのグラフィックスでの描画
        const graphics = scene.add.graphics();
        graphics.fillStyle(randomColor, 1);
        graphics.fillCircle(x, y, size);

        ball.gameObject = graphics;
        ball.gameObject.setInteractive();

        // Matter.jsの物体の位置を使用してグラフィックスを再描画
        scene.matter.world.on('beforeupdate', () => {
            if (ball.gameObject) {
                ball.gameObject.clear();
                ball.gameObject.fillStyle(randomColor, 1);
                ball.gameObject.fillCircle(ball.position.x, ball.position.y, size);
            }
        });

        addScore(size);
        console.log(`Score: ${getScore()}`);
    }

    function update() { }

}

ball_game();