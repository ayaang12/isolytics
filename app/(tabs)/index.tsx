import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Activity, TrendingUp, Target, Camera, HeartPulse } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

import { styles } from "./index.styles";
import { router } from "expo-router";

interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  waist: number;
  neck: number;
  hip: number;
  gender: string;
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
    const waist = profile.waist;
    const neck = profile.neck;
    const height = profile.height;
    const hip = profile.hip;
    const genderChoice = profile.gender;
    if (genderChoice === "m") {
      return (
        86.01 * Math.log10(waist - neck) -
        70.041 * Math.log10(height) +
        36.76
      ).toFixed(1);
    } else {
      return (
        163.205 * Math.log10(waist + hip - neck) -
        97.684 * Math.log10(height) -
        78.387
      ).toFixed(1);
    }
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
            <Text style={styles.statLabel}>Body Fat %</Text>
            <Text style={styles.statValue}>{calculateBMI()}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <TrendingUp size={24} color="#a855f7" />
            </View>
            <Text style={styles.statLabel}>Weight</Text>
            <Text style={styles.statValue}>{profile?.weight || 0} lbs</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Target size={24} color="#a855f7" />
            </View>
            <Text style={styles.statLabel}>Height</Text>
            <Text style={styles.statValue}>
              {(() => {
                const h = Math.round(profile?.height || 0);
                return `${Math.floor(h / 12)}' ${h % 12}"`;
              })()}
            </Text>
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

          <TouchableOpacity
            style={[styles.cameraActionCard, { flexDirection: "row", alignItems: "center" }]}
            onPress={() => router.push("/camera")}
          >
            <View style={[styles.cameraIconContainer, { marginRight: 10 }]}>
              <Camera size={24} color="#a855f7" />
            </View>
            <Text style={styles.actionText}>Camera / Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { flexDirection: "row", alignItems: "center" }]}
            onPress={() => router.push("/lifts" as any)}
          >
            <View style={[styles.cameraIconContainer, { marginRight: 10 }]}>
              <Target size={24} color="#a855f7" />
            </View>
            <Text style={styles.actionText}>Start a New Workout Session</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { flexDirection: "row", alignItems: "center" }]}
            onPress={() => router.push("/cardio" as any)}
          >
            <View style={[styles.cameraIconContainer, { marginRight: 10 }]}>
              <HeartPulse size={24} color="#a855f7" />
            </View>
            <Text style={styles.actionText}>Log Your Cardio Activity</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { flexDirection: "row", alignItems: "center" }]}
            onPress={() => router.push("/chat" as any)}
          >
            <View style={[styles.cameraIconContainer, { marginRight: 10 }]}>
              <Activity size={24} color="#a855f7" />
            </View>
            <Text style={styles.actionText}>AI Chat</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
