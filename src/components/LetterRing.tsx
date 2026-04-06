import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { COLORS } from '../constants/colors';

interface LetterRingProps {
  availableLetters: string[];
  usedLetters: string[];
  selectedLetter: string | null;
  category: string;
  onSelectLetter: (letter: string) => void;
}

const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LETTER_BUTTON_SIZE = 40;
const LETTER_BUTTON_HALF = LETTER_BUTTON_SIZE / 2;

export const LetterRing: React.FC<LetterRingProps> = ({
  availableLetters,
  usedLetters,
  selectedLetter,
  category,
  onSelectLetter,
}) => {
  const { width, height } = useWindowDimensions();
  const isTablet = width > 600;

  const { size, letterPositions } = useMemo(() => {
    const ringSize = Math.min(width, height) * (isTablet ? 0.5 : 0.75);
    const radius = ringSize / 2 - LETTER_BUTTON_SIZE;
    const centerX = ringSize / 2;
    const centerY = ringSize / 2;
    const total = ALL_LETTERS.length;

    const positions = ALL_LETTERS.map((letter, index) => {
      const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
      return {
        letter,
        x: centerX + radius * Math.cos(angle) - LETTER_BUTTON_HALF,
        y: centerY + radius * Math.sin(angle) - LETTER_BUTTON_HALF,
      };
    });

    return { size: ringSize, letterPositions: positions };
  }, [width, height, isTablet]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.centerContainer}>
        <Text style={styles.categoryText} numberOfLines={2}>
          {category}
        </Text>
      </View>

      {letterPositions.map(({ letter, x, y }) => {
        const isAvailable = availableLetters.includes(letter);
        const isUsed = usedLetters.includes(letter);
        const isSelected = selectedLetter === letter;

        if (!isAvailable && !isUsed) return null;

        return (
          <TouchableOpacity
            key={letter}
            style={[
              styles.letterButton,
              { left: x, top: y },
              isUsed && styles.letterUsed,
              isSelected && styles.letterSelected,
            ]}
            onPress={() => isAvailable && onSelectLetter(letter)}
            disabled={!isAvailable}
            activeOpacity={0.7}
            accessibilityLabel={`Buchstabe ${letter}${isUsed ? ', bereits verwendet' : ''}${isSelected ? ', ausgewählt' : ''}`}
            accessibilityRole="button"
            accessibilityState={{ disabled: !isAvailable, selected: isSelected }}
          >
            <Text
              style={[
                styles.letterText,
                isUsed && styles.letterTextUsed,
                isSelected && styles.letterTextSelected,
              ]}
            >
              {letter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'center',
  },
  centerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -80 }, { translateY: -40 }],
    width: 160,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.text,
  },
  letterButton: {
    position: 'absolute',
    width: LETTER_BUTTON_SIZE,
    height: LETTER_BUTTON_SIZE,
    borderRadius: LETTER_BUTTON_HALF,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  letterUsed: {
    backgroundColor: COLORS.letterUsed,
  },
  letterSelected: {
    backgroundColor: COLORS.secondary,
    transform: [{ scale: 1.2 }],
  },
  letterText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  letterTextUsed: {
    color: COLORS.textMuted,
  },
  letterTextSelected: {
    color: COLORS.white,
  },
});
