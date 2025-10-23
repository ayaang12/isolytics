import React, { useState, useCallback } from "react";
import { View } from "react-native";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function Chat() {
  const [messages, setMessages] = useState([]);

  const sendMessage = useCallback(async (newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    const message = newMessages[0];

    try {
      const payload = { message: message.text };

      // replace with your actual Supabase Edge function URL
      const res = await axios.post(
        "https://xvzsqlnphjfulnrydugm.supabase.co/functions/v1/dynamic-service",
        payload
      );

      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: res.data.reply,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Artemis AI",
          avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712107.png",
        },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, botMessage)
      );
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => sendMessage(newMessages)}
        user={{ _id: 1 }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: { backgroundColor: "#4CAF50" },
              left: { backgroundColor: "#eee" },
            }}
          />
        )}
        renderSend={(props) => (
          <Send {...props}>
            <Ionicons
              name="send"
              size={26}
              color="#4CAF50"
              style={{ marginRight: 10 }}
            />
          </Send>
        )}
      />
    </View>
  );
}
