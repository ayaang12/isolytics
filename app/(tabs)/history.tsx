import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, TrendingUp } from "lucide-react-native";

import { styles } from "./history.styles";

export default function History() {
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
      </ScrollView>
    </LinearGradient>
  );
}
