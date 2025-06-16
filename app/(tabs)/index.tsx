import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import { useTrickStore } from '@/store/useTrickStore';
import SuggestedTricks from '@/components/SuggestedTricks';
import ProgressBar from '@/components/ProgressBar';

export default function HomeScreen() {
  const { getTotalPoints, getOverallProgress } = useTrickStore();
  const totalPoints = getTotalPoints();
  const { learned, total, percentage } = getOverallProgress();
  
  // Calculate user level based on points
  const level = Math.floor(totalPoints / 100) + 1;
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner Image */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1564982752979-3f7c5740a29a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Learn Skate Tricks</Text>
            <Text style={styles.bannerSubtitle}>Master every trick, one step at a time</Text>
          </View>
        </View>
        
        {/* Score and Level */}
        <View style={styles.scoreContainer}>
          <View style={styles.scoreContent}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{totalPoints}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.scoreContent}>
            <Text style={styles.scoreLabel}>Level {level}</Text>
            <ProgressBar 
              progress={(totalPoints % 100) / 100 * 100} 
              height={6} 
              showPercentage={false} 
            />
          </View>
        </View>
        
        {/* Overall Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progress</Text>
            <Text style={styles.progressCount}>{learned}/{total} tricks</Text>
          </View>
          <ProgressBar progress={percentage} />
        </View>
        
        {/* Suggested Tricks */}
        <SuggestedTricks />
        
        {/* Quick Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Quick Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              Start with the fundamentals before attempting more advanced tricks.
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              Practice on smooth, flat ground when learning new tricks.
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              Commit to the trick and don't be afraid to fall - it's part of learning!
            </Text>
          </View>
        </View>
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
    paddingBottom: 24,
  },
  bannerContainer: {
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  scoreContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  scoreContent: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  divider: {
    width: 1,
    backgroundColor: colors.background.card,
    marginHorizontal: 16,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: colors.background.secondary,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  progressCount: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  tipsContainer: {
    padding: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  tipCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});