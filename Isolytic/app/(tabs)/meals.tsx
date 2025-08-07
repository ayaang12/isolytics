import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Search, Target, Zap, Wheat, Droplets } from 'lucide-react-native';
import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function MealsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const dailyGoals = {
    calories: 2200,
    protein: 150,
    carbs: 250,
    fat: 73,
    sugar: 50,
    fiber: 25
  };

  const totalNutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sugar: 0,
    fiber: 0
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return '#EF4444';
    if (percentage < 80) return '#F59E0B';
    return '#10B981';
  };

  const handleAddMeal = () => {
    // TODO: Implement meal adding functionality
    console.log('Add meal functionality to be implemented');
  };

  return (
    <ProtectedRoute>
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={['#1F2937', '#111827']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Meal Tracking</Text>
          <Text style={styles.headerSubtitle}>Track your daily nutrition</Text>
        </LinearGradient>

      <View style={styles.content}>
        {/* Daily Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          
          <View style={styles.macroGrid}>
            <View style={styles.macroCard}>
              <Zap size={24} color="#10B981" />
              <Text style={styles.macroValue}>{totalNutrition.calories}</Text>
              <Text style={styles.macroLabel}>Calories</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${getProgressPercentage(totalNutrition.calories, dailyGoals.calories)}%`,
                      backgroundColor: getProgressColor(getProgressPercentage(totalNutrition.calories, dailyGoals.calories))
                    }
                  ]} 
                />
              </View>
              <Text style={styles.goalText}>Goal: {dailyGoals.calories}</Text>
            </View>

            <View style={styles.macroCard}>
              <Target size={24} color="#3B82F6" />
              <Text style={styles.macroValue}>{totalNutrition.protein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${getProgressPercentage(totalNutrition.protein, dailyGoals.protein)}%`,
                      backgroundColor: getProgressColor(getProgressPercentage(totalNutrition.protein, dailyGoals.protein))
                    }
                  ]} 
                />
              </View>
              <Text style={styles.goalText}>Goal: {dailyGoals.protein}g</Text>
            </View>

            <View style={styles.macroCard}>
              <Wheat size={24} color="#F59E0B" />
              <Text style={styles.macroValue}>{totalNutrition.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${getProgressPercentage(totalNutrition.carbs, dailyGoals.carbs)}%`,
                      backgroundColor: getProgressColor(getProgressPercentage(totalNutrition.carbs, dailyGoals.carbs))
                    }
                  ]} 
                />
              </View>
              <Text style={styles.goalText}>Goal: {dailyGoals.carbs}g</Text>
            </View>

            <View style={styles.macroCard}>
              <Droplets size={24} color="#8B5CF6" />
              <Text style={styles.macroValue}>{totalNutrition.fat}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${getProgressPercentage(totalNutrition.fat, dailyGoals.fat)}%`,
                      backgroundColor: getProgressColor(getProgressPercentage(totalNutrition.fat, dailyGoals.fat))
                    }
                  ]} 
                />
              </View>
              <Text style={styles.goalText}>Goal: {dailyGoals.fat}g</Text>
            </View>
          </View>

          <View style={styles.additionalNutrition}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Sugar</Text>
              <Text style={styles.nutritionValue}>{totalNutrition.sugar}g / {dailyGoals.sugar}g</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Fiber</Text>
              <Text style={styles.nutritionValue}>{totalNutrition.fiber}g / {dailyGoals.fiber}g</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search foods..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Add Meal Button */}
        <TouchableOpacity style={styles.addMealButton} onPress={handleAddMeal}>
          <LinearGradient
            colors={['#8B5CF6', '#A855F7']}
            style={styles.addButtonGradient}
          >
            <Plus size={24} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add New Meal</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Meals List */}
        <View style={styles.emptyMealsContainer}>
          <Target size={48} color="#6B7280" />
          <Text style={styles.emptyMealsTitle}>No meals logged today</Text>
          <Text style={styles.emptyMealsText}>
            Start tracking your nutrition by adding your first meal above.
          </Text>
        </View>
      </View>
      </ScrollView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  content: {
    padding: 20,
  },
  overviewCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  macroCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  macroLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#4B5563',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  goalText: {
    fontSize: 10,
    color: '#6B7280',
  },
  additionalNutrition: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  addMealButton: {
    marginBottom: 20,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  mealsSection: {
    marginBottom: 20,
  },
  emptyMealsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyMealsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMealsText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});