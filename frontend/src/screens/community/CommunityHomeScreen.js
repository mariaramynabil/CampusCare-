import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppButton from "../../components/AppButton";
import { useAuth } from "../../context/AuthContext";

export default function CommunityHomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.full_name}</Text>
      <Text style={styles.subtitle}>Report campus facility issues and track their status.</Text>

      <AppButton title="Submit New Issue" onPress={() => navigation.navigate("SubmitIssue")} />
      <AppButton title="View My Issues" secondary onPress={() => navigation.navigate("MyIssues")} />
      <AppButton title="Logout" danger onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
    marginTop: 16,
  },
  subtitle: {
    color: "#6b7280",
    marginVertical: 8,
    marginBottom: 20,
  },
});
