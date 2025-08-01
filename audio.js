// 音声管理クラス
class AudioManager {
    constructor() {
        this.sounds = {};
        this.bgm = null;
        this.volume = 0.3;
        this.init();
    }

    // 音声の初期化
    init() {
        // 効果音の作成
        this.createJumpSound();
        this.createCoinSound();
        this.createEnemySound();
        this.createGameOverSound();
        this.createBGM();
    }

    // ジャンプ音の作成
    createJumpSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(this.volume * 0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        this.sounds.jump = { oscillator, gainNode, context: audioContext };
    }

    // コイン音の作成
    createCoinSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(this.volume * 0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        this.sounds.coin = { oscillator, gainNode, context: audioContext };
    }

    // 敵を倒した音の作成
    createEnemySound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(this.volume * 0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        this.sounds.enemy = { oscillator, gainNode, context: audioContext };
    }

    // ゲームオーバー音の作成
    createGameOverSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(this.volume * 0.6, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        this.sounds.gameOver = { oscillator, gainNode, context: audioContext };
    }

    // BGMの作成（ループする簡単なメロディー）
    createBGM() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A音
        gainNode.gain.setValueAtTime(this.volume * 0.1, audioContext.currentTime);
        
        this.bgm = { oscillator, gainNode, context: audioContext, isPlaying: false };
    }

    // ジャンプ音を再生
    playJump() {
        if (this.sounds.jump) {
            const sound = this.sounds.jump;
            const oscillator = sound.context.createOscillator();
            const gainNode = sound.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(sound.context.destination);
            
            oscillator.frequency.setValueAtTime(400, sound.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, sound.context.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(this.volume * 0.5, sound.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, sound.context.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(sound.context.currentTime + 0.1);
        }
    }

    // コイン音を再生
    playCoin() {
        if (this.sounds.coin) {
            const sound = this.sounds.coin;
            const oscillator = sound.context.createOscillator();
            const gainNode = sound.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(sound.context.destination);
            
            oscillator.frequency.setValueAtTime(800, sound.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, sound.context.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(this.volume * 0.3, sound.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, sound.context.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(sound.context.currentTime + 0.1);
        }
    }

    // 敵を倒した音を再生
    playEnemy() {
        if (this.sounds.enemy) {
            const sound = this.sounds.enemy;
            const oscillator = sound.context.createOscillator();
            const gainNode = sound.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(sound.context.destination);
            
            oscillator.frequency.setValueAtTime(200, sound.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, sound.context.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(this.volume * 0.4, sound.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, sound.context.currentTime + 0.2);
            
            oscillator.start();
            oscillator.stop(sound.context.currentTime + 0.2);
        }
    }

    // ゲームオーバー音を再生
    playGameOver() {
        if (this.sounds.gameOver) {
            const sound = this.sounds.gameOver;
            const oscillator = sound.context.createOscillator();
            const gainNode = sound.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(sound.context.destination);
            
            oscillator.frequency.setValueAtTime(300, sound.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(150, sound.context.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(this.volume * 0.6, sound.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, sound.context.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(sound.context.currentTime + 0.5);
        }
    }

    // BGMを開始
    startBGM() {
        if (this.bgm && !this.bgm.isPlaying) {
            this.bgm.oscillator.start();
            this.bgm.isPlaying = true;
        }
    }

    // BGMを停止
    stopBGM() {
        if (this.bgm && this.bgm.isPlaying) {
            this.bgm.oscillator.stop();
            this.bgm.isPlaying = false;
        }
    }

    // 音量を設定
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
}

// グローバルな音声マネージャーのインスタンスを作成
const audioManager = new AudioManager(); 