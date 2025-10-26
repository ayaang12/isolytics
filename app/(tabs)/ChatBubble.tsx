import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatBubbleProps {
  role: "user" | "model";
  text: string;
  onSpeak: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ role, text, onSpeak }) => {
  return (
    <View
      style={[
        styles.chatItem,
        role === "user" ? styles.userChatItem : styles.modelChatItem,
      ]}
    >
      <Text
        style={[
          styles.chatText,
          role === "model" ? styles.modelText : styles.userText,
        ]}
      >
        {text}
      </Text>

      {role === "model" && (
        <TouchableOpacity onPress={onSpeak} style={styles.speakerIcon}>
          <Ionicons name="volume-high-outline" size={22} color="#a855f7" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: "75%",
    position: "relative",
  },
  userChatItem: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  modelChatItem: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
  chatText: {
    fontSize: 16,
  },
  userText: {
    color: "#fff",
  },
  modelText: {
    color: "#000",
  },
  speakerIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
  },
});

export default ChatBubble;
