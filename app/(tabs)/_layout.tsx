import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ headerTitle: "Home Page", title: "Home" }}
      />
      <Tabs.Screen
        name="screens/[id]"
        options={{ headerTitle: "User Page", title: "User" }}
      />
    </Tabs>
  );
};

export default TabsLayout;
