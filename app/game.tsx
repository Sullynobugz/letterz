import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  AppState,
  AppStateStatus,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGameStore } from '../src/store/gameStore';
import { LetterRing } from '../src/components/LetterRing';
import { Timer } from '../src/components/Timer';
import { ResultsModal } from '../src/components/ResultsModal';
import { t } from '../src/i18n';
import { COLORS } from '../src/constants/colors';

export default function GameScreen() {
  const router = useRouter();
  const {
    game,
    settings,
    selectLetter,
    submitAnswer,
    tickTimer,
    pauseTimer,
    resumeTimer,
    endGame,
    playAgain,
  } = useGameStore();

  const [answer, setAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const appState = useRef(AppState.currentState);

  // Force re-render when language changes
  const language = useGameStore((state) => state.settings.language);

  // Handle app lifecycle to pause timer when app backgrounds
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/active/) &&
        nextAppState === 'background' &&
        game.timerRunning &&
        !game.timerPaused
      ) {
        pauseTimer();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [game.timerRunning, game.timerPaused, pauseTimer]);

  const currentPlayer = game.players[game.currentPlayerIndex] ?? null;
  const recentTurns = game.turns.slice(-5).reverse();

  const handleSelectLetter = (letter: string) => {
    selectLetter(letter);
    setErrorMessage('');
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    const result = submitAnswer(answer);

    if (!result.success) {
      if (result.error === 'emptyWord') {
        setErrorMessage(t('game.emptyWord'));
      } else if (result.error === 'invalidWord') {
        setErrorMessage(
          t('game.invalidWord', { letter: game.selectedLetter ?? '' })
        );
      }
    } else {
      setAnswer('');
      setErrorMessage('');
    }
  };

  const handleEndGame = () => {
    Alert.alert(
      t('game.confirmEnd'),
      '',
      [
        {
          text: t('game.cancel'),
          style: 'cancel',
        },
        {
          text: t('game.confirmButton'),
          onPress: endGame,
          style: 'destructive',
        },
      ]
    );
  };

  const handlePlayAgain = () => {
    playAgain();
    setAnswer('');
    setErrorMessage('');
  };

  const handleBackToSetup = () => {
    router.back();
  };

  if (game.status === 'idle') {
    router.back();
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName} accessibilityRole="header">
              {currentPlayer?.name ?? ''}
            </Text>
            <Timer
              seconds={game.timerSecondsLeft}
              totalSeconds={settings.turnSeconds}
              running={game.timerRunning}
              onTick={tickTimer}
            />
            {game.timerPaused && (
              <Text style={styles.pausedLabel} accessibilityLiveRegion="polite">
                {t('game.paused')}
              </Text>
            )}
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={game.timerPaused ? resumeTimer : pauseTimer}
              accessibilityLabel={game.timerPaused ? t('game.resume') : t('game.pause')}
              accessibilityRole="button"
            >
              <Text style={styles.pauseButtonText}>
                {game.timerPaused ? t('game.resume') : t('game.pause')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.endButton}
              onPress={handleEndGame}
              accessibilityLabel={t('game.end')}
              accessibilityRole="button"
            >
              <Text style={styles.endButtonText}>{t('game.end')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <LetterRing
            availableLetters={game.availableLetters}
            usedLetters={game.usedLetters}
            selectedLetter={game.selectedLetter}
            category={game.category}
            onSelectLetter={handleSelectLetter}
          />

          <View style={styles.inputSection}>
            {game.selectedLetter ? (
              <>
                <Text
                  style={styles.selectedLetterLabel}
                  accessibilityLabel={`Ausgewählter Buchstabe: ${game.selectedLetter}`}
                >
                  {game.selectedLetter}
                </Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={answer}
                    onChangeText={(text) => {
                      setAnswer(text);
                      setErrorMessage('');
                    }}
                    placeholder={t('game.enterWord')}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={handleSubmit}
                    returnKeyType="done"
                    autoFocus
                    maxLength={50}
                    accessibilityLabel={t('game.enterWord')}
                  />
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    accessibilityLabel={t('game.submit')}
                    accessibilityRole="button"
                  >
                    <Text style={styles.submitButtonText}>{t('game.submit')}</Text>
                  </TouchableOpacity>
                </View>
                {errorMessage ? (
                  <Text
                    style={styles.errorText}
                    accessibilityLiveRegion="assertive"
                    accessibilityRole="alert"
                  >
                    {errorMessage}
                  </Text>
                ) : null}
              </>
            ) : (
              <Text style={styles.selectPrompt}>{t('game.selectLetter')}</Text>
            )}
          </View>

          {recentTurns.length > 0 && (
            <View style={styles.feedSection}>
              {recentTurns.map((turn, index) => {
                const player = game.players.find(p => p.id === turn.playerId);
                return (
                  <View key={`${turn.playerId}-${turn.timestamp}-${index}`} style={styles.feedItem}>
                    <Text style={styles.feedText}>
                      <Text style={styles.feedPlayerName}>{player?.name}</Text>
                      {': '}
                      <Text style={styles.feedLetter}>{turn.letter}</Text>
                      {' — '}
                      <Text style={styles.feedAnswer}>{turn.answer}</Text>
                      {settings.mode === 'points' && (
                        <Text style={styles.feedPoints}> ({turn.points})</Text>
                      )}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <ResultsModal
        visible={game.status === 'ended'}
        players={game.players}
        mode={settings.mode}
        onPlayAgain={handlePlayAgain}
        onBackToSetup={handleBackToSetup}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  playerInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  playerName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  pausedLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.secondary,
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  pauseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
  },
  pauseButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  endButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.danger,
    borderRadius: 8,
  },
  endButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    gap: 24,
    alignItems: 'center',
  },
  inputSection: {
    width: '100%',
    gap: 12,
    alignItems: 'center',
  },
  selectedLetterLabel: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  inputRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    backgroundColor: COLORS.background,
  },
  submitButton: {
    height: 50,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: COLORS.danger,
    textAlign: 'center',
  },
  selectPrompt: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  feedSection: {
    width: '100%',
    gap: 8,
  },
  feedItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  feedText: {
    fontSize: 14,
    color: COLORS.text,
  },
  feedPlayerName: {
    fontWeight: '600',
  },
  feedLetter: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  feedAnswer: {
    fontStyle: 'italic',
  },
  feedPoints: {
    fontWeight: '600',
    color: COLORS.success,
  },
});
