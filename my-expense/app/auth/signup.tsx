import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather"; // eye/eye-off icons

export default function SignupPage() {
    const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // Simulate account creation (replace with actual API call)
    Alert.alert("Success", "Account created successfully");
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headTitleContainer}>
        <Text style={styles.title}>Create</Text>
              <Text style={styles.title}>Your Account On</Text>
              <Text style={styles.title}>"My Expense"</Text>
          </View>
          
          <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        keyboardType="default"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="#0a7ea4"
          />
        </Pressable>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          style={styles.passwordInput}
        />
        <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Icon
            name={showConfirmPassword ? "eye" : "eye-off"}
            size={20}
            color="#0a7ea4"
          />
        </Pressable>
      </View>

      <TouchableOpacity onPress={handleSignup} style={styles.loginButton}>
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Pressable onPress={() => router.replace("/auth/login")}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  headTitleContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0a7ea4",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
      fontSize: 16,
    height: 60
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
      marginBottom: 16,
    height: 60
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    },
    loginButton: {
        backgroundColor: "#0a7ea4",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
      },
      loginBtnText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
      },
  linkContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  link: {
    color: "#0a7ea4",
    marginTop: 8,
    fontWeight: "bold",
  },
});
