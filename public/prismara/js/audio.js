
class AudioEngine {
    constructor() {
        this.synth = window.speechSynthesis;
        this.ctx = null;
        this.ttsEnabled = true;
    }
    initContext() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    speak(text) {
        if (!this.ttsEnabled || !this.synth) return;
        this.synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.pitch = 1.1; u.rate = 0.95;
        this.synth.speak(u);
    }
    playTone(freq=440, type='sine', dur=0.2, vol=0.15) {
        try {
            this.initContext();
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = type; o.frequency.value = freq;
            g.gain.setValueAtTime(vol, this.ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
            o.connect(g); g.connect(this.ctx.destination);
            o.start(); o.stop(this.ctx.currentTime + dur);
        } catch(e) {}
    }
    playClick() { this.playTone(660, 'sine', 0.08, 0.08); }
    playSuccess() {
        this.playTone(523.25, 'triangle', 0.15);
        setTimeout(() => this.playTone(659.25, 'triangle', 0.15), 100);
        setTimeout(() => this.playTone(783.99, 'triangle', 0.28), 210);
    }
    playError() {
        this.playTone(220, 'sawtooth', 0.18, 0.1);
        setTimeout(() => this.playTone(196, 'sawtooth', 0.24, 0.1), 140);
    }
}
const audioSystem = new AudioEngine();
