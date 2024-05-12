import { View, Text, Pressable } from "react-native";
import React from "react";
import { Link, router } from "expo-router";

const HomePage = () => {
  return (
    <View>
      <Text>HomePage</Text>
      <Link href="/screens/1">Go to user 1</Link>
      <Pressable onPress={() => router.push("/screens/2")}>
        <Text>Go to user 2</Text>
      </Pressable>
    </View>
  );
};

export default HomePage;
