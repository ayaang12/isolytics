import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, TrendingUp } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import { styles } from "./history.styles";

interface Lift {
  id: string;
  exercise_name: string;
  weight: number;
  sets: number;
  reps: number;
  split_day: string;
  lift_date: string;
}

interface Meal {
  id: string;
  meal_name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  meal_date: string;
}

export default function History() {
  const [lifts, setLifts] = useState<Lift[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);

  const loadData = async () => {
    try {
      const storedLifts = await AsyncStorage.getItem("localLifts");
      const storedMeals = await AsyncStorage.getItem("localMeals");

      if (storedLifts) setLifts(JSON.parse(storedLifts));
      else setLifts([]);

      if (storedMeals) setMeals(JSON.parse(storedMeals));
      else setMeals([]);
    } catch (error) {
      console.log("Error loading data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    loadData();
  }, []);

  return (
    <LinearGradient
      colors={["#000000", "#1a0033", "#2d0052"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>Track your progress over time</Text>
        </View>

        {lifts.length === 0 && meals.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={64} color="#6b7280" strokeWidth={1.5} />
            <Text style={styles.emptyText}>No history yet</Text>
            <Text style={styles.emptySubtext}>
              Start logging workouts and meals
            </Text>
          </View>
        ) : (
          <>
            {/* --- Lift History Section --- */}
            {lifts.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Workout History</Text>
                {lifts.map((lift) => (
                  <View key={lift.id} style={[styles.card, { marginBottom: 16 }]}>
                    <View style={styles.cardHeader}>
                      <TrendingUp size={20} color="#a855f7" />
                      <Text style={styles.cardTitle}>{lift.exercise_name}</Text>
                    </View>
                    <Text style={styles.cardText}>{lift.lift_date}</Text>
                    <Text style={styles.cardText}>
                      {lift.weight} lbs • {lift.sets}×{lift.reps}
                      {lift.split_day ? ` • ${lift.split_day}` : ""}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* --- Meal History Section --- */}
            {meals.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Meal History</Text>
                {meals.map((meal) => (
                  <View key={meal.id} style={[styles.card, { marginBottom: 16 }]}>
                    <View style={styles.cardHeader}>
                      <TrendingUp size={20} color="#a855f7" />
                      <Text style={styles.cardTitle}>{meal.meal_name}</Text>
                    </View>
                    <Text style={styles.cardText}>{meal.meal_date}</Text>
                    <Text style={styles.cardText}>
                      {meal.calories} kcal • P {meal.protein}g • F {meal.fat}g • C {meal.carbs}g
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
