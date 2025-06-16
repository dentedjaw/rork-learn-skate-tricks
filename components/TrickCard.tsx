import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, Circle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import colors from '@/constants/colors';
import { Trick } from '@/types/Trick';
import { useTrickStore } from '@/store/useTrickStore';

interface TrickCardProps {
  trick: Trick;
  compact?: boolean;
  showCheckbox?: boolean;
}

const TrickCard: React.FC<TrickCardProps> = ({
  trick,
  compact = false,
  showCheckbox = true,
}) => {
  const router = useRouter();
  const { isTrickLearned, markTrickAsLearned, unmarkTrickAsLearned } = useTrickStore();
  
  const isLearned = isTrickLearned(trick.id);
  
  const handlePress = () => {
    router.push(`/trick/${trick.id}`);
  };
  
  const toggleLearned = (e: any) => {
    e.stopPropagation();
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (isLearned) {
      unmarkTrickAsLearned(trick.id);
    } else {
      markTrickAsLearned(trick.id);
    }
  };
  
  const getCategoryColor = () => {
    return colors.category[trick.category] || colors.text.primary;
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        compact ? styles.compactContainer : null,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{trick.name}</Text>
          {showCheckbox && (
            <Pressable
              style={[
                styles.checkbox,
                isLearned ? { backgroundColor: colors.status.learned } : null,
              ]}
              onPress={toggleLearned}
              hitSlop={8}
            >
              {isLearned ? (
                <Check size={16} color="#fff" />
              ) : (
                <Circle size={16} color={colors.text.secondary} />
              )}
            </Pressable>
          )}
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={[styles.difficulty, { color: getCategoryColor() }]}>
            {trick.difficulty.charAt(0).toUpperCase() + trick.difficulty.slice(1)}
          </Text>
          {!compact && (
            <Text style={styles.points}>+{trick.points}pts</Text>
          )}
        </View>
        
        {!compact && (
          <Text style={styles.description} numberOfLines={2}>
            {trick.shortDescription}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  compactContainer: {
    padding: 12,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.text.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  difficulty: {
    fontSize: 12,
    fontWeight: '500',
  },
  points: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.accent.secondary,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});

export default TrickCard;