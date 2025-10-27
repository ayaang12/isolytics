import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

interface Message {
  id: string;
  text: string;
  user: boolean;
}

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const GeminiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "AlzaSyD2esEL9yFHJx_Tm-m48gn1fOi-eRXhY0Gs"; 
  const MODEL = "gemini-2.5-flash";

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMsg: Message = { id: makeId(), text: userInput, user: true };
    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: userInput }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      console.log("Gemini raw response:", JSON.stringify(data, null, 2));

      
      const botText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ??
        data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join(" ") ??
        data?.promptFeedback?.blockReason ??
        "No response from model.";

      const botMsg: Message = { id: makeId(), text: botText, user: false };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Gemini error:", err);
      const errMsg: Message = {
        id: makeId(),
        text: "Error reaching Gemini API.",
        user: false,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <Text
        style={[
          styles.messageText,
          item.user ? styles.userMessage : styles.botMessage,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <LinearGradient
          colors={["#000000", "#1a0033", "#2d0052"]}
          style={styles.container}
        >
    <View style={styles.container}>
      <FlatList
        data={[...messages].reverse()}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message..."
          value={userInput}
          onChangeText={setUserInput}
          onSubmitEditing={sendMessage}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff" }}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 50 
  },
  messageContainer: { 
    padding: 10 
  },
  messageText: {
    fontSize: 16,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  botMessage: {
    backgroundColor: '#1f2937',
    color: '#ffffff',
    alignSelf: "flex-start",
  },
  userMessage: {
    backgroundColor: '#533a80', // Purple accent color
    color: "white",
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#1f2937",
    backgroundColor: '#374151',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "#1f2937",
    borderWidth: 1,
    backgroundColor: '#1e1e1eff',
    color: '#ffffff',
  },
  sendButton: {
    backgroundColor: '#533a80', // Purple accent color
    padding: 12,
    borderRadius: 10,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GeminiChat;
