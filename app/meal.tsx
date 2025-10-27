import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { styles } from './meals.styles';
import { LinearGradient } from "expo-linear-gradient";

interface Meal {
  id: string;
  meal_name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  meal_date: string;
}

export default function MealsScreen() {
  const { user } = useAuth();
  const [meals, setMeals] = React.useState<Meal[]>([]);
  const [mealName, setMealName] = React.useState('');
  const [calories, setCalories] = React.useState('');
  const [protein, setProtein] = React.useState('');
  const [fat, setFat] = React.useState('');
  const [carbs, setCarbs] = React.useState('');
  const [mealDate, setMealDate] = React.useState(new Date().toISOString().split('T')[0]);

  React.useEffect(() => {
    loadLocalMeals();
    if (user) {
      loadMeals();
    }
  }, [user]);

  const saveLocalMeals = async (data: Meal[]) => {
    try {
      await AsyncStorage.setItem('localMeals', JSON.stringify(data));
    } catch (error) {
      console.log('Error saving meals:', error);
    }
  };

  const loadLocalMeals = async () => {
    try {
      const stored = await AsyncStorage.getItem('localMeals');
      if (stored) setMeals(JSON.parse(stored));
    } catch (error) {
      console.log('Error loading meals:', error);
    }
  };

  const loadMeals = async () => {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user?.id)
        .order('meal_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setMeals(data);
        saveLocalMeals(data);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const addMeal = async () => {
    if (!mealName.trim()) {
      Alert.alert('Error', 'Please enter a meal name');
      return;
    }

    const localId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const newMeal: Meal = {
      id: localId,
      meal_name: mealName,
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      fat: parseInt(fat) || 0,
      carbs: parseInt(carbs) || 0,
      meal_date: mealDate,
    };

    try {
      const stored = await AsyncStorage.getItem('localMeals');
      const existing: Meal[] = stored ? JSON.parse(stored) : [];
      const updated = [newMeal, ...existing];
      setMeals(updated);
      saveLocalMeals(updated);
    } catch (err) {
      console.log('Error merging local meals:', err);
    }

    setMealName('');
    setCalories('');
    setProtein('');
    setFat('');
    setCarbs('');
    setMealDate(new Date().toISOString().split('T')[0]);
  };

  const deleteMeal = async (id: string) => {
    if (id.startsWith('local-')) {
      const filtered = meals.filter((m) => m.id !== id);
      setMeals(filtered);
      saveLocalMeals(filtered);
      return;
    }

    try {
      const { error } = await supabase.from('meals').delete().eq('id', id);
      if (error) throw error;
      loadMeals();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#000000", "#1a0033", "#2d0052"]}
      style={styles.container}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Meal Tracking</Text>
            <Text style={styles.subtitle}>Track your daily nutrition</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Meal Name</Text>
              <TextInput
                style={styles.input}
                value={mealName}
                onChangeText={setMealName}
                placeholder="e.g., Breakfast, Lunch"
                placeholderTextColor="#4A5568"
              />
            </View>

            <View style={styles.macroRow}>
              <View style={[styles.inputGroup, styles.macroInput]}>
                <Text style={styles.label}>Calories</Text>
                <TextInput
                  style={styles.input}
                  value={calories}
                  onChangeText={setCalories}
                  placeholder="0"
                  placeholderTextColor="#4A5568"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, styles.macroInput]}>
                <Text style={styles.label}>Protein (g)</Text>
                <TextInput
                  style={styles.input}
                  value={protein}
                  onChangeText={setProtein}
                  placeholder="0"
                  placeholderTextColor="#4A5568"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.macroRow}>
              <View style={[styles.inputGroup, styles.macroInput]}>
                <Text style={styles.label}>Fat (g)</Text>
                <TextInput
                  style={styles.input}
                  value={fat}
                  onChangeText={setFat}
                  placeholder="0"
                  placeholderTextColor="#4A5568"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, styles.macroInput]}>
                <Text style={styles.label}>Carbs (g)</Text>
                <TextInput
                  style={styles.input}
                  value={carbs}
                  onChangeText={setCarbs}
                  placeholder="0"
                  placeholderTextColor="#4A5568"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity style={styles.dateButton}>
                <Text style={styles.dateText}>{mealDate}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={addMeal}>
              <Text style={styles.addButtonText}>Add Meal</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Recent Meals</Text>

          {meals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No meals tracked yet</Text>
            </View>
          ) : (
            meals.map((meal) => (
              <View key={meal.id} style={[styles.mealCard, { marginBottom: 16 }]}>
                <View style={styles.mealHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mealName}>{meal.meal_name}</Text>
                    <Text style={styles.mealDate}>{meal.meal_date}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteMeal(meal.id)}
                  >
                    <Text style={{ color: '#FF4444', fontSize: 18 }}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.macroGrid}>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroLabel}>Calories</Text>
                    <Text style={styles.macroValue}>{meal.calories}</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroLabel}>Protein</Text>
                    <Text style={styles.macroValue}>{meal.protein}g</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroLabel}>Fat</Text>
                    <Text style={styles.macroValue}>{meal.fat}g</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroLabel}>Carbs</Text>
                    <Text style={styles.macroValue}>{meal.carbs}g</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}
