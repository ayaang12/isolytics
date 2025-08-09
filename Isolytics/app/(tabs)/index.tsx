import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, Target, TrendingUp, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);

  const handleGetStarted = () => {
    router.push('/auth/signin');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#1F2937', '#111827']}
          style={styles.loadingGradient}
        >
          <Activity size={40} color="#A855F7" />
          <Text style={styles.loadingText}>Loading...</Text>
        </LinearGradient>
      </View>
    );
  }

  if (!user) {
    return (
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={['#1F2937', '#111827']}
          style={styles.hero}
        >
          <View style={styles.heroContent}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#8B5CF6', '#A855F7']}
                style={styles.logoGradient}
              >
                <Activity size={40} color="#FFFFFF" />
              </LinearGradient>
            </View>
            
            <Text style={styles.appTitle}>Isolytics</Text>
            <Text style={styles.tagline}>Track. Train. Transform.</Text>
            
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Target size={24} color="#A855F7" />
                <Text style={styles.featureText}>Goal Setting</Text>
              </View>
              <View style={styles.featureItem}>
                <TrendingUp size={24} color="#A855F7" />
                <Text style={styles.featureText}>Progress Tracking</Text>
              </View>
              <View style={styles.featureItem}>
                <Calendar size={24} color="#A855F7" />
                <Text style={styles.featureText}>Meal Planning</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
              <LinearGradient
                colors={['#8B5CF6', '#A855F7']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>10K+</Text>
                <Text style={styles.statLabel}>Active Users</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1M+</Text>
                <Text style={styles.statLabel}>Meals Tracked</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>95%</Text>
                <Text style={styles.statLabel}>Success Rate</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Why Choose Isolytics?</Text>
          
          <View style={styles.benefitCard}>
            <Text style={styles.benefitTitle}>🎯 Precision Tracking</Text>
            <Text style={styles.benefitDescription}>
              Track calories, macros, and micronutrients with scientific precision
            </Text>
          </View>

          <View style={styles.benefitCard}>
            <Text style={styles.benefitTitle}>📊 Smart Analytics</Text>
            <Text style={styles.benefitDescription}>
              AI-powered insights to optimize your nutrition and training
            </Text>
          </View>

          <View style={styles.benefitCard}>
            <Text style={styles.benefitTitle}>🏆 Goal Achievement</Text>
            <Text style={styles.benefitDescription}>
              Personalized plans to help you reach your fitness goals faster
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.dashboardHeader}
      >
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>
      </LinearGradient>

      <View style={styles.dashboardContent}>
        <View style={styles.emptyStateContainer}>
          <Activity size={48} color="#6B7280" />
          <Text style={styles.emptyStateTitle}>Ready to Start Your Journey?</Text>
          <Text style={styles.emptyStateText}>
            Begin tracking your meals and workouts to see your progress here.
          </Text>
          <TouchableOpacity 
            style={styles.startTrackingButton}
            onPress={() => router.push('/(tabs)/meals')}
          >
            <LinearGradient
              colors={['#8B5CF6', '#A855F7']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Start Tracking</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  hero: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: '#9CA3AF',
    marginBottom: 40,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    color: '#E5E7EB',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  getStartedButton: {
    width: width - 40,
    marginBottom: 40,
  },
  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A855F7',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#374151',
  },
  contentSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  benefitCard: {
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  dashboardHeader: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 4,
  },
  dashboardContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  startTrackingButton: {
    width: 200,
  },
  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});