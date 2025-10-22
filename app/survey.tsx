import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { styles } from "./survey.styles";

export default function Survey() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!user) {
      setError("Please wait for authentication to complete");
      return;
    }

    if (
      !name ||
      !age ||
      !height ||
      !weight ||
      !waist ||
      !neck ||
      !hip ||
      !gender
    ) {
      setError("Please fill in all fields");
      return;
    }

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    const neckNum = parseFloat(neck);
    const waistNum = parseFloat(waist);
    const hipNum = parseFloat(hip);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum >= 150) {
      setError("Please enter a valid age");
      return;
    }

    if (isNaN(heightNum) || heightNum <= 0 || heightNum >= 300) {
      setError("Please enter a valid height in inches");
      return;
    }

    if (isNaN(weightNum) || weightNum <= 0 || weightNum >= 500) {
      setError("Please enter a valid weight in lbs");
      return;
    }

    if (isNaN(waistNum) || waistNum <= 0 || waistNum >= 500) {
      setError("Please enter a valid waist measurement in inches");
      return;
    }

    if (isNaN(neckNum) || neckNum <= 0 || neckNum >= 500) {
      setError("Please enter a valid neck measurement in inches");
      return;
    }

    if (isNaN(hipNum) || hipNum <= 0 || hipNum >= 500) {
      setError("Please enter a valid hip measurement in inches");
      return;
    }

    const genderLower = gender.trim().toLowerCase();
    if (genderLower !== "m" && genderLower !== "f") {
      setError("Please enter your gender as 'm' or 'f'");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.from("user_profiles").insert({
        user_id: user.id,
        name,
        age: ageNum,
        height: heightNum,
        weight: weightNum,
        waist: waistNum,
        neck: neckNum,
        hip: hipNum,
        gender,
      });

      if (error) throw error;

      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#000000", "#1a0033", "#2d0052"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>
              Help us personalize your experience
            </Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="#6b7280"
                  value={name}
                  onChangeText={setName}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your age"
                  placeholderTextColor="#6b7280"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Height (in)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your height in inches"
                  placeholderTextColor="#6b7280"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="decimal-pad"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Weight (lbs)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your weight in lbs"
                  placeholderTextColor="#6b7280"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Waist (in)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your waist measurement in inches"
                  placeholderTextColor="#6b7280"
                  value={waist}
                  onChangeText={setWaist}
                  keyboardType="decimal-pad"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Neck (in)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your neck measurement in inches"
                  placeholderTextColor="#6b7280"
                  value={neck}
                  onChangeText={setNeck}
                  keyboardType="decimal-pad"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Hip (in)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your hip measurement in inches"
                  placeholderTextColor="#6b7280"
                  value={hip}
                  onChangeText={setHip}
                  keyboardType="decimal-pad"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your gender(m or f)"
                  placeholderTextColor="#6b7280"
                  value={gender}
                  onChangeText={setGender}
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Continue</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

