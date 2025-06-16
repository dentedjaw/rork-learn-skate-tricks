import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, RotateCcw } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useTrickStore } from '@/store/useTrickStore';
import CategoryProgress from '@/components/CategoryProgress';
import ProgressBar from '@/components/ProgressBar';

export default function ProfileScreen() {
  const { 
    getTotalPoints, 
    getOverallProgress, 
    resetProgress,
    learnedTricks
  } = useTrickStore();
  
  const totalPoints = getTotalPoints();
  const { learned, total, percentage } = getOverallProgress();
  
  // Calculate user level based on points
  const level = Math.floor(totalPoints / 100) + 1;
  const nextLevelPoints = level * 100;
  const currentLevelPoints = (level - 1) * 100;
  const levelProgress = ((totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
  
  const confirmReset = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: resetProgress,
          style: 'destructive',
        },
      ]
    );
  };
  
  // Determine skater rank based on points
  const getSkaterRank = () => {
    if (totalPoints < 50) return 'Beginner';
    if (totalPoints < 150) return 'Novice';
    if (totalPoints < 300) return 'Intermediate';
    if (totalPoints < 500) return 'Advanced';
    if (totalPoints < 800) return 'Expert';
    return 'Pro Skater';
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileIconContainer}>
            <Award size={40} color={colors.accent.primary} />
          </View>
          <Text style={styles.profileTitle}>{getSkaterRank()}</Text>
          <Text style={styles.profileSubtitle}>Level {level}</Text>
        </View>
        
        {/* Level Progress */}
        <View style={styles.levelContainer}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>Level Progress</Text>
            <Text style={styles.levelPoints}>
              {totalPoints - currentLevelPoints}/{nextLevelPoints - currentLevelPoints} points
            </Text>
          </View>
          <ProgressBar progress={levelProgress} />
          <Text style={styles.levelHint}>
            {nextLevelPoints - totalPoints} more points to reach Level {level + 1}
          </Text>
        </View>
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Your Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalPoints}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{learned}</Text>
              <Text style={styles.statLabel}>Tricks Learned</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{Math.round(percentage)}%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{total - learned}</Text>
              <Text style={styles.statLabel}>Tricks Left</Text>
            </View>
          </View>
        </View>
        
        {/* Category Progress */}
        <CategoryProgress />
        
        {/* Reset Button */}
        {learnedTricks.length > 0 && (
          <TouchableOpacity style={styles.resetButton} onPress={confirmReset}>
            <RotateCcw size={16} color={colors.text.primary} />
            <Text style={styles.resetText}>Reset Progress</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 16,
    color: colors.accent.primary,
  },
  levelContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  levelPoints: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  levelHint: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.background.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  resetText: {
    color: colors.text.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
});