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
import { useAuth } from "../../context/AuthContext";

const CATEGORY_NAMES = {
  1: "Electrical",
  2: "Plumbing",
  3: "Cleaning",
  4: "Furniture",
  5: "Other",
};

export default function AssignedIssuesScreen({ navigation }) {
  const { logout } = useAuth();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchAssignedIssues = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get("/issues/assigned");

      setIssues(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(
        "Fetch assigned issues error:",
        error?.response?.data || error.message
      );

      setMessage(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error.message ||
          "Could not load assigned issues."
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAssignedIssues();
    }, [])
  );

  const openIssue = (issue) => {
    navigation.navigate("WorkIssue", {
      issue: issue,
      issueId: issue.id,
    });
  };

  const renderIssue = ({ item }) => {
    const categoryName =
      item.category ||
      CATEGORY_NAMES[item.category_id] ||
      "No category";

    return (
      <TouchableOpacity
        style={styles.issueCard}
        onPress={() => openIssue(item)}
      >
        <View style={styles.issueHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.issueTitle}>{item.title || "Untitled Issue"}</Text>
            <Text style={styles.issueMeta}>{categoryName}</Text>
            <Text style={styles.issueLocation}>
              {item.custom_location || item.location || "No location"}
            </Text>
            <Text style={styles.issueDate}>
              {item.created_at
                ? new Date(item.created_at).toLocaleDateString()
                : "No date"}
            </Text>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {item.status || "pending"}
            </Text>
          </View>
        </View>

        <Text style={styles.tapText}>Tap to work on this issue</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned Issues</Text>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={issues}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderIssue}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No assigned issues found.</Text>
          }
        />
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
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
    fontSize: 24,
    fontWeight: "900",
    padding: 18,
    backgroundColor: "#fff",
    color: "#111827",
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
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  issueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  issueTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 6,
    color: "#111827",
  },
  issueMeta: {
    color: "#4b5563",
    fontWeight: "700",
    marginBottom: 4,
  },
  issueLocation: {
    color: "#6b7280",
    marginBottom: 4,
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
    fontWeight: "800",
    textTransform: "capitalize",
  },
  tapText: {
    marginTop: 14,
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
  logoutText: {
    color: "#fff",
    fontWeight: "900",
  },
});