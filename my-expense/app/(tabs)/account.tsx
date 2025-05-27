import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

export default function Account() {
  const {
    auth: { user },
  } = useAuth();

  console.log(user);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Account</Text>
      </View>

      <View style={styles.basicInfo}>
        <IconSymbol name="person.crop.circle.fill" size={50} color="#0a7ea4" />
        <View style={styles.basicInfoPersonal}>
          <Text style={styles.basicInfoName}>{user?.name}</Text>
          <Text style={styles.basicInfoEmail}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.subMenu}>
        <View style={styles.subMenuHeader}>
          <Text style={styles.subMenuTitle}>Account Settings</Text>
        </View>
        <TouchableOpacity style={styles.subMenuItem} onPress={() => router.push("/profile/edit-profile")}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconSymbol name="pencil" size={24} color="#0a7ea4" />
            <Text style={{ marginLeft: 10 }}>Edit Profile</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
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
  basicInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "95%",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  basicInfoPersonal: {
    marginLeft: 10,
  },
  basicInfoName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  basicInfoEmail: {
    fontSize: 12,
    color: "#666",
  },
  subMenu: {
    marginTop: 20,
    width: "95%",
  },
  subMenuHeader: {
    backgroundColor: "#0a7ea4",
    width: "100%",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
  },
  subMenuTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    },
    subMenuItem: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 10,
      marginTop: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  button: {
    backgroundColor: "#0a7ea4",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
