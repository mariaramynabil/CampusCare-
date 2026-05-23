import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function AppButton({ title, onPress, loading, secondary, danger }) {
  return (
    <TouchableOpacity
      style={[styles.button, secondary && styles.secondary, danger && styles.danger]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  secondary: {
    backgroundColor: "#374151",
  },
  danger: {
    backgroundColor: "#dc2626",
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
