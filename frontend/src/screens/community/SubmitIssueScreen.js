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
  const [message, setMessage] = useState("");

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
  setMessage("");

  if (!title || !description || !category || !location) {
    setMessage("Please fill title, description, category and location.");
    return;
  }

  try {
    setLoading(true);

    const response = await api.post("/issues", {
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      image_url: imageUri || null,
    });

    console.log("Issue submitted:", response.data);

    setMessage("Issue submitted successfully. Redirecting to My Issues...");

    setTitle("");
    setDescription("");
    setLocation("");
    setCategory("Electrical");
    setImageUri(null);

    setTimeout(() => {
      navigation.navigate("MyIssues");
    }, 1000);
  } catch (error) {
    console.log("Submit issue error:", error?.response?.data || error.message);
    setMessage(error?.response?.data?.error || "Submit failed. Check backend/API.");
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

   {message ? <Text style={styles.message}>{message}</Text> : null}
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
  message: {
  marginVertical: 12,
  fontWeight: "700",
  color: "#2563eb",
},
});
