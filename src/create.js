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
}

export default create;