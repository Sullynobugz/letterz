import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { t } from '../i18n';
import { COLORS } from '../constants/colors';

interface CategorySuggestionsProps {
  onSelectCategory: (category: string) => void;
}

const CATEGORY_KEYS = [
  'job',
  'animal',
  'city',
  'country',
  'food',
  'brand',
  'movie',
  'series',
  'sport',
  'plant',
];

export const CategorySuggestions: React.FC<CategorySuggestionsProps> = ({ onSelectCategory }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('setup.categorySuggestions')}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        accessibilityRole="menu"
      >
        {CATEGORY_KEYS.map((key) => {
          const label = t(`setup.categories.${key}`);
          return (
            <TouchableOpacity
              key={key}
              style={styles.chip}
              onPress={() => onSelectCategory(label)}
              activeOpacity={0.7}
              accessibilityLabel={label}
              accessibilityRole="menuitem"
              accessibilityHint={`Kategorie ${label} auswählen`}
            >
              <Text style={styles.chipText}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  scrollContent: {
    gap: 8,
    paddingRight: 20,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
