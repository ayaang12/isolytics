import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Award, Calendar, Target } from 'lucide-react-native';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function ProgressScreen() {
  return (
    <ProtectedRoute>
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={['#1F2937', '#111827']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Progress</Text>
          <Text style={styles.headerSubtitle}>Track your fitness journey</Text>
        </LinearGradient>

      <View style={styles.content}>
        <View style={styles.emptyProgressContainer}>
          <TrendingUp size={48} color="#6B7280" />
          <Text style={styles.emptyProgressTitle}>Start Your Progress Journey</Text>
          <Text style={styles.emptyProgressText}>
            Track your meals and workouts to see your progress and achievements here.
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
  emptyProgressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyProgressTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyProgressText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
});