import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ListRenderItem,
} from "react-native";
import axios from "axios";
import ChatBubble from "./ChatBubble";
import { speak, isSpeakingAsync, stop } from "expo-speech";

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

const Chatbot: React.FC = () => {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const API_KEY = "AIzaSyAiGjNLDQKSKx8NV_TsbwCg5mZYCBIT5W0";

  const handleUserInput = async (): Promise<void> => {
    if (!userInput.trim()) return;

    const updatedChat: ChatMessage[] = [
      ...chat,
      { role: "user", parts: [{ text: userInput }] },
    ];

    setChat(updatedChat);
    setLoading(true);
    setError(null);

    try {
      // ✅ Correct Gemini 1.5 Flash endpoint and format
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        {
          contents: [
            ...updatedChat.map((msg) => ({
              role: msg.role,
              parts: msg.parts.map((p) => ({ text: p.text })),
            })),
            {
              role: "user",
              parts: [{ text: userInput }],
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Gemini API Response:", response.data);

      const modelResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (modelResponse) {
        const updatedChatWithModel: ChatMessage[] = [
          ...updatedChat,
          { role: "model", parts: [{ text: modelResponse }] },
        ];
        setChat(updatedChatWithModel);
        setUserInput("");
      }
    } catch (err: any) {
      console.error("Gemini API Error:", err.response?.data || err.message);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async (text: string): Promise<void> => {
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
    } else {
      if (!(await isSpeakingAsync())) {
        speak(text);
        setIsSpeaking(true);
      }
    }
  };

  const renderChatItem: ListRenderItem<ChatMessage> = ({ item }) => (
    <ChatBubble
      role={item.role}
      text={item.parts[0].text}
      onSpeak={() => handleSpeak(item.parts[0].text)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat with Gemini 1.5 Flash</Text>

      <FlatList
        data={chat}
        renderItem={renderChatItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#aaa"
          value={userInput}
          onChangeText={setUserInput}
        />
        <TouchableOpacity style={styles.button} onPress={handleUserInput}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator color="#333" style={styles.loading} />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#1a0033" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    marginTop: 40,
    textAlign: "center",
  },
  chatContainer: { flexGrow: 1, justifyContent: "flex-end" },
  inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  input: {
    flex: 1,
    height: 50,
    marginRight: 10,
    padding: 8,
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 25,
    color: "#333",
    backgroundColor: "#fff",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#007AFF",
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  loading: { marginTop: 10 },
  error: { color: "red", marginTop: 10 },
});

export default Chatbot;
