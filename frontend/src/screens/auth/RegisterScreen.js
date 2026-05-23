import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppButton from "../../components/AppButton";
import Input from "../../components/Input";
import { useAuth } from "../../context/AuthContext";

const roles = [
  { label: "Community Member", value: "community_member" },
  { label: "Facility Manager", value: "facility_manager" },
  { label: "Worker", value: "worker" },
];

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("community_member");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

 const handleRegister = async () => {
  setMessage("");

  if (!fullName || !email || !password) {
    setMessage("Please fill all fields.");
    return;
  }

  if (password.length < 6) {
    setMessage("Password must be at least 6 characters.");
    return;
  }

  try {
    setLoading(true);

    await register({
      full_name: fullName.trim(),
      email: email.trim(),
      password,
      role,
    });

    setMessage("Account created successfully. Redirecting to login...");

    setTimeout(() => {
      navigation.navigate("Login");
    }, 1200);
  } catch (error) {
    console.log("Register error:", error?.response?.data || error.message);
    setMessage(error?.response?.data?.error || "Register failed. Check backend/API.");
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Your name" />
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="example@email.com" keyboardType="email-address" />
          <Input label="Password" value={password} onChangeText={setPassword} placeholder="At least 6 characters" secureTextEntry />

          <Text style={styles.label}>Role</Text>
          <View style={styles.rolesWrapper}>
            {roles.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[styles.roleButton, role === item.value && styles.roleButtonActive]}
                onPress={() => setRole(item.value)}
              >
                <Text style={[styles.roleText, role === item.value && styles.roleTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}
          <AppButton title="Register" onPress={handleRegister} loading={loading} />
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
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  label: {
    fontWeight: "700",
    marginBottom: 8,
  },
  rolesWrapper: {
    gap: 8,
    marginBottom: 8,
  },
  roleButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 12,
    borderRadius: 10,
  },
  roleButtonActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  roleText: {
    color: "#111827",
    fontWeight: "600",
  },
  roleTextActive: {
    color: "#fff",
  },
  message: {
  marginBottom: 10,
  fontWeight: "700",
  color: "#2563eb",
},
});
