import React from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type Props = {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  onSubmit: () => Promise<void> | void;
  onSwitch: () => void;
};

const SignUp: React.FC<Props> = ({
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
  onSwitch,
}) => {
  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Sign Up" onPress={() => onSubmit()} />
      <View style={styles.switchRow}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={onSwitch}>
          <Text style={styles.link}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: { borderWidth: 1, marginBottom: 10, padding: 8 },
  switchRow: { flexDirection: "row", marginTop: 12, alignItems: "center" },
  link: { color: "#0066cc" },
});

export default SignUp;
