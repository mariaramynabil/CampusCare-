import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../../api/api";
import AppButton from "../../components/AppButton";
import IssueCard from "../../components/IssueCard";
import { useAuth } from "../../context/AuthContext";

export default function AssignedIssuesScreen({ navigation }) {
  const { logout } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadIssues = async () => {
    const response = await api.get("/issues/assigned");
    setIssues(response.data);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadIssues()
        .catch((error) => Alert.alert("Error", error?.response?.data?.error || "Could not load assigned issues."))
        .finally(() => setLoading(false));
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadIssues().catch((error) => console.log(error?.response?.data || error.message));
    setRefreshing(false);
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
      <FlatList
        data={issues}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No assigned issues yet.</Text>}
        renderItem={({ item }) => (
          <IssueCard issue={item} onPress={() => navigation.navigate("WorkIssue", { issueId: item.id })} />
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
  container: {
    padding: 20,
    paddingBottom: 90,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 40,
  },
  logout: {
    position: "absolute",
    bottom: 12,
    left: 16,
    right: 16,
  },
});
