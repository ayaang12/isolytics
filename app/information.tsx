import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import useAuth from "../hooks/useAuth";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import RNPickerSelect from "react-native-picker-select";

export const [form, setForm] = useState({
  name: "",
  age: "",
  height: "",
  weight: "",
  gender: "",
  genderAtBirth: "",
});
const Information = () => {
  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.age.trim()) errors.age = "Age is required";
    if (form.age && !/^[0-9]+$/.test(form.age))
      errors.age = "Age must be a number";
    if (!form.height.trim()) errors.height = "Height is required";
    if (form.height && !/^[0-9]+(\.?[0-9]*)?$/.test(form.height))
      errors.height = "Height must be numeric";
    if (!form.weight.trim()) errors.weight = "Weight is required";
    if (form.weight && !/^[0-9]+(\.?[0-9]*)?$/.test(form.weight))
      errors.weight = "Weight must be numeric";

    setErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // Save to Firestore under users/{uid}
    if (!user) {
      setSubmitError("You must be signed in to save information.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    const payload = {
      name: form.name.trim(),
      age: Number(form.age),
      height: Number(form.height),
      weight: Number(form.weight),
      gender: form.gender.trim(),
      updatedAt: new Date(),
    } as const;

    setDoc(doc(db, "users", user.uid), payload, { merge: true })
      .then(() => {
        setSubmitting(false);
        // Optionally show success feedback
      })
      .catch((err) => {
        setSubmitting(false);
        setSubmitError(err.message || "Failed to save information");
      });
  };

  // --- validation state ---
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { user } = useAuth();

  return (
    <ScrollView
      className="flex-1 bg-white p-5"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
    >
      <View className="w-full max-w-md mx-auto">
        <Text className="text-2xl font-bold mb-5 text-center">
          Enter Your Information
        </Text>
        <TextInput
          className="w-full h-11 border border-gray-300 rounded-lg mb-4 px-3 text-base bg-gray-50"
          placeholder="Name"
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
        />
        {errors.name ? (
          <Text className="text-red-600 mb-3">{errors.name}</Text>
        ) : null}
        <TextInput
          className="w-full h-11 border border-gray-300 rounded-lg mb-4 px-3 text-base bg-gray-50"
          placeholder="Age"
          value={form.age}
          keyboardType="numeric"
          onChangeText={(text) => handleChange("age", text)}
        />
        {errors.age ? (
          <Text className="text-red-600 mb-3">{errors.age}</Text>
        ) : null}
        <TextInput
          className="w-full h-11 border border-gray-300 rounded-lg mb-4 px-3 text-base bg-gray-50"
          placeholder="Height (cm)"
          value={form.height}
          keyboardType="numeric"
          onChangeText={(text) => handleChange("height", text)}
        />
        {errors.height ? (
          <Text className="text-red-600 mb-3">{errors.height}</Text>
        ) : null}
        <TextInput
          className="w-full h-11 border border-gray-300 rounded-lg mb-4 px-3 text-base bg-gray-50"
          placeholder="Weight (kg)"
          value={form.weight}
          keyboardType="numeric"
          onChangeText={(text) => handleChange("weight", text)}
        />
        {errors.weight ? (
          <Text className="text-red-600 mb-3">{errors.weight}</Text>
        ) : null}
        <TextInput
          className="w-full h-11 border border-gray-300 rounded-lg mb-4 px-3 text-base bg-gray-50"
          placeholder="Gender"
          value={form.gender}
          onChangeText={(text) => handleChange("gender", text)}
        />
        {errors.gender ? (
          <Text className="text-red-600 mb-3">{errors.gender}</Text>
        ) : null}
        {submitError ? (
          <Text className="text-red-600 mb-2 text-center">{submitError}</Text>
        ) : null}

        <RNPickerSelect
          onValueChange={(value) => handleChange("genderAtBirth", value)}
          items={[
            { label: "Male", value: "m" },
            { label: "Female", value: "f" },
          ]}
        />
        <Pressable
          className={`w-full rounded-lg py-3 mt-2 ${submitting ? "bg-gray-400" : "bg-blue-600"}`}
          onPress={submitting ? undefined : handleSubmit}
        >
          {submitting ? (
            <View className="flex-row justify-center items-center">
              <ActivityIndicator color="#fff" />
              <Text className="text-white text-center font-medium ml-3">
                Saving...
              </Text>
            </View>
          ) : (
            <Text className="text-white text-center font-medium">
              Save Information
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
};
export default Information;
