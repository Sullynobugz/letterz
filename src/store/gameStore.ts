import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Settings, GameState, Player, Turn, SetupData } from '../types';
import { getAllLetters, validateAnswer } from '../utils/normalization';
import { calculatePoints } from '../utils/scoring';
import { playSound, setSoundEnabled as setSoundManagerEnabled } from '../utils/sound';

interface GameStore {
  settings: Settings;
  game: GameState;
  
  setLanguage: (language: Settings['language']) => void;
  setMode: (mode: Settings['mode']) => void;
  setTurnSeconds: (seconds: number) => void;
  setSkipHardLetters: (skip: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  
  startGame: (setup: SetupData) => void;
  selectLetter: (letter: string) => void;
  submitAnswer: (answer: string) => { success: boolean; error?: string };
  timeoutTurn: () => void;
  nextTurn: () => void;
  endGame: () => void;
  playAgain: () => void;
  
  tickTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  loadLastPlayers: () => Promise<string[]>;
  saveLastPlayers: (players: string[]) => Promise<void>;
}

let isLoadingSettings = false;

const defaultSettings: Settings = {
  language: 'en',
  mode: 'points',
  turnSeconds: 15,
  skipHardLetters: false,
  soundEnabled: true,
};

const defaultGame: GameState = {
  status: 'idle',
  category: '',
  players: [],
  availableLetters: [],
  usedLetters: [],
  currentPlayerIndex: 0,
  selectedLetter: null,
  turns: [],
  timerSecondsLeft: 0,
  timerRunning: false,
  timerPaused: false,
};

export const useGameStore = create<GameStore>((set, get) => ({
  settings: defaultSettings,
  game: defaultGame,
  
  setLanguage: (language) => {
    set((state) => ({ settings: { ...state.settings, language } }));
    get().saveSettings();
  },
  
  setMode: (mode) => {
    set((state) => ({ settings: { ...state.settings, mode } }));
    get().saveSettings();
  },
  
  setTurnSeconds: (seconds) => {
    set((state) => ({ settings: { ...state.settings, turnSeconds: seconds } }));
    get().saveSettings();
  },
  
  setSkipHardLetters: (skip) => {
    set((state) => ({ settings: { ...state.settings, skipHardLetters: skip } }));
    get().saveSettings();
  },

  setSoundEnabled: (enabled) => {
    set((state) => ({ settings: { ...state.settings, soundEnabled: enabled } }));
    setSoundManagerEnabled(enabled);
    get().saveSettings();
  },
  
  startGame: (setup) => {
    const { settings } = get();
    const players: Player[] = setup.playerNames.map((name, i) => ({
      id: `player-${i}-${Date.now()}`,
      name,
      score: 0,
      isOut: false,
    }));
    
    const availableLetters = getAllLetters(settings.skipHardLetters);
    
    set({
      game: {
        status: 'running',
        category: setup.category,
        players,
        availableLetters,
        usedLetters: [],
        currentPlayerIndex: 0,
        selectedLetter: null,
        turns: [],
        timerSecondsLeft: settings.turnSeconds,
        timerRunning: true,
        timerPaused: false,
      },
    });
  },
  
  selectLetter: (letter) => {
    playSound('select');
    set((state) => ({
      game: { ...state.game, selectedLetter: letter },
    }));
  },
  
  submitAnswer: (answer) => {
    const { game, settings } = get();
    const { selectedLetter, timerSecondsLeft } = game;
    
    if (!selectedLetter) {
      return { success: false, error: 'No letter selected' };
    }
    
    const trimmed = answer.trim();
    if (!trimmed) {
      return { success: false, error: 'emptyWord' };
    }
    
    if (!validateAnswer(trimmed, selectedLetter)) {
      return { success: false, error: 'invalidWord' };
    }
    
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) {
      return { success: false, error: 'No active player' };
    }
    const points = settings.mode === 'points'
      ? calculatePoints(timerSecondsLeft, settings.turnSeconds)
      : 0;
    
    const turn: Turn = {
      playerId: currentPlayer.id,
      letter: selectedLetter,
      answer: trimmed,
      points,
      timestamp: Date.now(),
    };
    
    set((state) => ({
      game: {
        ...state.game,
        availableLetters: state.game.availableLetters.filter(l => l !== selectedLetter),
        usedLetters: [...state.game.usedLetters, selectedLetter],
        turns: [...state.game.turns, turn],
        players: state.game.players.map((p, i) =>
          i === state.game.currentPlayerIndex
            ? { ...p, score: p.score + points }
            : p
        ),
        selectedLetter: null,
        timerRunning: false,
      },
    }));

    playSound('correct');

    setTimeout(() => {
      get().nextTurn();
    }, 300);

    return { success: true };
  },
  
  timeoutTurn: () => {
    const { game, settings } = get();
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) return;

    playSound('timeup');

    if (settings.mode === 'ko') {
      set((state) => ({
        game: {
          ...state.game,
          players: state.game.players.map((p, i) =>
            i === state.game.currentPlayerIndex ? { ...p, isOut: true } : p
          ),
          selectedLetter: null,
          timerRunning: false,
        },
      }));
    } else {
      set((state) => ({
        game: {
          ...state.game,
          selectedLetter: null,
          timerRunning: false,
        },
      }));
    }
    
    setTimeout(() => {
      const activePlayers = get().game.players.filter(p => !p.isOut);
      if (settings.mode === 'ko' && activePlayers.length <= 1) {
        get().endGame();
      } else {
        get().nextTurn();
      }
    }, 500);
  },
  
  nextTurn: () => {
    const { game, settings } = get();
    
    if (game.availableLetters.length === 0) {
      get().endGame();
      return;
    }
    
    const activePlayers = game.players.filter(p => !p.isOut);
    if (activePlayers.length <= 1 && settings.mode === 'ko') {
      get().endGame();
      return;
    }
    
    let nextIndex = (game.currentPlayerIndex + 1) % game.players.length;
    while (game.players[nextIndex].isOut && activePlayers.length > 1) {
      nextIndex = (nextIndex + 1) % game.players.length;
    }
    
    set((state) => ({
      game: {
        ...state.game,
        currentPlayerIndex: nextIndex,
        timerSecondsLeft: settings.turnSeconds,
        timerRunning: true,
        timerPaused: false,
        selectedLetter: null,
      },
    }));
  },
  
  endGame: () => {
    playSound('gameover');
    set((state) => ({
      game: {
        ...state.game,
        status: 'ended',
        timerRunning: false,
      },
    }));
  },
  
  playAgain: () => {
    const { game, settings } = get();
    const availableLetters = getAllLetters(settings.skipHardLetters);
    
    set({
      game: {
        ...game,
        status: 'running',
        players: game.players.map(p => ({ ...p, score: 0, isOut: false })),
        availableLetters,
        usedLetters: [],
        currentPlayerIndex: 0,
        selectedLetter: null,
        turns: [],
        timerSecondsLeft: settings.turnSeconds,
        timerRunning: true,
        timerPaused: false,
      },
    });
  },
  
  tickTimer: () => {
    const { game } = get();
    if (!game.timerRunning || game.status !== 'running' || game.timerPaused) return;
    
    const newSeconds = game.timerSecondsLeft - 1;
    
    if (newSeconds <= 0) {
      set((state) => ({
        game: { ...state.game, timerSecondsLeft: 0, timerRunning: false },
      }));
      get().timeoutTurn();
    } else {
      set((state) => ({
        game: { ...state.game, timerSecondsLeft: newSeconds },
      }));
    }
  },
  
  pauseTimer: () => {
    set((state) => ({
      game: { ...state.game, timerPaused: true },
    }));
  },
  
  resumeTimer: () => {
    set((state) => ({
      game: { ...state.game, timerPaused: false },
    }));
  },
  
  loadSettings: async () => {
    if (isLoadingSettings) return;
    isLoadingSettings = true;
    try {
      const stored = await AsyncStorage.getItem('letterz_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ settings: { ...defaultSettings, ...parsed } });
      } else {
        const { getDeviceLanguage } = await import('../i18n');
        const deviceLang = getDeviceLanguage();
        set({ settings: { ...defaultSettings, language: deviceLang } });
      }
      setSoundManagerEnabled(get().settings.soundEnabled);
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to load settings:', error);
      }
    } finally {
      isLoadingSettings = false;
    }
  },
  
  saveSettings: async () => {
    try {
      const { settings } = get();
      await AsyncStorage.setItem('letterz_settings', JSON.stringify(settings));
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to save settings:', error);
      }
    }
  },
  
  loadLastPlayers: async () => {
    try {
      const stored = await AsyncStorage.getItem('letterz_last_players');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to load last players:', error);
      }
    }
    return [];
  },
  
  saveLastPlayers: async (players) => {
    try {
      await AsyncStorage.setItem('letterz_last_players', JSON.stringify(players));
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to save last players:', error);
      }
    }
  },
}));
