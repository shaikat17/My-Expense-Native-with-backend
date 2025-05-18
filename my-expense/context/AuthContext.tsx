import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import axiosInstance from "../utils/axios";
import { router } from "expo-router";
import { Alert } from "react-native";

const AuthContext = createContext<any>(null);

interface AuthContextType {
  token: string;
  user: any;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthContextType>({ token: '', user: null });
  const [loading, setLoading] = useState(true);
  const [currentTransactions, setCurrentTransactions] = useState<object[]>([]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const res = await axiosInstance.post("/auth/login", { email, password });

    const { token, user } = res.data;

    // Store token as string directly
    await SecureStore.setItemAsync("token", token);

    // Store user object as JSON string
    await SecureStore.setItemAsync("user", JSON.stringify(user));

    // Set context/state
    setAuth({ token, user });

    setLoading(false);
    // Navigate to home screen
    router.replace("/(tabs)");
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    const res = await axiosInstance.post("/auth/signup", {
      name,
      email,
      password,
    });
    const { token, user } = res.data;

    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("user", JSON.stringify(user));

    setAuth({ token, user });

    setLoading(false);
    router.replace("/(tabs)");
  };

  const logout = async () => {
    setLoading(true);
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    setAuth({ token: '', user: null });
    setLoading(false);
    router.replace("/auth/login");
  };

  const loadUser = async () => {
    const token = await SecureStore.getItemAsync("token");
    const user = await SecureStore.getItemAsync("user");

    if (token && user) {
      setAuth({ token, user: JSON.parse(user) });
    }
    setLoading(false);
  };

  const addTransaction = async (transaction: object) => {
    setLoading(true);
    const res = await axiosInstance.post("/transactions/add", {
      transaction,
    });
    
    if(res.status === 201) {
      // Handle success
      setLoading(false);
      Alert.alert("Success", "Transaction added successfully");
    } else {
      // Handle error
      setLoading(false);
      Alert.alert("Error", "Failed to add transaction");
    }
    getCurrentTransactions();
  };

  const getCurrentTransactions = async () => {
    setLoading(true);
    const res = await axiosInstance.get("/transactions/current");
    
    if (res.status === 200) {
      setCurrentTransactions(res.data);
    } else {
      Alert.alert("Error", "Failed to fetch transactions");
    }
    setLoading(false);
  };

  const deleteTransaction = async (transactionId: string) => {
    setLoading(true);
    const res = await axiosInstance.delete(`/transactions/delete/${transactionId}`);

    if (res.status === 200) {
      // Handle success
      setLoading(false);
      Alert.alert("Success", "Transaction deleted successfully");
    } else if (res.status === 404) {
      // Handle not found
      setLoading(false);
      Alert.alert("Error", "Transaction not found");
    } else {
      // Handle error
      setLoading(false);
      Alert.alert("Error", "Failed to delete transaction");
    }
    getCurrentTransactions();
  };

  useEffect(() => {
    loadUser();
    getCurrentTransactions();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, signup, logout, loading, addTransaction, getCurrentTransactions, setCurrentTransactions, currentTransactions, deleteTransaction }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
