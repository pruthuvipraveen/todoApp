import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseDate } from "chrono-node";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

interface Task {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD
  time?: number;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadTasks();
    Notifications.requestPermissionsAsync();
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }, []);

  const loadTasks = async () => {
    try {
      const data = await AsyncStorage.getItem("tasks");
      if (data) {
        const saved: Task[] = JSON.parse(data);
        const today = todayKey();
        const todays = saved.filter((t) => t.date === today);
        if (todays.length !== saved.length) {
          await AsyncStorage.setItem("tasks", JSON.stringify(todays));
        }
        setTasks(todays);
      }
    } catch (e) {
      console.error("Load error", e);
    }
  };

  const saveTasks = async (list: Task[]) => {
    setTasks(list);
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(list));
    } catch (e) {
      console.error("Save error", e);
    }
  };

  const addTask = async () => {
    if (!input.trim()) return;
    const date = parseDate(input);
    if (date && date.getTime() > Date.now()) {
      await Notifications.scheduleNotificationAsync({
        content: { title: "MonoTask Reminder", body: input.trim() },
        trigger: date,
      });
    }
    const newTask: Task = {
      id: Date.now().toString(),
      text: input.trim(),
      date: todayKey(),
      time: date ? date.getTime() : undefined,
    };
    const list = [newTask, ...tasks];
    await saveTasks(list);
    setInput("");
  };

  const deleteTask = async (id: string) => {
    const list = tasks.filter((t) => t.id !== id);
    await saveTasks(list);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <Swipeable
      renderRightActions={() => (
        <View style={styles.deleteBox}>
          <Text style={styles.deleteText}>Delete</Text>
        </View>
      )}
      onSwipeableOpen={() => deleteTask(item.id)}
    >
      <View style={styles.taskRow}>
        <Text style={styles.taskText}>{item.text}</Text>
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          contentContainerStyle={styles.list}
        />
        <TextInput
          style={styles.input}
          placeholder="Add a task"
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const todayKey = () => new Date().toISOString().split("T")[0];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  list: { flexGrow: 1 },
  input: {
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 18,
  },
  taskRow: {
    paddingVertical: 14,
    borderBottomColor: "#1a1a1a",
    borderBottomWidth: 1,
  },
  taskText: { color: "#fff", fontSize: 18 },
  deleteBox: {
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
  },
  deleteText: { color: "#fff" },
});
