// Audio Synthesizer Engine using Web Audio API & Web Speech API

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicInterval: number | null = null;
  private musicVolume = 0.8;
  private isMuted = false;
  private isSpeechEnabled = true;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.masterGain.gain.value = this.isMuted ? 0 : 1;
      this.musicGain.gain.value = this.musicVolume;
      this.sfxGain.gain.value = 1.0;

      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 1;
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGain) {
      this.musicGain.gain.value = this.musicVolume;
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  // --- BACKGROUND MUSIC SYNTHESIZER ---
  // Cheerful, loud, kindergarten pentatonic marimba tune
  public startBGM() {
    this.initContext();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    // Pentatonic scale (C4, D4, E4, G4, A4, C5, D5, E5)
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
    const bassScale = [130.81, 146.83, 164.81, 196.00];

    const melodyPattern = [
      0, 2, 4, 3, 2, 0, 4, 5,
      4, 2, 0, 1, 2, 4, 3, 2,
      5, 4, 2, 3, 5, 6, 7, 5,
      4, 2, 0, 2, 4, 2, 0, 0
    ];

    let step = 0;

    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || !this.isMusicPlaying || !this.musicGain) return;

      const now = this.ctx.currentTime;
      const noteFreq = scale[melodyPattern[step % melodyPattern.length]];
      const bassFreq = bassScale[(Math.floor(step / 4)) % bassScale.length];

      // Lead Marimba / Kalimba sound
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(noteFreq, now);

      noteGain.gain.setValueAtTime(0.25, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(noteGain);
      noteGain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 0.3);

      // Warm Bass Synth
      if (step % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGainNode = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGainNode.gain.setValueAtTime(0.2, now);
        bassGainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        bassOsc.connect(bassGainNode);
        bassGainNode.connect(this.musicGain);

        bassOsc.start(now);
        bassOsc.stop(now + 0.42);
      }

      step++;
    }, 280); // ~107 BPM bouncy march tempo
  }

  public stopBGM() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // --- SOUND EFFECTS ---
  // 1. Success Chime ("Ting ting! Bạn thật xuất sắc!")
  public playTingTing() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;

    // Double bright bell chime (E5 -> B5 -> E6)
    const notes = [659.25, 987.77, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.4, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.45);
    });

    // Twinkle shimmer
    setTimeout(() => {
      this.playTwinkle();
    }, 150);
  }

  // 2. Gentle wrong sound ("Ồ ồ! Chưa đúng rồi!")
  public playWrongBoing() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;

    // Friendly cartoon "boing" wobble (downward pitch bend, soft)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.3);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.38);

    // Second soft tone
    setTimeout(() => {
      if (!this.ctx || !this.sfxGain) return;
      const t2 = this.ctx.currentTime;
      const osc2 = this.ctx.createOscillator();
      const g2 = this.ctx.createGain();

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(196, t2);
      osc2.frequency.exponentialRampToValueAtTime(130, t2 + 0.3);

      g2.gain.setValueAtTime(0.3, t2);
      g2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.35);

      osc2.connect(g2);
      g2.connect(this.sfxGain);

      osc2.start(t2);
      osc2.stop(t2 + 0.38);
    }, 120);
  }

  // 3. Pick up / drag pop
  public playPop() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // 4. Twinkle sparkle
  public playTwinkle() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const freqs = [1046.50, 1318.51, 1567.98, 2093.00];
    freqs.forEach((freq, idx) => {
      const now = this.ctx!.currentTime + idx * 0.05;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now);
      osc.stop(now + 0.22);
    });
  }

  // 5. Victory Applause & Fanfare
  public playVictoryFanfare() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const fanfareNotes = [523.25, 659.25, 783.99, 1046.50];

    fanfareNotes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.4, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.65);
    });
  }

  // --- VIETNAMESE VOICE NARRATION (SPEECH SYNTHESIS) ---
  public speakVietnamese(text: string) {
    if (!this.isSpeechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop current speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.92; // Slightly slower for kindergarten comprehension
      utterance.pitch = 1.2; // Cheerful, higher pitch for friendly hero tone
      utterance.volume = 1.0;

      // Find Vietnamese voice if available
      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VI'));
      if (viVoice) {
        utterance.voice = viVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Fallback silently if speech synthesis fails
    }
  }

  public toggleSpeech(): boolean {
    this.isSpeechEnabled = !this.isSpeechEnabled;
    if (!this.isSpeechEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return this.isSpeechEnabled;
  }

  public getSpeechEnabled(): boolean {
    return this.isSpeechEnabled;
  }
}

export const soundEngine = new SoundEngine();
