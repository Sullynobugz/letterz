import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface TimerProps {
  seconds: number;
  totalSeconds: number;
  running: boolean;
  onTick: () => void;
}

export const Timer: React.FC<TimerProps> = React.memo(({ seconds, totalSeconds, running, onTick }) => {
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      onTickRef.current();
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const percentage = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0;
  const isLow = percentage < 30;

  return (
    <View style={styles.container} accessibilityLabel={`Timer: ${seconds} Sekunden`} accessibilityRole="timer">
      <Text style={[styles.timerText, isLow && styles.timerTextLow]}>
        {seconds}s
      </Text>
      <View style={styles.progressBar} accessibilityElementsHidden>
        <View
          style={[
            styles.progressFill,
            { width: `${percentage}%` },
            isLow && styles.progressFillLow,
          ]}
        />
      </View>
    </View>
  );
});

Timer.displayName = 'Timer';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.primary,
  },
  timerTextLow: {
    color: COLORS.danger,
  },
  progressBar: {
    width: 200,
    height: 8,
    backgroundColor: COLORS.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressFillLow: {
    backgroundColor: COLORS.danger,
  },
});
