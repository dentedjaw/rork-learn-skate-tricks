import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Check, ExternalLink, Youtube } from 'lucide-react-native';
import colors from '@/constants/colors';
import tricks from '@/data/tricks';
import { useTrickStore } from '@/store/useTrickStore';
import * as Haptics from 'expo-haptics';

export default function TrickDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trick, setTrick] = useState(tricks.find((t) => t.id === id));
  const { isTrickLearned, markTrickAsLearned, unmarkTrickAsLearned } = useTrickStore();
  
  useEffect(() => {
    // Find the trick by ID
    const foundTrick = tricks.find((t) => t.id === id);
    setTrick(foundTrick);
  }, [id]);
  
  if (!trick) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Trick not found</Text>
      </View>
    );
  }
  
  const isLearned = isTrickLearned(trick.id);
  
  const toggleLearned = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (isLearned) {
      unmarkTrickAsLearned(trick.id);
    } else {
      markTrickAsLearned(trick.id);
    }
  };
  
  const openYoutubeVideo = () => {
    if (trick.youtubeUrl) {
      // Ensure the URL is properly formatted
      let url = trick.youtubeUrl;
      
      // Check if it's a valid URL
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Cannot open URL: " + url);
          // Fallback to a web search if the URL can't be opened
          const searchQuery = `${trick.name} skateboard trick tutorial`;
          const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
          Linking.openURL(searchUrl);
        }
      });
    }
  };
  
  const getCategoryColor = () => {
    return colors.category[trick.category] || colors.text.primary;
  };
  
  // Find prerequisite tricks
  const prerequisiteTricks = tricks.filter((t) => trick.prerequisites.includes(t.id));
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.name}>{trick.name}</Text>
        <Text style={[styles.difficulty, { color: getCategoryColor() }]}>
          {trick.difficulty.charAt(0).toUpperCase() + trick.difficulty.slice(1)}
        </Text>
        <Text style={styles.points}>+{trick.points}pts</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{trick.description}</Text>
      </View>
      
      {prerequisiteTricks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prerequisites</Text>
          {prerequisiteTricks.map((prereq) => (
            <View key={prereq.id} style={styles.prerequisiteItem}>
              <Text style={styles.prerequisiteBullet}>•</Text>
              <Text style={styles.prerequisiteName}>{prereq.name}</Text>
              {isTrickLearned(prereq.id) && (
                <View style={styles.learnedBadge}>
                  <Check size={12} color="#fff" />
                </View>
              )}
            </View>
          ))}
        </View>
      )}
      
      {trick.youtubeUrl && (
        <TouchableOpacity 
          style={styles.youtubeButton} 
          onPress={openYoutubeVideo}
          activeOpacity={0.7}
        >
          <Youtube size={20} color="#fff" />
          <Text style={styles.youtubeText}>Watch Tutorial</Text>
          <ExternalLink size={16} color="#fff" />
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        style={[
          styles.learnedButton,
          isLearned ? styles.learnedButtonActive : null,
        ]}
        onPress={toggleLearned}
        activeOpacity={0.7}
      >
        <Text style={styles.learnedButtonText}>
          {isLearned ? 'Marked as Learned' : 'Mark as Learned'}
        </Text>
        {isLearned && <Check size={16} color="#fff" style={styles.learnedIcon} />}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  difficulty: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.accent.secondary,
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.secondary,
  },
  prerequisiteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  prerequisiteBullet: {
    fontSize: 16,
    color: colors.text.secondary,
    marginRight: 8,
  },
  prerequisiteName: {
    fontSize: 16,
    color: colors.text.secondary,
    flex: 1,
  },
  learnedBadge: {
    backgroundColor: colors.status.learned,
    borderRadius: 12,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  youtubeText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    marginRight: 8,
  },
  learnedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.button.primary,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  learnedButtonActive: {
    backgroundColor: colors.status.learned,
  },
  learnedButtonText: {
    color: colors.button.text,
    fontWeight: 'bold',
  },
  learnedIcon: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 24,
  },
});