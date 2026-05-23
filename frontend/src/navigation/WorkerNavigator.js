import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AssignedIssuesScreen from "../screens/worker/AssignedIssuesScreen";
import WorkIssueScreen from "../screens/worker/WorkIssueScreen";
import IssueDetailsScreen from "../screens/common/IssueDetailsScreen";

const Stack = createNativeStackNavigator();

export default function WorkerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AssignedIssues" component={AssignedIssuesScreen} options={{ title: "Assigned Issues" }} />
      <Stack.Screen name="WorkIssue" component={WorkIssueScreen} options={{ title: "Work on Issue" }} />
      <Stack.Screen name="IssueDetails" component={IssueDetailsScreen} options={{ title: "Issue Details" }} />
    </Stack.Navigator>
  );
}
