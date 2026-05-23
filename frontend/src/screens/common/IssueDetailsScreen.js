import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import api from "../../api/api";

export default function IssueDetailsScreen({ route }) {
  const { issueId } = route.params;
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/issues/${issueId}`)
      .then((response) => setIssue(response.data))
      .catch((error) => console.log(error?.response?.data || error.message))
      .finally(() => setLoading(false));
  }, [issueId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!issue) {
    return (
      <View style={styles.center}>
        <Text>Issue not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{issue.title}</Text>
      <Text style={styles.status}>{issue.status}</Text>

      {issue.image_url ? <Image source={{ uri: issue.image_url }} style={styles.image} /> : null}

      <View style={styles.card}>
        <Text style={styles.label}>Category</Text>
        <Text style={styles.value}>{issue.category || "-"}</Text>

        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{issue.location}</Text>

        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{issue.description}</Text>

        <Text style={styles.label}>Assigned Worker ID</Text>
        <Text style={styles.value}>{issue.assigned_worker_id || "Not assigned yet"}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f3f4f6",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },
  status: {
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 14,
    backgroundColor: "#2563eb",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
    fontWeight: "700",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  label: {
    fontWeight: "900",
    color: "#111827",
    marginTop: 12,
  },
  value: {
    color: "#4b5563",
    marginTop: 4,
    lineHeight: 21,
  },
});
