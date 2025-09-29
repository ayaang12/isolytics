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

const SignIn: React.FC<Props> = ({
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
  onSwitch,
}) => {
  return (
    <View>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign In</Text>
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
      <Button title="Sign In" onPress={() => onSubmit()} />
      <View style={styles.switchRow}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={onSwitch}>
          <Text style={styles.link}>Sign up</Text>
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

export default SignIn;
