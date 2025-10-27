import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, TrendingUp, Image as ImageIcon } from "lucide-react-native";
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

interface Photo {
  uri: string;
  date: string;
  timestamp: number;
}

export default function History() {
  const [lifts, setLifts] = useState<Lift[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const loadData = async () => {
    try {
      const storedLifts = await AsyncStorage.getItem("localLifts");
      const storedMeals = await AsyncStorage.getItem("localMeals");
      const storedPhotos = await AsyncStorage.getItem("progress_photos");

      setLifts(storedLifts ? JSON.parse(storedLifts) : []);
      setMeals(storedMeals ? JSON.parse(storedMeals) : []);
      setPhotos(storedPhotos ? JSON.parse(storedPhotos) : []);
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

  // Group photos by date (for same layout as camera gallery)
  const groupPhotosByDate = () => {
    const grouped: { [key: string]: Photo[] } = {};
    photos.forEach((photo) => {
      if (!grouped[photo.date]) grouped[photo.date] = [];
      grouped[photo.date].push(photo);
    });
    return grouped;
  };

  const groupedPhotos = groupPhotosByDate();
  const sortedDates = Object.keys(groupedPhotos).sort((a, b) => {
    const photoA = groupedPhotos[a][0];
    const photoB = groupedPhotos[b][0];
    return photoB.timestamp - photoA.timestamp;
  });

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

        {lifts.length === 0 && meals.length === 0 && photos.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={64} color="#6b7280" strokeWidth={1.5} />
            <Text style={styles.emptyText}>No history yet</Text>
            <Text style={styles.emptySubtext}>
              Start logging workouts, meals, or photos
            </Text>
          </View>
        ) : (
          <>
            {/* --- Lift History --- */}
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

            {/* --- Meal History --- */}
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

            {/* --- Photo Gallery History --- */}
            {photos.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Photo Gallery</Text>
                {sortedDates.map((date) => (
                  <View key={date} style={{ marginBottom: 24 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#fff",
                        marginBottom: 8,
                      }}
                    >
                      {date}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "flex-start",
                      }}
                    >
                      {groupedPhotos[date].map((photo) => (
                        <Image
                          key={photo.timestamp}
                          source={{ uri: photo.uri }}
                          style={{
                            width: 110,
                            height: 110,
                            borderRadius: 10,
                            marginRight: 8,
                            marginBottom: 8,
                          }}
                        />
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* --- Empty Gallery Fallback --- */}
            {photos.length === 0 && (
              <View style={styles.section}>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 24,
                  }}
                >
                  <ImageIcon size={64} color="#6b7280" />
                  <Text style={{ color: "#9ca3af", marginTop: 8 }}>
                    No progress photos yet
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
