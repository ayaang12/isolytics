import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Activity, Timer, Zap } from 'lucide-react-native';

export default function Cardio() {
  return (
    <LinearGradient colors={['#000000', '#1a0033', '#2d0052']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Cardio</Text>
          <Text style={styles.subtitle}>Track your cardiovascular workouts</Text>
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

          <TouchableOpacity style={styles.workoutCard}>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  workoutCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  workoutIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#2d1b4e',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  workoutSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
