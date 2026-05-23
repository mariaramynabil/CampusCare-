import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function Input({ label, value, onChangeText, placeholder, secureTextEntry, multiline, keyboardType }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  label: {
    fontWeight: "700",
    marginBottom: 6,
    color: "#111827",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: "top",
  },
});
