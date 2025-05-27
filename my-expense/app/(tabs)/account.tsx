import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/context/AuthContext";
import { use } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

export default function Account() {
    const { user } = useAuth();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Account</Text>
      </View>

      <View style={styles.basicInfo}>
        <IconSymbol name="person.crop.circle.fill" size={50} color="#0a7ea4" />
        <View style={styles.basicInfoPersonal}>
          <Text style={styles.basicInfoName}>John Doe</Text>
          <Text style={styles.basicInfoEmail}>m9M4M@example.com</Text>
        </View>
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
      color: "#0a7ea4",
    },
    basicInfoEmail: {
      fontSize: 12,
      color: "#0a7ea4",
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
