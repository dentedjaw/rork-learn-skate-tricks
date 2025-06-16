import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tricks from '@/data/tricks';
import { Trick } from '@/types/Trick';

interface TrickState {
  learnedTricks: string[];
  markTrickAsLearned: (trickId: string) => void;
  unmarkTrickAsLearned: (trickId: string) => void;
  isTrickLearned: (trickId: string) => boolean;
  getSuggestedTricks: () => Trick[];
  getTotalPoints: () => number;
  getProgressByCategory: () => Record<string, { total: number; learned: number }>;
  getOverallProgress: () => { total: number; learned: number; percentage: number };
  resetProgress: () => void;
}

export const useTrickStore = create<TrickState>()(
  persist(
    (set, get) => ({
      learnedTricks: [],
      
      markTrickAsLearned: (trickId: string) => {
        set((state) => ({
          learnedTricks: [...state.learnedTricks, trickId],
        }));
      },
      
      unmarkTrickAsLearned: (trickId: string) => {
        set((state) => ({
          learnedTricks: state.learnedTricks.filter((id) => id !== trickId),
        }));
      },
      
      isTrickLearned: (trickId: string) => {
        return get().learnedTricks.includes(trickId);
      },
      
      getSuggestedTricks: () => {
        const learnedTricks = get().learnedTricks;
        
        // Find tricks that aren't learned yet but have all prerequisites learned
        return tricks.filter((trick) => {
          // Skip if already learned
          if (learnedTricks.includes(trick.id)) {
            return false;
          }
          
          // Check if all prerequisites are learned
          const allPrerequisitesMet = trick.prerequisites.every((prereqId) => 
            learnedTricks.includes(prereqId)
          );
          
          return allPrerequisitesMet;
        }).slice(0, 5); // Limit to 5 suggestions
      },
      
      getTotalPoints: () => {
        const learnedTricks = get().learnedTricks;
        return tricks
          .filter((trick) => learnedTricks.includes(trick.id))
          .reduce((total, trick) => total + trick.points, 0);
      },
      
      getProgressByCategory: () => {
        const learnedTricks = get().learnedTricks;
        const progress: Record<string, { total: number; learned: number }> = {};
        
        // Initialize categories
        tricks.forEach((trick) => {
          if (!progress[trick.category]) {
            progress[trick.category] = { total: 0, learned: 0 };
          }
          progress[trick.category].total += 1;
        });
        
        // Count learned tricks by category
        tricks
          .filter((trick) => learnedTricks.includes(trick.id))
          .forEach((trick) => {
            progress[trick.category].learned += 1;
          });
        
        return progress;
      },
      
      getOverallProgress: () => {
        const learnedTricks = get().learnedTricks;
        const total = tricks.length;
        const learned = learnedTricks.length;
        const percentage = total > 0 ? (learned / total) * 100 : 0;
        
        return { total, learned, percentage };
      },
      
      resetProgress: () => {
        set({ learnedTricks: [] });
      },
    }),
    {
      name: 'skate-tricks-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);