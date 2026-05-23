import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../../api/api";

export default function WorkIssueScreen({ route, navigation }) {
  const issue = route.params?.issue;

  const [comment, setComment] = useState("");
  const [completionPhoto, setCompletionPhoto] = useState(null);
  const [loadingAction, setLoadingAction] = useState("");
  const [message, setMessage] = useState("");

  const issueId = issue?.id;

  const markInProgress = async () => {
    if (!issueId) {
      setMessage("No issue selected.");
      return;
    }

    try {
      setLoadingAction("progress");
      setMessage("");

      await api.put(`/issues/${issueId}/status`, {
        status: "in_progress",
      });

      setMessage("Issue marked as In Progress.");
    } catch (error) {
      console.log("Mark in progress error:", error?.response?.data || error.message);
      setMessage(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error.message ||
          "Could not mark issue as In Progress."
      );
    } finally {
      setLoadingAction("");
    }
  };

  const addComment = async () => {
    if (!issueId) {
      setMessage("No issue selected.");
      return;
    }

    if (!comment.trim()) {
      setMessage("Please write a comment first.");
      return;
    }

    try {
      setLoadingAction("comment");
      setMessage("");

      await api.post(`/issues/${issueId}/comments`, {
        comment: comment.trim(),
      });

      setComment("");
      setMessage("Comment added successfully.");
    } catch (error) {
      console.log("Add comment error:", error?.response?.data || error.message);
      setMessage(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error.message ||
          "Could not add comment."
      );
    } finally {
      setLoadingAction("");
    }
  };

  const pickCompletionPhoto = async () => {
    try {
      setMessage("");

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setCompletionPhoto(result.assets[0].uri);
        setMessage("Completion photo selected.");
      }
    } catch (error) {
      console.log("Pick completion photo error:", error.message);
      setMessage("Could not pick photo. On web, this may depend on browser permissions.");
    }
  };

  const uploadPhotoAndResolve = async () => {
    if (!issueId) {
      setMessage("No issue selected.");
      return;
    }

    try {
      setLoadingAction("resolve");
      setMessage("");

      await api.post(`/issues/${issueId}/photo`, {
        photo_url: completionPhoto || null,
        completion_photo_url: completionPhoto || null,
      });

      setMessage("Issue resolved successfully.");

      setTimeout(() => {
        navigation.goBack();
      }, 900);
    } catch (error) {
      console.log("Resolve issue error:", error?.response?.data || error.message);
      setMessage(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error.message ||
          "Could not resolve issue."
      );
    } finally {
      setLoadingAction("");
    }
  };

  if (!issue) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No issue selected.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{issue.title || "Untitled Issue"}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          {issue.description || "No description available."}
        </Text>
      </View>

      <Text style={styles.metaText}>
        Location: {issue.custom_location || issue.location || "No location"}
      </Text>

      <Text style={styles.metaText}>
        Status: {issue.status || "pending"}
      </Text>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={markInProgress}
        disabled={loadingAction !== ""}
      >
        {loadingAction === "progress" ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Mark as In Progress</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Work Comment</Text>

      <TextInput
        style={styles.commentInput}
        placeholder="Write what you did"
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity
        style={styles.darkButton}
        onPress={addComment}
        disabled={loadingAction !== ""}
      >
        {loadingAction === "comment" ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Comment</Text>
        )}
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.darkButton}
        onPress={pickCompletionPhoto}
        disabled={loadingAction !== ""}
      >
        <Text style={styles.buttonText}>Pick Completion Photo</Text>
      </TouchableOpacity>

      {completionPhoto ? (
        <Image source={{ uri: completionPhoto }} style={styles.previewImage} />
      ) : null}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={uploadPhotoAndResolve}
        disabled={loadingAction !== ""}
      >
        {loadingAction === "resolve" ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Upload Photo & Resolve</Text>
        )}
      </TouchableOpacity>

      {Platform.OS === "web" ? (
        <Text style={styles.webNote}>
          Web preview note: photo upload is stored as a temporary local browser URI for demo.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 16,
    color: "#111827",
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#374151",
  },
  metaText: {
    fontSize: 15,
    color: "#4b5563",
    marginBottom: 8,
    fontWeight: "700",
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 14,
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: "#fff",
    minHeight: 100,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 14,
    fontSize: 16,
    textAlignVertical: "top",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  darkButton: {
    backgroundColor: "#374151",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
  message: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    padding: 12,
    borderRadius: 10,
    fontWeight: "800",
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#d1d5db",
    marginVertical: 12,
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 14,
  },
  webNote: {
    color: "#6b7280",
    fontSize: 13,
    marginTop: 8,
  },
});