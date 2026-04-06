import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { t } from '../i18n';
import { useGameStore } from '../store/gameStore';
import type { Player, GameMode } from '../types';
import { COLORS } from '../constants/colors';

interface ResultsModalProps {
  visible: boolean;
  players: Player[];
  mode: GameMode;
  onPlayAgain: () => void;
  onBackToSetup: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  visible,
  players,
  mode,
  onPlayAgain,
  onBackToSetup,
}) => {
  const language = useGameStore((state) => state.settings.language);

  const activePlayers = useMemo(() => players.filter(p => !p.isOut), [players]);
  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => b.score - a.score),
    [players]
  );

  const winnerText = useMemo(() => {
    if (mode === 'ko') {
      const lastStanding = activePlayers[0];
      if (lastStanding) {
        return t('results.lastStanding', { name: lastStanding.name });
      }
      return t('results.title');
    }

    const maxScore = sortedPlayers[0]?.score ?? 0;
    const winners = sortedPlayers.filter(p => p.score === maxScore);

    if (winners.length > 1) {
      return t('results.tie', { names: winners.map(w => w.name).join(', ') });
    }

    return t('results.winner', { name: winners[0]?.name ?? '' });
  }, [mode, activePlayers, sortedPlayers, language]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onBackToSetup}
      accessibilityViewIsModal
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title} accessibilityRole="header">{t('results.title')}</Text>

          <Text style={styles.winnerText} accessibilityLiveRegion="polite">{winnerText}</Text>

          <View style={styles.scoreboardContainer}>
            <Text style={styles.scoreboardTitle}>{t('results.scoreboard')}</Text>
            <ScrollView style={styles.scoreList}>
              {sortedPlayers.map((player, index) => (
                <View
                  key={player.id}
                  style={styles.scoreItem}
                  accessibilityLabel={`${index + 1}. ${player.name}${player.isOut ? ', ausgeschieden' : ''}${mode === 'points' ? `, ${player.score} Punkte` : ''}`}
                >
                  <View style={styles.scoreLeft}>
                    <Text style={styles.rank}>{index + 1}.</Text>
                    <Text style={styles.playerName}>{player.name}</Text>
                    {player.isOut && <Text style={styles.outBadge}>OUT</Text>}
                  </View>
                  {mode === 'points' && (
                    <Text style={styles.score}>{player.score}</Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onPlayAgain}
              accessibilityLabel={t('results.playAgain')}
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>{t('results.playAgain')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onBackToSetup}
              accessibilityLabel={t('results.backToSetup')}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>{t('results.backToSetup')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: COLORS.text,
  },
  winnerText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: COLORS.primary,
  },
  scoreboardContainer: {
    marginBottom: 24,
  },
  scoreboardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: COLORS.text,
  },
  scoreList: {
    maxHeight: 250,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginBottom: 8,
  },
  scoreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rank: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    width: 30,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  outBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.danger,
    backgroundColor: COLORS.errorBackground,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  score: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    height: 50,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '600',
  },
});
