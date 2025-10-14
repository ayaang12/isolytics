import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Activity, TrendingUp, Target } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
}

export default function Home() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
    }
  };

  const calculateBMI = () => {
    if (!profile) return 0;
    // const waistInInches = profile.waist / 2.54;
    // const neckInInches = profile.neck / 2.54;
    // const heightInInches = profile.height / 2.54;
    // const hipInInches = profile.hip / 2.54;
    // men return(86.010 * Math.log10(waistInInches - neckInInches) - 70.041 * Math.log10(heightInInches) + 36.76;).toFixed(1);
    // women return(163.205 * Math.log10(waistInInches + hipInInches - neckInInches) - 97.684 * Math.log10(heightInInches) - 78.387;)
  };

  return (
    <LinearGradient
      colors={["#000000", "#1a0033", "#2d0052"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{profile?.name || "User"}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Activity size={24} color="#a855f7" />
            </View>
            <Text style={styles.statLabel}>BMI</Text>
            <Text style={styles.statValue}>{calculateBMI()}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <TrendingUp size={24} color="#a855f7" />
            </View>
            <Text style={styles.statLabel}>Weight</Text>
            <Text style={styles.statValue}>{profile?.weight || 0} kg</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Target size={24} color="#a855f7" />
            </View>
            <Text style={styles.statLabel}>Height</Text>
            <Text style={styles.statValue}>{profile?.height || 0} cm</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewText}>
              Track your fitness journey and reach your goals
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionCard}>
            <Text style={styles.actionText}>Start a new workout session</Text>
          </View>
          <View style={styles.actionCard}>
            <Text style={styles.actionText}>Log your cardio activity</Text>
          </View>
          <View style={styles.actionCard}>
            <Text style={styles.actionText}>View your progress</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 18,
    color: "#9ca3af",
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  overviewCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  overviewText: {
    fontSize: 16,
    color: "#d1d5db",
    lineHeight: 24,
  },
  actionCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  actionText: {
    fontSize: 16,
    color: "#d1d5db",
  },
});
