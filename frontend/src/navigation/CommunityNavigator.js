import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommunityHomeScreen from "../screens/community/CommunityHomeScreen";
import SubmitIssueScreen from "../screens/community/SubmitIssueScreen";
import MyIssuesScreen from "../screens/community/MyIssuesScreen";
import IssueDetailsScreen from "../screens/common/IssueDetailsScreen";

const Stack = createNativeStackNavigator();

export default function CommunityNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CommunityHome" component={CommunityHomeScreen} options={{ title: "Community Dashboard" }} />
      <Stack.Screen name="SubmitIssue" component={SubmitIssueScreen} options={{ title: "Submit Issue" }} />
      <Stack.Screen name="MyIssues" component={MyIssuesScreen} options={{ title: "My Issues" }} />
      <Stack.Screen name="IssueDetails" component={IssueDetailsScreen} options={{ title: "Issue Details" }} />
    </Stack.Navigator>
  );
}
