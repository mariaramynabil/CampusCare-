import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const statusColor = {
  Pending: "#f59e0b",
  "In Progress": "#2563eb",
  Resolved: "#16a34a",
  Closed: "#6b7280",
};

export default function IssueCard({ issue, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.title}>{issue.title}</Text>
        <Text style={[styles.status, { backgroundColor: statusColor[issue.status] || "#6b7280" }]}>
          {issue.status}
        </Text>
      </View>
      <Text style={styles.meta}>{issue.category || "No category"}</Text>
      <Text style={styles.meta}>{issue.location}</Text>
      <Text style={styles.date}>
        {issue.created_at ? new Date(issue.created_at).toLocaleDateString() : ""}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    flex: 1,
  },
  status: {
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "700",
  },
  meta: {
    marginTop: 5,
    color: "#4b5563",
  },
  date: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 12,
  },
});
