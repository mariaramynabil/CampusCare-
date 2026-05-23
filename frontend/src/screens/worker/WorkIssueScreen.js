import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../../api/api";
import AppButton from "../../components/AppButton";
import Input from "../../components/Input";

export default function WorkIssueScreen({ route, navigation }) {
  const { issueId } = route.params;
  const [issue, setIssue] = useState(null);
  const [comment, setComment] = useState("");
  const [completionImage, setCompletionImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get(`/issues/${issueId}`)
      .then((response) => setIssue(response.data))
      .catch((error) => Alert.alert("Error", error?.response?.data?.error || "Could not load issue."));
  }, [issueId]);

  const markInProgress = async () => {
    try {
      setLoading(true);
      await api.put(`/issues/${issueId}/status`, { status: "In Progress" });
      Alert.alert("Success", "Issue marked as In Progress.");
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.error || "Could not update issue.");
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!comment) {
      Alert.alert("Missing comment", "Please write a comment first.");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/issues/${issueId}/comments`, { content: comment });
      setComment("");
      Alert.alert("Success", "Comment added.");
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.error || "Could not add comment.");
    } finally {
      setLoading(false);
    }
  };

  const pickCompletionPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow gallery access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setCompletionImage(result.assets[0].uri);
    }
  };

  const uploadCompletionPhoto = async () => {
    if (!completionImage) {
      Alert.alert("Missing photo", "Please choose a completion photo first.");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/issues/${issueId}/photo`, { completion_photo_url: completionImage });
      Alert.alert("Success", "Completion photo uploaded and issue resolved.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.error || "Could not upload photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{issue?.title || "Issue"}</Text>
      <Text style={styles.meta}>{issue?.location}</Text>
      <Text style={styles.description}>{issue?.description}</Text>

      <AppButton title="Mark as In Progress" onPress={markInProgress} loading={loading} />

      <Input label="Work Comment" value={comment} onChangeText={setComment} placeholder="Write what you did" multiline />
      <AppButton title="Add Comment" secondary onPress={addComment} loading={loading} />

      <View style={styles.divider} />

      <AppButton title="Pick Completion Photo" secondary onPress={pickCompletionPhoto} />
      {completionImage ? <Image source={{ uri: completionImage }} style={styles.image} /> : null}
      <AppButton title="Upload Photo & Resolve" onPress={uploadCompletionPhoto} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },
  meta: {
    color: "#6b7280",
    marginTop: 4,
  },
  description: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginTop: 14,
    color: "#374151",
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "#d1d5db",
    marginVertical: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    marginTop: 14,
  },
});
