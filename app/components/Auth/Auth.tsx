import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { auth } from "../../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const signIn = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCred.user);
    } catch (err: any) {
      console.log(err.message);
      Alert.alert("Sign in failed", err.message);
    }
  };

  const signUp = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCred.user);
    } catch (err: any) {
      console.log(err.message);
      Alert.alert("Sign up failed", err.message);
    }
  };

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return user ? (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome {user.email}</Text>
      <Button title="Logout" onPress={logOut} />
    </View>
  ) : (
    <View style={styles.container}>
      {mode === "signin" ? (
        <SignIn
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          onSubmit={signIn}
          onSwitch={() => setMode("signup")}
        />
      ) : (
        <SignUp
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          onSubmit={signUp}
          onSwitch={() => setMode("signin")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 80,
  },
  welcome: {
    marginBottom: 12,
    fontSize: 16,
  },
});
