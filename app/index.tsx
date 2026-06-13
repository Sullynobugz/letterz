import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGameStore } from '../src/store/gameStore';
import { PlayerList } from '../src/components/PlayerList';
import { CategorySuggestions } from '../src/components/CategorySuggestions';
import { t, setLanguage as setI18nLanguage } from '../src/i18n';
import { COLORS } from '../src/constants/colors';
import type { Language, GameMode } from '../src/types';

export default function SetupScreen() {
  const router = useRouter();
  const {
    settings,
    setLanguage,
    setMode,
    setTurnSeconds,
    setSkipHardLetters,
    setSoundEnabled,
    startGame,
    loadLastPlayers,
    saveLastPlayers,
  } = useGameStore();

  const [category, setCategory] = useState('');
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    loadLastPlayers().then((lastPlayers) => {
      if (lastPlayers.length > 0) {
        setPlayers(lastPlayers);
      }
    });
  }, []);

  // Sync i18n module when language changes in store
  useEffect(() => {
    setI18nLanguage(settings.language);
  }, [settings.language]);

  const handleAddPlayer = (name: string) => {
    setPlayers(prev => [...prev, name]);
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(prev => prev.filter((_, i) => i !== index));
  };

  const handleStartGame = () => {
    if (players.length < 2 || !category.trim()) return;

    saveLastPlayers(players);
    startGame({ category: category.trim(), playerNames: players });
    router.push('/game');
  };

  const canStart = players.length >= 2 && category.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title} accessibilityRole="header">{t('appTitle')}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('setup.language')}</Text>
            <View style={styles.segmentedControl} accessibilityRole="radiogroup">
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  styles.segmentLeft,
                  settings.language === 'en' && styles.segmentActive,
                ]}
                onPress={() => setLanguage('en')}
                accessibilityLabel="Englisch"
                accessibilityRole="radio"
                accessibilityState={{ checked: settings.language === 'en' }}
              >
                <Text
                  style={[
                    styles.segmentText,
                    settings.language === 'en' && styles.segmentTextActive,
                  ]}
                >
                  🇬🇧 EN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  styles.segmentRight,
                  settings.language === 'de' && styles.segmentActive,
                ]}
                onPress={() => setLanguage('de')}
                accessibilityLabel="Deutsch"
                accessibilityRole="radio"
                accessibilityState={{ checked: settings.language === 'de' }}
              >
                <Text
                  style={[
                    styles.segmentText,
                    settings.language === 'de' && styles.segmentTextActive,
                  ]}
                >
                  🇩🇪 DE
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('setup.mode')}</Text>
            <View style={styles.segmentedControl} accessibilityRole="radiogroup">
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  styles.segmentLeft,
                  settings.mode === 'points' && styles.segmentActive,
                ]}
                onPress={() => setMode('points')}
                accessibilityLabel={t('setup.points')}
                accessibilityRole="radio"
                accessibilityState={{ checked: settings.mode === 'points' }}
              >
                <Text
                  style={[
                    styles.segmentText,
                    settings.mode === 'points' && styles.segmentTextActive,
                  ]}
                >
                  {t('setup.points')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  styles.segmentRight,
                  settings.mode === 'ko' && styles.segmentActive,
                ]}
                onPress={() => setMode('ko')}
                accessibilityLabel={t('setup.ko')}
                accessibilityRole="radio"
                accessibilityState={{ checked: settings.mode === 'ko' }}
              >
                <Text
                  style={[
                    styles.segmentText,
                    settings.mode === 'ko' && styles.segmentTextActive,
                  ]}
                >
                  {t('setup.ko')}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modeDescription}>
              {settings.mode === 'points' ? t('setup.pointsDesc') : t('setup.koDesc')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('setup.category')}</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder={t('setup.categoryPlaceholder')}
              maxLength={100}
              accessibilityLabel={t('setup.category')}
            />
            <CategorySuggestions onSelectCategory={setCategory} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('setup.timer')}: {settings.turnSeconds} {t('setup.seconds')}
            </Text>
            <View style={styles.timerControls}>
              <TouchableOpacity
                style={styles.timerButton}
                onPress={() => setTurnSeconds(Math.max(5, settings.turnSeconds - 5))}
                accessibilityLabel="Timer verringern"
                accessibilityRole="button"
                accessibilityHint={`Aktuell ${settings.turnSeconds} Sekunden`}
              >
                <Text style={styles.timerButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.timerValue} accessibilityLabel={`${settings.turnSeconds} Sekunden`}>
                {settings.turnSeconds}s
              </Text>
              <TouchableOpacity
                style={styles.timerButton}
                onPress={() => setTurnSeconds(Math.min(30, settings.turnSeconds + 5))}
                accessibilityLabel="Timer erhöhen"
                accessibilityRole="button"
                accessibilityHint={`Aktuell ${settings.turnSeconds} Sekunden`}
              >
                <Text style={styles.timerButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>{t('setup.skipHardLetters')}</Text>
              <Switch
                value={settings.skipHardLetters}
                onValueChange={setSkipHardLetters}
                accessibilityLabel={t('setup.skipHardLetters')}
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>{t('setup.sound')}</Text>
              <Switch
                value={settings.soundEnabled}
                onValueChange={setSoundEnabled}
                accessibilityLabel={t('setup.sound')}
              />
            </View>
          </View>

          <View style={styles.section}>
            <PlayerList
              players={players}
              onAddPlayer={handleAddPlayer}
              onRemovePlayer={handleRemovePlayer}
            />
          </View>

          <TouchableOpacity
            style={[styles.startButton, !canStart && styles.startButtonDisabled]}
            onPress={handleStartGame}
            disabled={!canStart}
            accessibilityLabel={t('setup.startGame')}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canStart }}
            accessibilityHint={
              !canStart
                ? players.length < 2
                  ? 'Mindestens 2 Spieler hinzufügen'
                  : 'Kategorie eingeben'
                : undefined
            }
          >
            <Text style={styles.startButtonText}>{t('setup.startGame')}</Text>
          </TouchableOpacity>

          <Text style={styles.version}>v1.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: 8,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: COLORS.background,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  segmentButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  segmentLeft: {
    borderRightWidth: 1,
    borderRightColor: COLORS.primary,
  },
  segmentRight: {},
  segmentActive: {
    backgroundColor: COLORS.primary,
  },
  segmentText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  segmentTextActive: {
    color: COLORS.white,
  },
  modeDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  timerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  timerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerButtonText: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.white,
  },
  timerValue: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    minWidth: 80,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  startButton: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  startButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  version: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});
