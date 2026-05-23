import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import api from "../../api/api";

export default function AssignIssueScreen({ route, navigation }) {
  const { issueId } = route.params;
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/manager/workers")
      .then((response) => setWorkers(response.data))
      .catch((error) => Alert.alert("Error", error?.response?.data?.error || "Could not load workers."))
      .finally(() => setLoading(false));
  }, []);

  const assignWorker = async (workerId) => {
    try {
      await api.put(`/issues/${issueId}/assign`, { assigned_worker_id: workerId });
      Alert.alert("Success", "Worker assigned successfully.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.error || "Could not assign worker.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={workers}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListEmptyComponent={<Text style={styles.empty}>No workers found. Create worker accounts first.</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.workerCard} onPress={() => assignWorker(item.id)}>
          <Text style={styles.name}>{item.full_name}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.status}>{item.is_active ? "Active" : "Inactive"}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f3f4f6",
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  workerCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  name: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111827",
  },
  email: {
    marginTop: 4,
    color: "#4b5563",
  },
  status: {
    marginTop: 8,
    fontWeight: "700",
    color: "#2563eb",
  },
  empty: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 40,
  },
});
