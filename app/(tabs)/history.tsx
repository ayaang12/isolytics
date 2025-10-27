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

export default function History() {
  const [lifts, setLifts] = useState<Lift[]>([]);

  const loadLifts = async () => {
    try {
      const stored = await AsyncStorage.getItem("localLifts");
      if (stored) setLifts(JSON.parse(stored));
      else setLifts([]);
    } catch (error) {
      console.log("Error loading lifts:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLifts();
    }, [])
  );

  useEffect(() => {
    loadLifts();
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

        {lifts.length === 0 ? (
          <>
            <View style={styles.emptyState}>
              <Calendar size={64} color="#6b7280" strokeWidth={1.5} />
              <Text style={styles.emptyText}>No workout history yet</Text>
              <Text style={styles.emptySubtext}>
                Start logging your workouts to see your progress
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <TrendingUp size={20} color="#a855f7" />
                  <Text style={styles.cardTitle}>Weekly Summary</Text>
                </View>
                <Text style={styles.cardText}>
                  Your workout history will appear here
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout History</Text>

            {lifts.map((lift) => (
              <View key={lift.id} style={styles.card}>
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
      </ScrollView>
    </LinearGradient>
  );
}
