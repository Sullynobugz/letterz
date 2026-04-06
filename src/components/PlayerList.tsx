import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { t } from '../i18n';
import { useGameStore } from '../store/gameStore';
import { COLORS } from '../constants/colors';

interface PlayerListProps {
  players: string[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (index: number) => void;
}

export const PlayerList: React.FC<PlayerListProps> = ({ players, onAddPlayer, onRemovePlayer }) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const language = useGameStore((state) => state.settings.language);

  const handleAdd = () => {
    const trimmed = newPlayerName.trim();
    if (trimmed) {
      onAddPlayer(trimmed);
      setNewPlayerName('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('setup.players')}</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          placeholder={t('setup.addPlayerPlaceholder')}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          maxLength={50}
          accessibilityLabel={t('setup.addPlayerPlaceholder')}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          accessibilityLabel={t('setup.add')}
          accessibilityRole="button"
          accessibilityHint="Spieler zur Liste hinzufügen"
        >
          <Text style={styles.addButtonText}>{t('setup.add')}</Text>
        </TouchableOpacity>
      </View>

      {players.length > 0 && (
        <View style={styles.list}>
          {players.map((item, index) => (
            <View key={`${item}-${index}`} style={styles.playerItem}>
              <Text style={styles.playerName}>{item}</Text>
              <TouchableOpacity
                onPress={() => onRemovePlayer(index)}
                accessibilityLabel={`${item} entfernen`}
                accessibilityRole="button"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.removeButton}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {players.length < 2 && (
        <Text style={styles.hint} accessibilityRole="text">{t('setup.minPlayers')}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: COLORS.background,
  },
  addButton: {
    height: 44,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    gap: 8,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginBottom: 8,
  },
  playerName: {
    fontSize: 16,
    color: COLORS.text,
  },
  removeButton: {
    fontSize: 20,
    color: COLORS.danger,
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});
