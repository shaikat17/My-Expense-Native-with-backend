import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import axiosInstance from "../utils/axios";
import { router } from "expo-router";
import { Alert } from "react-native";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const AuthContext = createContext<any>(null);

interface AuthContextType {
  token: string;
  user: any;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthContextType>({ token: "", user: null });
  const [loading, setLoading] = useState(true);
  const [currentTransactions, setCurrentTransactions] = useState<object[]>([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState<object[]>([]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { token, user } = res.data;

      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(user));

      console.log("token and user from login:", token, user);

      setAuth({ token, user });
      setLoading(false);
      router.replace("/(tabs)");
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
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

      console.log("token and user from signup:", token, user);

      setLoading(false);
      router.replace("/(tabs)");
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    setAuth({ token: "", user: null });
    setLoading(false);
    router.replace("/auth/login");
  };

  const addTransaction = async (transaction: object) => {
    setLoading(true);
    const res = await axiosInstance.post("/transactions/add", {
      transaction,
    });

    if (res.status === 201) {
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
    const res = await axiosInstance.delete(
      `/transactions/delete/${transactionId}`
    );

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

  // Update Transactions
  const updateTransaction = async (
    transactionId: string,
    updatedTransaction: object
  ) => {
    console.log("Updating transaction with ID:", transactionId);
    console.log("Updated transaction data:", updatedTransaction);
    setLoading(true);
    const res = await axiosInstance.put(
      `/transactions/update/${transactionId}`,
      {
        transaction: updatedTransaction,
      }
    );

    if (res.status === 200) {
      // Handle success
      setLoading(false);
      Alert.alert("Success", "Transaction updated successfully");
    } else if (res.status === 404) {
      // Handle not found
      setLoading(false);
      Alert.alert("Error", "Transaction not found");
    } else {
      // Handle error
      setLoading(false);
      Alert.alert("Error", "Failed to update transaction");
    }
    getCurrentTransactions();
  };

  // get monthly transactions
  const getMonthlyTransactions = async (month: number, year: number) => {
    setLoading(true); // Start loading

    try {
      // The axiosInstance should automatically handle sending the JWT token
      const res = await axiosInstance.get(
        `/transactions/monthly?month=${month}&year=${year}`
      );

      // If the request succeeds, set the transactions and stop loading
      if (res.status === 200) {
        // console.log(res.data);
        setMonthlyTransactions(res.data);
      } else {
        // Handle non-200 status codes
        Alert.alert("Error", "Failed to fetch monthly transactions");
        setMonthlyTransactions([]);
      }
    } catch (error) {
      // Handle network errors, server-side errors, etc.
      console.error("API call failed:", error);
      Alert.alert(
        "Error",
        "Failed to fetch monthly transactions. Please try again."
      );
      setMonthlyTransactions([]);
    } finally {
      setLoading(false); // Always stop loading, regardless of success or failure
    }
  };

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const user = await SecureStore.getItemAsync("user");

      if (token && user) {
        const parsedUser = JSON.parse(user);
        setAuth({ token, user: parsedUser });
        return parsedUser;
      }
    } catch (error) {
      console.error("Failed to load auth:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
    const user = await loadUser(); // get the actual user from loadUser

    if (user) {
      getCurrentTransactions();
      // getMonthlyTransactions(new Date().getMonth() + 1, new Date().getFullYear());
    }
  };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        signup,
        logout,
        loading,
        addTransaction,
        getCurrentTransactions,
        setCurrentTransactions,
        currentTransactions,
        deleteTransaction,
        updateTransaction,
        getMonthlyTransactions,
        monthlyTransactions,
        setMonthlyTransactions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
