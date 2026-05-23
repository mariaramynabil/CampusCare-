import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import AuthNavigator from "./src/navigation/AuthNavigator";
import CommunityNavigator from "./src/navigation/CommunityNavigator";
import ManagerNavigator from "./src/navigation/ManagerNavigator";
import WorkerNavigator from "./src/navigation/WorkerNavigator";
import LoadingScreen from "./src/screens/common/LoadingScreen";

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <AuthNavigator />;

  if (user.role === "facility_manager" || user.role === "admin") {
    return <ManagerNavigator />;
  }

  if (user.role === "worker") {
    return <WorkerNavigator />;
  }

  return <CommunityNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
