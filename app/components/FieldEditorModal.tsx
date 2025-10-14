import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";

type Props = {
  visible: boolean;
  title: string;
  initialValue?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  onCancel: () => void;
  onSave: (value: string) => Promise<void>;
};

export default function FieldEditorModal({
  visible,
  title,
  initialValue = "",
  placeholder,
  keyboardType = "default",
  onCancel,
  onSave,
}: Props) {
  const [value, setValue] = useState<string>(initialValue);
  const [saving, setSaving] = useState(false);

  // keep local value in sync when modal opens with different initialValue
  React.useEffect(() => {
    if (visible) setValue(initialValue);
  }, [visible, initialValue]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(value);
      setSaving(false);
      onCancel();
    } catch (err: any) {
      setSaving(false);
      Alert.alert("Update failed", err?.message ?? String(err));
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            keyboardType={keyboardType}
          />
          <View style={styles.buttons}>
            <Pressable
              style={[styles.button, styles.cancel]}
              onPress={onCancel}
              disabled={saving}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.save]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#0f1724",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
    marginBottom: 12,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  cancel: {
    backgroundColor: "#374151",
  },
  save: {
    backgroundColor: "#7c3aed",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
