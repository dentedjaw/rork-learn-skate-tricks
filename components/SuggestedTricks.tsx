import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import colors from '@/constants/colors';
import { useTrickStore } from '@/store/useTrickStore';
import TrickCard from './TrickCard';

const SuggestedTricks: React.FC = () => {
  const { getSuggestedTricks } = useTrickStore();
  const suggestedTricks = getSuggestedTricks();
  
  if (suggestedTricks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No suggested tricks available. Learn more prerequisites!
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suggested Tricks</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={208} // Card width (200) + horizontal margin (8)
      >
        {suggestedTricks.map((trick) => (
          <View key={trick.id} style={styles.cardContainer}>
            <TrickCard trick={trick} compact />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  cardContainer: {
    width: 200,
    marginHorizontal: 4,
  },
  emptyContainer: {
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  emptyText: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default SuggestedTricks;