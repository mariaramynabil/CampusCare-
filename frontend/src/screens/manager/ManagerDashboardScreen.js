import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

const CATEGORY_NAMES = {
  1: "Electrical",
  2: "Plumbing",
  3: "Cleaning",
  4: "Furniture",
  5: "Other",
};

const normalizeStatus = (status) => {
  if (!status) return "pending";

  return String(status)
    .toLowerCase()
    .replace(" ", "_");
};

export default function ManagerDashboardScreen({ navigation }) {
  const { logout } = useAuth();

  const [issues, setIssues] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await api.get("/issues");
      setIssues(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("Fetch issues error:", error?.response?.data || error.message);
      Alert.alert("Error", "Could not load issues.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchIssues();
    }, [])
  );

  const filteredIssues =
    selectedFilter === "all"
      ? issues
      : issues.filter(
          (issue) => normalizeStatus(issue.status) === selectedFilter
        );

  const updateStatus = async (issueId, status) => {
    try {
      await api.put(`/issues/${issueId}/status`, { status });
      await fetchIssues();
    } catch (error) {
      console.log("Update status error:", error?.response?.data || error.message);
      Alert.alert("Error", "Could not update issue status.");
    }
  };

  const closeIssue = async (issueId) => {
    try {
      await api.put(`/issues/${issueId}/close`);
      await fetchIssues();
    } catch (error) {
      console.log("Close issue error:", error?.response?.data || error.message);
      Alert.alert("Error", "Could not close issue.");
    }
  };

  const renderIssue = ({ item }) => {
    const status = normalizeStatus(item.status);
    const categoryName =
      item.category ||
      CATEGORY_NAMES[item.category_id] ||
      "No category";

    return (
      <View style={styles.issueCard}>
        <View style={styles.issueHeader}>
          <View>
            <Text style={styles.issueTitle}>{item.title}</Text>
            <Text style={styles.issueMeta}>{categoryName}</Text>
            <Text style={styles.issueDate}>
              {item.created_at
                ? new Date(item.created_at).toLocaleDateString()
                : "No date"}
            </Text>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{status.replace("_", " ")}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.darkButton}
            onPress={() => navigation.navigate("AssignIssue", { issue: item })}
          >
            <Text style={styles.buttonText}>Assign</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.darkButton}
            onPress={() => updateStatus(item.id, "resolved")}
          >
            <Text style={styles.buttonText}>Resolve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.redButton}
            onPress={() => closeIssue(item.id)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Issues</Text>

      <View style={styles.filters}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterButton,
              selectedFilter === filter.value && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter.value)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.value && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredIssues}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderIssue}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No issues found.</Text>
          }
        />
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    padding: 16,
    backgroundColor: "#fff",
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 14,
    backgroundColor: "#fff",
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
  },
  filterButtonActive: {
    backgroundColor: "#2563eb",
  },
  filterText: {
    fontWeight: "700",
    color: "#111827",
  },
  filterTextActive: {
    color: "#fff",
  },
  list: {
    padding: 14,
    paddingBottom: 90,
  },
  issueCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  issueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  issueTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  issueMeta: {
    color: "#4b5563",
    marginBottom: 8,
  },
  issueDate: {
    color: "#6b7280",
  },
  statusBadge: {
    backgroundColor: "#6b7280",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "#fff",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  darkButton: {
    flex: 1,
    backgroundColor: "#374151",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  redButton: {
    flex: 1,
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButton: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    backgroundColor: "#dc2626",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#6b7280",
  },
});