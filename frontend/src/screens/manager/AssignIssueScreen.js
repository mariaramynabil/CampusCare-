import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../../api/api";

export default function AssignIssueScreen({ route, navigation }) {
  const issue = route.params?.issue;

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigningId, setAssigningId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get("/manager/workers");

      setWorkers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("Fetch workers error:", error?.response?.data || error.message);
      setMessage(
        error?.response?.data?.error ||
          error?.message ||
          "Could not load workers."
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWorkers();
    }, [])
  );

  const handleAssignWorker = async (worker) => {
    if (!issue?.id) {
      setMessage("No issue selected.");
      return;
    }

    try {
      setAssigningId(worker.id);
      setMessage("");

      await api.put(`/issues/${issue.id}/assign`, {
        worker_id: worker.id,
      });

      setMessage(`Issue assigned to ${worker.full_name || worker.name || "worker"}.`);

      setTimeout(() => {
        navigation.goBack();
      }, 900);
    } catch (error) {
      console.log("Assign worker error:", error?.response?.data || error.message);

      setMessage(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Could not assign worker."
      );
    } finally {
      setAssigningId(null);
    }
  };

  const renderWorker = ({ item }) => {
    const name = item.full_name || item.name || "Unnamed Worker";
    const email = item.email || "No email";
    const isActive = item.is_active !== false;

    return (
      <TouchableOpacity
        style={styles.workerCard}
        onPress={() => handleAssignWorker(item)}
        disabled={assigningId !== null}
      >
        <Text style={styles.workerName}>{name}</Text>
        <Text style={styles.workerEmail}>{email}</Text>
        <Text style={styles.workerStatus}>
          {isActive ? "Active" : "Inactive"}
        </Text>

        {assigningId === item.id ? (
          <Text style={styles.assigningText}>Assigning...</Text>
        ) : (
          <Text style={styles.tapText}>Tap to assign</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Assign Worker</Text>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={workers}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderWorker}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No workers found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    fontSize: 24,
    fontWeight: "800",
    padding: 18,
    backgroundColor: "#fff",
  },
  list: {
    padding: 14,
  },
  workerCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  workerName: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  workerEmail: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 10,
  },
  workerStatus: {
    fontSize: 16,
    color: "#2563eb",
    fontWeight: "800",
    marginBottom: 10,
  },
  tapText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "700",
  },
  assigningText: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "800",
  },
  message: {
    margin: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    fontWeight: "800",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#6b7280",
  },
});