import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Trick, TrickCategory } from '@/types/Trick';
import TrickCard from './TrickCard';

interface CategoryAccordionProps {
  category: TrickCategory;
  title: string;
  tricks: Trick[];
  initiallyExpanded?: boolean;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  category,
  title,
  tricks,
  initiallyExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const getCategoryColor = () => {
    return colors.category[category] || colors.text.primary;
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, { borderLeftColor: getCategoryColor() }]}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={[styles.categoryDot, { backgroundColor: getCategoryColor() }]} />
        <Text style={styles.title}>{title}</Text>
        {expanded ? (
          <ChevronUp size={20} color={colors.text.secondary} />
        ) : (
          <ChevronDown size={20} color={colors.text.secondary} />
        )}
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.content}>
          {tricks.map((trick) => (
            <TrickCard key={trick.id} trick={trick} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderLeftWidth: 4,
  },
  categoryDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
});

export default CategoryAccordion;