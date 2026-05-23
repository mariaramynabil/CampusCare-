import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManagerDashboardScreen from "../screens/manager/ManagerDashboardScreen";
import AssignIssueScreen from "../screens/manager/AssignIssueScreen";
import IssueDetailsScreen from "../screens/common/IssueDetailsScreen";

const Stack = createNativeStackNavigator();

export default function ManagerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ManagerDashboard" component={ManagerDashboardScreen} options={{ title: "All Issues" }} />
      <Stack.Screen name="AssignIssue" component={AssignIssueScreen} options={{ title: "Assign Worker" }} />
      <Stack.Screen name="IssueDetails" component={IssueDetailsScreen} options={{ title: "Issue Details" }} />
    </Stack.Navigator>
  );
}
