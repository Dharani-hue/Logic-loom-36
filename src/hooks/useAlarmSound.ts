import { useCallback } from 'react';

export const useAlarmSound = () => {
  const playAlarm = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioContext.currentTime;

      // Create a series of ascending alarm tones
      const tones = [
        { freq: 450, start: now, duration: 0.2 },
        { freq: 550, start: now + 0.25, duration: 0.2 },
        { freq: 650, start: now + 0.5, duration: 0.2 },
        { freq: 750, start: now + 0.75, duration: 0.3 },
      ];

      tones.forEach(({ freq, start, duration }) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.frequency.value = freq;
        osc.type = 'sine';

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.02, start + duration);

        osc.start(start);
        osc.stop(start + duration);
      });
    } catch {
      console.warn('Audio context not available');
    }
  }, []);

  return { playAlarm };
};
