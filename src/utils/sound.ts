import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

// Self-contained sound effects (synthesized WAVs bundled in assets/sounds).
// No network, no external dependencies beyond expo-audio.
export type SoundName = 'select' | 'correct' | 'timeup' | 'gameover';

const SOURCES: Record<SoundName, number> = {
  select: require('../../assets/sounds/select.wav'),
  correct: require('../../assets/sounds/correct.wav'),
  timeup: require('../../assets/sounds/timeup.wav'),
  gameover: require('../../assets/sounds/gameover.wav'),
};

let players: Partial<Record<SoundName, AudioPlayer>> = {};
let initialized = false;
let soundEnabled = true;

/**
 * Preload all sound players once. Safe to call multiple times.
 * Failures are swallowed — sound is non-essential, the game must keep working.
 */
export const initSounds = async (): Promise<void> => {
  if (initialized) return;
  initialized = true;
  try {
    // Allow sounds even when the device is in silent mode (party game).
    await setAudioModeAsync({ playsInSilentMode: true });
  } catch (error) {
    if (__DEV__) {
      console.warn('Failed to set audio mode:', error);
    }
  }
  (Object.keys(SOURCES) as SoundName[]).forEach((name) => {
    try {
      players[name] = createAudioPlayer(SOURCES[name]);
    } catch (error) {
      if (__DEV__) {
        console.warn(`Failed to load sound "${name}":`, error);
      }
    }
  });
};

export const setSoundEnabled = (enabled: boolean): void => {
  soundEnabled = enabled;
};

/**
 * Play a sound effect. Restarts from the beginning so rapid repeats work.
 * No-op when sounds are disabled or playback fails.
 */
export const playSound = (name: SoundName): void => {
  if (!soundEnabled) return;
  const player = players[name];
  if (!player) return;
  try {
    // Restart from the beginning so rapid repeats retrigger.
    void player.seekTo(0);
    player.play();
  } catch (error) {
    if (__DEV__) {
      console.warn(`Failed to play sound "${name}":`, error);
    }
  }
};

/** Release all players. Mainly for tests / teardown. */
export const releaseSounds = (): void => {
  (Object.keys(players) as SoundName[]).forEach((name) => {
    try {
      players[name]?.release();
    } catch {
      // ignore
    }
  });
  players = {};
  initialized = false;
};
