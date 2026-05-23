import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import AppButton from "../../components/AppButton";
import Input from "../../components/Input";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing data", "Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert("Login failed", error?.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>CampusCare</Text>
        <Text style={styles.subtitle}>Smart Facility Management System</Text>

        <View style={styles.card}>
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="example@email.com" keyboardType="email-address" />
          <Input label="Password" value={password} onChangeText={setPassword} placeholder="Your password" secureTextEntry />
          <AppButton title="Login" onPress={handleLogin} loading={loading} />
          <AppButton title="Create new account" secondary onPress={() => navigation.navigate("Register")} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  logo: {
    fontSize: 34,
    fontWeight: "900",
    color: "#2563eb",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
});
