import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function ReportsIndex() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports Overview</Text>
      </View>

      <View style={styles.subMenu}>
        {/* Monthly Report */}
        <TouchableOpacity
          style={styles.subMenuItem}
          onPress={() => router.push("/(tabs)/reports/monthly-report")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Using default IconSymbol calendar icon */}
            <IconSymbol name="calendar-monthly" size={24} color="#0a7ea4" />
            <Text style={{ marginLeft: 10 }}>Monthly Report</Text>
          </View>
        </TouchableOpacity>

        {/* Yearly Report */}
        <TouchableOpacity
          style={styles.subMenuItem}
          onPress={() => router.push("/(tabs)/reports/yearly-report")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Using MaterialCommunityIcons for a different calendar style */}
            <MaterialCommunityIcons
              name="calendar-star"
              size={24}
              color="#0a7ea4"
            />
            <Text style={{ marginLeft: 10 }}>Yearly Report</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 30 : 0,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#0a7ea4",
    width: "100%",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  subMenu: {
    width: "95%",
  },
  subMenuItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
