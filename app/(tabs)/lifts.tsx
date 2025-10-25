import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from './lifts.styles';
import { LinearGradient } from "expo-linear-gradient";

interface Lift {
  id: string;
  exercise_name: string;
  weight: number;
  sets: number;
  reps: number;
  split_day: string;
  lift_date: string;
}

export default function LiftsScreen() {
  const { user } = useAuth();
  const [lifts, setLifts] = useState<Lift[]>([]);
  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [splitDay, setSplitDay] = useState('');
  const [liftDate, setLiftDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (user) {
      loadLifts();
    }
  }, [user]);

  const loadLifts = async () => {
    try {
      const { data, error } = await supabase
        .from('lifts')
        .select('*')
        .eq('user_id', user?.id)
        .order('lift_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLifts(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const addLift = async () => {
    if (!exerciseName.trim()) {
      Alert.alert('Error', 'Please enter an exercise name');
      return;
    }

    try {
      const { error } = await supabase.from('lifts').insert({
        user_id: user?.id,
        exercise_name: exerciseName,
        weight: parseFloat(weight) || 0,
        sets: parseInt(sets) || 0,
        reps: parseInt(reps) || 0,
        split_day: splitDay,
        lift_date: liftDate,
      });

      if (error) throw error;

      setExerciseName('');
      setWeight('');
      setSets('');
      setReps('');
      setSplitDay('');
      setLiftDate(new Date().toISOString().split('T')[0]);
      loadLifts();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const deleteLift = async (id: string) => {
    try {
      const { error } = await supabase.from('lifts').delete().eq('id', id);

      if (error) throw error;
      loadLifts();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#000000", "#1a0033", "#2d0052"]}
      style={styles.container}
        >

    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Lift Tracking</Text>
          <Text style={styles.subtitle}>Track your workouts and progress</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Exercise Name</Text>
            <TextInput
              style={styles.input}
              value={exerciseName}
              onChangeText={setExerciseName}
              placeholder="e.g., Bench Press, Squat"
              placeholderTextColor="#4A5568"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.label}>Weight (lbs)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="0"
                placeholderTextColor="#4A5568"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.label}>Sets</Text>
              <TextInput
                style={styles.input}
                value={sets}
                onChangeText={setSets}
                placeholder="0"
                placeholderTextColor="#4A5568"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.label}>Reps</Text>
              <TextInput
                style={styles.input}
                value={reps}
                onChangeText={setReps}
                placeholder="0"
                placeholderTextColor="#4A5568"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.label}>Split Day</Text>
              <TextInput
                style={styles.input}
                value={splitDay}
                onChangeText={setSplitDay}
                placeholder="e.g., Push, Pull, Legs"
                placeholderTextColor="#4A5568"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity style={styles.dateButton}>
              <Text style={styles.dateText}>{liftDate}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={addLift}>
            <Text style={styles.addButtonText}>Add Lift</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Recent Lifts</Text>

        {lifts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No lifts tracked yet</Text>
          </View>
        ) : (
          lifts.map((lift) => (
            <View key={lift.id} style={styles.liftCard}>
              <View style={styles.liftHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.liftName}>{lift.exercise_name}</Text>
                  <Text style={styles.liftDate}>{lift.lift_date}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteLift(lift.id)}
                >
                  <Text style={{ color: '#FF4444', fontSize: 18 }}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.liftDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Weight</Text>
                  <Text style={styles.detailValue}>{lift.weight} lbs</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Sets</Text>
                  <Text style={styles.detailValue}>{lift.sets}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Reps</Text>
                  <Text style={styles.detailValue}>{lift.reps}</Text>
                </View>
              </View>

              {lift.split_day ? (
                <View style={styles.splitBadge}>
                  <Text style={styles.splitText}>{lift.split_day}</Text>
                </View>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
    </View>
    </LinearGradient>
  );
}
