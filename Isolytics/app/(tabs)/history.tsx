import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, TrendingUp } from 'lucide-react-native';

export default function History() {
  return (
    <LinearGradient colors={['#000000', '#1a0033', '#2d0052']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>Track your progress over time</Text>
        </View>

        <View style={styles.emptyState}>
          <Calendar size={64} color="#6b7280" strokeWidth={1.5} />
          <Text style={styles.emptyText}>No workout history yet</Text>
          <Text style={styles.emptySubtext}>Start logging your workouts to see your progress</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TrendingUp size={20} color="#a855f7" />
              <Text style={styles.cardTitle}>Weekly Summary</Text>
            </View>
            <Text style={styles.cardText}>Your workout history will appear here</Text>
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d1d5db',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
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
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
});
