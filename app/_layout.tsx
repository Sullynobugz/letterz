import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useGameStore } from '../src/store/gameStore';
import { setLanguage } from '../src/i18n';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { COLORS } from '../src/constants/colors';
import { initSounds } from '../src/utils/sound';

export default function RootLayout() {
  const loadSettings = useGameStore((state) => state.loadSettings);
  const language = useGameStore((state) => state.settings.language);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Preload sound effects (non-blocking, failures are swallowed internally).
    initSounds();
    loadSettings()
      .catch((error) => {
        if (__DEV__) {
          console.error('Failed to load settings:', error);
        }
      })
      .finally(() => {
        setIsReady(true);
      });
  }, []);

  useEffect(() => {
    setLanguage(language);
  }, [language]);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer} accessibilityLabel="Wird geladen">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="game" />
      </Stack>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
