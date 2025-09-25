import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);

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
    }
  };

  const signIn = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCred.user);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <View style={{ padding: 20, marginTop: 80 }}>
      {user ? (
        <>
          <Text>Welcome {user.email}</Text>
          <Button title="Logout" onPress={logOut} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
          />
          <Button title="Sign Up" onPress={signUp} />
          <Button title="Sign In" onPress={signIn} />
        </>
      )}
    </View>
  );
}
