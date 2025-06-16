import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import colors from '@/constants/colors';
import tricks from '@/data/tricks';
import CategoryAccordion from '@/components/CategoryAccordion';

export default function TricksScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Group tricks by category
  const tricksByCategory = tricks.reduce((acc, trick) => {
    if (!acc[trick.category]) {
      acc[trick.category] = [];
    }
    acc[trick.category].push(trick);
    return acc;
  }, {} as Record<string, typeof tricks>);
  
  // Filter tricks based on search query
  const filteredTricksByCategory = Object.entries(tricksByCategory).reduce(
    (acc, [category, categoryTricks]) => {
      if (searchQuery) {
        const filtered = categoryTricks.filter(
          (trick) =>
            trick.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trick.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filtered.length > 0) {
          acc[category] = filtered;
        }
      } else {
        acc[category] = categoryTricks;
      }
      return acc;
    },
    {} as Record<string, typeof tricks>
  );
  
  const categoryNames: Record<string, string> = {
    fundamentals: 'Fundamentals',
    first_tricks: 'First Tricks',
    flip: 'Flip Foundation',
    intermediate: 'Intermediate Flip Combos & Switch Variations',
    advanced: 'Advanced Tech & Spinning Tricks',
    transition: 'Transition (Ramp/Bowl) Tricks',
    street_grinds: 'Grinds and Slides (Street)',
    expert: 'Expert & Combo Tricks',
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.text.secondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tricks..."
          placeholderTextColor={colors.text.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {Object.keys(filteredTricksByCategory).length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tricks found matching "{searchQuery}"</Text>
          </View>
        ) : (
          Object.entries(filteredTricksByCategory).map(([category, categoryTricks]) => (
            <CategoryAccordion
              key={category}
              category={category as any}
              title={categoryNames[category] || category}
              tricks={categoryTricks}
              initiallyExpanded={Object.keys(filteredTricksByCategory).length === 1}
            />
          ))
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: colors.text.primary,
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
  },
});