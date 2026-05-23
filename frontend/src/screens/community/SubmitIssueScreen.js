import React, { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../../api/api";
import AppButton from "../../components/AppButton";
import Input from "../../components/Input";

const categories = ["Electrical", "Plumbing", "Cleaning", "Furniture", "Other"];

export default function SubmitIssueScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electrical");
  const [location, setLocation] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
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
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !category || !location) {
      Alert.alert("Missing data", "Please fill title, description, category and location.");
      return;
    }

    try {
      setLoading(true);

      // For now we send the local image URI as image_url.
      // Later you can replace this with real Supabase Storage/Cloudinary upload.
      await api.post("/issues", {
        title,
        description,
        category,
        location,
        image_url: imageUri,
      });

      Alert.alert("Success", "Issue submitted successfully.", [
        { text: "OK", onPress: () => navigation.navigate("MyIssues") },
      ]);
    } catch (error) {
      Alert.alert("Submit failed", error?.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Input label="Issue Title" value={title} onChangeText={setTitle} placeholder="Example: Broken light" />
      <Input label="Description" value={description} onChangeText={setDescription} placeholder="Describe the issue" multiline />
      <Input label="Location" value={location} onChangeText={setLocation} placeholder="Building A, Floor 2, Room 205" />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoriesWrapper}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.category, category === item && styles.categoryActive]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <AppButton title="Pick Issue Photo" secondary onPress={pickImage} />
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}

      <AppButton title="Submit Issue" onPress={handleSubmit} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f3f4f6",
  },
  label: {
    fontWeight: "700",
    marginBottom: 8,
  },
  categoriesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  category: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  categoryActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  categoryText: {
    color: "#111827",
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    marginTop: 14,
  },
});
