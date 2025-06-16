import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import { useTrickStore } from '@/store/useTrickStore';
import ProgressBar from './ProgressBar';

const categoryNames: Record<string, string> = {
  fundamentals: 'Fundamentals',
  first_tricks: 'First Tricks',
  flip: 'Flip Tricks',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  transition: 'Transition',
  street_grinds: 'Street Grinds',
  expert: 'Expert',
};

const CategoryProgress: React.FC = () => {
  const { getProgressByCategory } = useTrickStore();
  const progressByCategory = getProgressByCategory();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress by Category</Text>
      
      {Object.entries(progressByCategory).map(([category, { total, learned }]) => {
        const percentage = total > 0 ? (learned / total) * 100 : 0;
        const categoryColor = colors.category[category as keyof typeof colors.category] || colors.text.primary;
        
        return (
          <View key={category} style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
              <Text style={styles.categoryName}>{categoryNames[category] || category}</Text>
              <Text style={styles.categoryCount}>
                {learned}/{total}
              </Text>
            </View>
            <ProgressBar progress={percentage} color={categoryColor} />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
  },
  categoryCount: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 8,
  },
});

export default CategoryProgress;