import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../../api/api";
import AppButton from "../../components/AppButton";
import IssueCard from "../../components/IssueCard";
import { useAuth } from "../../context/AuthContext";

const statuses = ["All", "Pending", "In Progress", "Resolved", "Closed"];

export default function ManagerDashboardScreen({ navigation }) {
  const { logout } = useAuth();
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadIssues = async () => {
    const query = statusFilter === "All" ? "" : `?status=${encodeURIComponent(statusFilter)}`;
    const response = await api.get(`/issues${query}`);
    setIssues(response.data);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadIssues()
        .catch((error) => Alert.alert("Error", error?.response?.data?.error || "Could not load issues."))
        .finally(() => setLoading(false));
    }, [statusFilter])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadIssues().catch((error) => console.log(error?.response?.data || error.message));
    setRefreshing(false);
  };

  const updateStatus = async (issueId, status) => {
    try {
      await api.put(`/issues/${issueId}/status`, { status });
      await loadIssues();
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.error || "Could not update status.");
    }
  };

  const closeIssue = async (issueId) => {
    try {
      await api.put(`/issues/${issueId}/close`);
      await loadIssues();
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.error || "Could not close issue.");
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
    <View style={styles.page}>
      <View style={styles.filters}>
        {statuses.map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filter, statusFilter === status && styles.filterActive]}
            onPress={() => setStatusFilter(status)}
          >
            <Text style={[styles.filterText, statusFilter === status && styles.filterTextActive]}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={issues}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No issues found.</Text>}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <IssueCard issue={item} onPress={() => navigation.navigate("IssueDetails", { issueId: item.id })} />
            <View style={styles.actions}>
              <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate("AssignIssue", { issueId: item.id })}>
                <Text style={styles.smallButtonText}>Assign</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallButton} onPress={() => updateStatus(item.id, "Resolved")}>
                <Text style={styles.smallButtonText}>Resolve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallButtonDanger} onPress={() => closeIssue(item.id)}>
                <Text style={styles.smallButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.logout}>
        <AppButton title="Logout" danger onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  filter: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
  },
  filterActive: {
    backgroundColor: "#2563eb",
  },
  filterText: {
    color: "#111827",
    fontWeight: "700",
  },
  filterTextActive: {
    color: "#fff",
  },
  list: {
    padding: 16,
    paddingBottom: 90,
  },
  empty: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 40,
  },
  cardWrap: {
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  smallButton: {
    backgroundColor: "#374151",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  smallButtonDanger: {
    backgroundColor: "#dc2626",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  smallButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  logout: {
    position: "absolute",
    bottom: 12,
    left: 16,
    right: 16,
  },
});
