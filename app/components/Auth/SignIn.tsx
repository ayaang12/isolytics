import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
const provider = new GoogleAuthProvider();
const auth = getAuth();

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
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log("Google sign-in success", { user, token });
    } catch (error: any) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData?.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error("Google sign-in error", {
        errorCode,
        errorMessage,
        email,
        credential,
      });
    }
  };

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
      <View style={{ marginTop: 10 }}>
        <Button
          title="Sign in with Google"
          onPress={handleGoogleSignIn}
          color="#DB4437"
        />
      </View>
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
