import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../../api/api";
import IssueCard from "../../components/IssueCard";

export default function MyIssuesScreen({ navigation }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadIssues = async () => {
    const response = await api.get("/issues/my");
    setIssues(response.data);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadIssues()
        .catch((error) => console.log(error?.response?.data || error.message))
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
    <FlatList
      data={issues}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={<Text style={styles.empty}>No issues submitted yet.</Text>}
      renderItem={({ item }) => (
        <IssueCard issue={item} onPress={() => navigation.navigate("IssueDetails", { issueId: item.id })} />
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
  empty: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 40,
  },
});
