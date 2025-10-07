import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "expo-router";

const Home = () => {
  const r = useRouter();
  const logout = async () => {
    try {
      await signOut(auth);
      r.replace("/");
    } catch (e) {
      console.log("logout error", e);
    }
  };
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Home</Text>
      <TouchableOpacity onPress={logout} style={{ padding: 8 }}>
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

// all code here rn is for the logout button that is made for debugging purposes so delete that when editing this
export default Home;
