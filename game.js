// ゲームキャンバスの設定
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// キャンバスサイズの動的調整
function resizeCanvas() {
    const container = canvas.parentElement;
    const maxWidth = Math.min(800, container.clientWidth - 40);
    const maxHeight = Math.min(400, window.innerHeight * 0.4);
    
    canvas.style.width = maxWidth + 'px';
    canvas.style.height = (maxWidth * 0.5) + 'px';
}

// 初期サイズ設定
resizeCanvas();

// ウィンドウリサイズ時にキャンバスサイズを調整
window.addEventListener('resize', resizeCanvas);

// ゲーム状態
let gameState = {
    score: 0,
    lives: 3,
    coins: 0,
    gameOver: false,
    gameWon: false
};

// マリオの設定
const mario = {
    x: 50,
    y: 300,
    width: 30,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpPower: 15,
    onGround: false,
    direction: 1 // 1: 右, -1: 左
};

// プラットフォームの設定
const platforms = [
    { x: 0, y: 350, width: 800, height: 50 }, // 地面
    { x: 200, y: 250, width: 100, height: 20 },
    { x: 400, y: 200, width: 100, height: 20 },
    { x: 600, y: 150, width: 100, height: 20 },
    { x: 100, y: 100, width: 100, height: 20 }
];

// 敵の設定
const enemies = [
    { x: 400, y: 310, width: 25, height: 25, velocityX: -2, alive: true, initialX: 400 },
    { x: 600, y: 310, width: 25, height: 25, velocityX: 2, alive: true, initialX: 600 },
    { x: 750, y: 310, width: 25, height: 25, velocityX: -1, alive: true, initialX: 750 }
];

// コインの設定
const coins = [
    { x: 250, y: 200, width: 15, height: 15, collected: false },
    { x: 450, y: 150, width: 15, height: 15, collected: false },
    { x: 650, y: 100, width: 15, height: 15, collected: false },
    { x: 150, y: 50, width: 15, height: 15, collected: false },
    { x: 350, y: 300, width: 15, height: 15, collected: false }
];

// キー入力の管理
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// リスタートボタンのイベント
document.getElementById('restartButton').addEventListener('click', restartGame);

// 音量調整のイベント
document.getElementById('volumeSlider').addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audioManager.setVolume(volume);
});

// ミュートボタンのイベント
let isMuted = false;
document.getElementById('muteButton').addEventListener('click', () => {
    isMuted = !isMuted;
    const button = document.getElementById('muteButton');
    if (isMuted) {
        audioManager.setVolume(0);
        button.textContent = '🔇';
    } else {
        const volumeSlider = document.getElementById('volumeSlider');
        audioManager.setVolume(volumeSlider.value / 100);
        button.textContent = '🔊';
    }
});

// タッチ操作のイベント
document.getElementById('leftBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys['KeyA'] = true;
});

document.getElementById('leftBtn').addEventListener('touchend', (e) => {
    e.preventDefault();
    keys['KeyA'] = false;
});

document.getElementById('rightBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys['KeyD'] = true;
});

document.getElementById('rightBtn').addEventListener('touchend', (e) => {
    e.preventDefault();
    keys['KeyD'] = false;
});

document.getElementById('jumpBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys['Space'] = true;
});

document.getElementById('jumpBtn').addEventListener('touchend', (e) => {
    e.preventDefault();
    keys['Space'] = false;
});

// マウスクリックでも操作可能にする
document.getElementById('leftBtn').addEventListener('mousedown', () => {
    keys['KeyA'] = true;
});

document.getElementById('leftBtn').addEventListener('mouseup', () => {
    keys['KeyA'] = false;
});

document.getElementById('rightBtn').addEventListener('mousedown', () => {
    keys['KeyD'] = true;
});

document.getElementById('rightBtn').addEventListener('mouseup', () => {
    keys['KeyD'] = false;
});

document.getElementById('jumpBtn').addEventListener('mousedown', () => {
    keys['Space'] = true;
});

document.getElementById('jumpBtn').addEventListener('mouseup', () => {
    keys['Space'] = false;
});

// 衝突判定
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// マリオの更新
function updateMario() {
    // 左右移動
    if (keys['KeyA']) {
        mario.velocityX = -mario.speed;
        mario.direction = -1;
    } else if (keys['KeyD']) {
        mario.velocityX = mario.speed;
        mario.direction = 1;
    } else {
        mario.velocityX = 0;
    }

    // ジャンプ
    if (keys['Space'] && mario.onGround) {
        mario.velocityY = -mario.jumpPower;
        mario.onGround = false;
        audioManager.playJump(); // ジャンプ音を再生
    }

    // 重力
    mario.velocityY += 0.8;

    // 位置更新
    mario.x += mario.velocityX;
    mario.y += mario.velocityY;

    // 画面境界チェック
    if (mario.x < 0) mario.x = 0;
    if (mario.x + mario.width > canvas.width) mario.x = canvas.width - mario.width;

    // プラットフォームとの衝突チェック
    mario.onGround = false;
    for (let platform of platforms) {
        if (checkCollision(mario, platform)) {
            if (mario.velocityY > 0 && mario.y < platform.y) {
                mario.y = platform.y - mario.height;
                mario.velocityY = 0;
                mario.onGround = true;
            }
        }
    }

    // 地面に落ちた場合
    if (mario.y > canvas.height) {
        gameState.lives--;
        if (gameState.lives <= 0) {
            gameState.gameOver = true;
        } else {
            // リスポーン（敵から離れた位置）
            mario.x = 50;
            mario.y = 300;
            mario.velocityX = 0;
            mario.velocityY = 0;
        }
    }
}

// 敵の更新
function updateEnemies() {
    for (let enemy of enemies) {
        if (!enemy.alive) continue;

        enemy.x += enemy.velocityX;

        // 画面境界で方向転換
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            enemy.velocityX *= -1;
        }

        // マリオとの衝突チェック
        if (checkCollision(mario, enemy)) {
            if (mario.velocityY > 0 && mario.y < enemy.y) {
                // 敵を踏んだ
                enemy.alive = false;
                mario.velocityY = -10;
                gameState.score += 100;
                audioManager.playEnemy(); // 敵を倒した音を再生
            } else {
                // マリオがダメージを受けた
                gameState.lives--;
                if (gameState.lives <= 0) {
                    gameState.gameOver = true;
                } else {
                    // リスポーン（敵から離れた位置）
                    mario.x = 50;
                    mario.y = 300;
                    mario.velocityX = 0;
                    mario.velocityY = 0;
                }
            }
        }
    }
}

// コインの更新
function updateCoins() {
    for (let coin of coins) {
        if (!coin.collected && checkCollision(mario, coin)) {
            coin.collected = true;
            gameState.coins++;
            gameState.score += 50;
            audioManager.playCoin(); // コイン音を再生
        }
    }

    // 全てのコインを集めたかチェック
    if (gameState.coins >= coins.length) {
        gameState.gameWon = true;
    }
}

// 描画関数
function draw() {
    // 背景をクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // プラットフォームを描画
    ctx.fillStyle = '#8B4513';
    for (let platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    // マリオを描画
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(mario.x, mario.y, mario.width, mario.height);
    
    // マリオの帽子
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(mario.x + 5, mario.y - 5, 20, 10);
    
    // マリオの目
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(mario.x + 8, mario.y + 5, 4, 4);
    ctx.fillRect(mario.x + 18, mario.y + 5, 4, 4);

    // 敵を描画
    ctx.fillStyle = '#8B0000';
    for (let enemy of enemies) {
        if (enemy.alive) {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            // 敵の目
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(enemy.x + 5, enemy.y + 5, 3, 3);
            ctx.fillRect(enemy.x + 15, enemy.y + 5, 3, 3);
            ctx.fillStyle = '#8B0000';
        }
    }

    // コインを描画
    ctx.fillStyle = '#FFD700';
    for (let coin of coins) {
        if (!coin.collected) {
            ctx.beginPath();
            ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // UI更新
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('lives').textContent = gameState.lives;
    document.getElementById('coins').textContent = gameState.coins;
}

// ゲームオーバー画面の表示
let gameOverShown = false; // ゲームオーバー画面が表示済みかどうかのフラグ

function showGameOver() {
    if (gameOverShown) return; // 既に表示済みの場合は何もしない
    
    const overlay = document.getElementById('gameOverlay');
    const title = document.getElementById('overlayTitle');
    const message = document.getElementById('overlayMessage');

    if (gameState.gameWon) {
        title.textContent = 'クリア！';
        message.textContent = `おめでとうございます！スコア: ${gameState.score}`;
    } else {
        title.textContent = 'ゲームオーバー';
        message.textContent = `スコア: ${gameState.score}`;
        audioManager.playGameOver(); // ゲームオーバー音を再生
    }

    overlay.style.display = 'flex';
    gameOverShown = true; // フラグを立てる
}

// ゲームリスタート
function restartGame() {
    gameState = {
        score: 0,
        lives: 3,
        coins: 0,
        gameOver: false,
        gameWon: false
    };

    mario.x = 50;
    mario.y = 300;
    mario.velocityX = 0;
    mario.velocityY = 0;

    // 敵をリセット
    enemies.forEach(enemy => {
        enemy.alive = true;
        enemy.x = enemy.initialX; // 初期位置に戻す
    });

    // コインをリセット
    coins.forEach(coin => {
        coin.collected = false;
    });

    document.getElementById('gameOverlay').style.display = 'none';
    gameOverShown = false; // ゲームオーバー画面のフラグをリセット
}

// ゲームループ
function gameLoop() {
    if (!gameState.gameOver && !gameState.gameWon) {
        updateMario();
        updateEnemies();
        updateCoins();
        draw();
    } else {
        showGameOver();
    }

    requestAnimationFrame(gameLoop);
}

// ゲーム開始
audioManager.startBGM(); // BGMを開始
gameLoop(); 