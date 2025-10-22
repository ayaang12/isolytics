import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Heart, Activity, Timer, Zap } from "lucide-react-native";
import { useRouter } from "expo-router";

import { styles } from "./cardio.styles";

export default function Cardio() {
  const router = useRouter();
  return (
    <LinearGradient
      colors={["#000000", "#1a0033", "#2d0052"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Cardio</Text>
          <Text style={styles.subtitle}>
            Track your cardiovascular workouts
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Heart size={28} color="#a855f7" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Avg Heart Rate</Text>
          </View>

          <View style={styles.statCard}>
            <Timer size={28} color="#a855f7" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Total Minutes</Text>
          </View>

          <View style={styles.statCard}>
            <Zap size={28} color="#a855f7" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Calories Burned</Text>
          </View>

          <View style={styles.statCard}>
            <Activity size={28} color="#a855f7" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Start a Workout</Text>

          <TouchableOpacity
            style={styles.workoutCard}
            onPress={() => router.push("/cardioTrack")}
          >
            <View style={styles.workoutIcon}>
              <Activity size={24} color="#a855f7" />
            </View>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>Running</Text>
              <Text style={styles.workoutSubtitle}>Track your run</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.workoutCard}>
            <View style={styles.workoutIcon}>
              <Activity size={24} color="#a855f7" />
            </View>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>Cycling</Text>
              <Text style={styles.workoutSubtitle}>Log your ride</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.workoutCard}>
            <View style={styles.workoutIcon}>
              <Activity size={24} color="#a855f7" />
            </View>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>Swimming</Text>
              <Text style={styles.workoutSubtitle}>Track your swim</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.workoutCard}>
            <View style={styles.workoutIcon}>
              <Activity size={24} color="#a855f7" />
            </View>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>Other</Text>
              <Text style={styles.workoutSubtitle}>Custom cardio workout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
