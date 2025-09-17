// app/(tabs)/reports/yearly-report.tsx
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// Format date in "Wed, 17 Sep, 09:00 AM" style
const formatTime = (isoDateString: string) => {
  const d = new Date(isoDateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return d.toLocaleString("en-US", options).replace(",", ",");
};

export default function YearlyReport() {
  const {
    auth: { user },
  } = useAuth();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [yearlyTransactions, setYearlyTransactions] = useState<object[]>([]);
  const [loading, setLoading] = useState(false);

  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);

  // Only store the year from the selected date
  const handleConfirm = (date: Date) => {
    setSelectedYear(date.getFullYear());
    hidePicker();
  };

  const getYearlyTransactions = async (year: number) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/transactions/yearly?year=${year}`);
      if (res.status === 200) {
        setYearlyTransactions(res.data);
      } else {
        Alert.alert("Error", "Failed to fetch yearly transactions");
        setYearlyTransactions([]);
      }
    } catch (error) {
      console.error("API call failed:", error);
      Alert.alert(
        "Error",
        "Failed to fetch yearly transactions. Please try again."
      );
      setYearlyTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getYearlyTransactions(selectedYear);
    }
  }, [selectedYear, user]);

  if (loading) {
    return <Loading />;
  }

  const totalIncome = yearlyTransactions
    .filter((t: any) => t.type.toLowerCase() === "income")
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const totalExpense = yearlyTransactions
    .filter((t: any) => t.type.toLowerCase() === "expense")
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <View style={styles.container}>
      {/* Year Picker */}
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Text style={styles.selectedDateText}>Selected Year: {selectedYear}</Text>
        <Button title="Choose Year" onPress={showPicker} />
        <DateTimePickerModal
          isVisible={isPickerVisible}
          mode="date"
          date={new Date(selectedYear, 0, 1)} // Jan 1 of selected year
          onConfirm={handleConfirm}
          onCancel={hidePicker}
          display="spinner"
        />
      </View>

      {/* Header */}
      <View style={styles.reportHeader}>
        <Text style={styles.title}>Yearly Report: {selectedYear}</Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text>Total Income</Text>
          <Text style={styles.incomeColor}>৳{totalIncome.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text>Total Expense</Text>
          <Text style={styles.expenseColor}>৳{totalExpense.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text>Net Balance</Text>
          <Text style={netBalance >= 0 ? styles.incomeColor : styles.expenseColor}>
            ৳{netBalance.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Transaction List */}
      <View style={styles.transactionContainer}>
        <Text style={styles.transactionHeader}>All Transactions</Text>
        <FlatList
          data={yearlyTransactions.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 15 }}
          style={styles.transactionList}
          renderItem={({ item }) => (
            <Pressable style={styles.transactionItem}>
              <Text
                style={
                  item.type.toLowerCase() === "income"
                    ? styles.transactionSignIncome
                    : styles.transactionSignExpense
                }
              >
                {item.type.toLowerCase() === "income" ? "+" : "-"}
              </Text>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{item.category}</Text>
                <Text style={styles.transactionDate}>
                  {item.note || "No notes available."}
                </Text>
                <Text style={styles.transactionDate}>{formatTime(item.date)}</Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  item.type.toLowerCase() === "income"
                    ? styles.incomeColor
                    : styles.expenseColor,
                ]}
              >
                {item.type.toLowerCase() === "income" ? "+" : "-"}৳
                {Math.abs(item.amount).toFixed(2)}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
              No transactions for this year.
            </Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#fff", width: "100%" },
  selectedDateText: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  reportHeader: {
    backgroundColor: "#0a7ea4",
    width: "95%",
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "600", color: "#fff" },
  summaryContainer: { flexDirection: "row", justifyContent: "space-around", width: "95%", marginTop: 20 },
  summaryBox: { alignItems: "center" },
  expenseColor: { color: "#e74c3c" },
  incomeColor: { color: "#27ae60" },
  transactionContainer: { flex: 1, padding: 24, paddingTop: 0, width: "100%" },
  transactionHeader: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#0a7ea4", marginTop: 10 },
  transactionList: { paddingBottom: 30 },
  transactionItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomColor: "#eee", borderBottomWidth: 1 },
  transactionSignIncome: { color: "#27ae60", backgroundColor: "rgba(39,174,96,0.1)", width: 30, height: 30, borderRadius: 50, textAlign: "center", lineHeight: 30, fontSize: 16, fontWeight: "bold", marginRight: 20 },
  transactionSignExpense: { color: "#e74c3c", backgroundColor: "rgba(231,76,60,0.1)", width: 30, height: 30, borderRadius: 50, textAlign: "center", lineHeight: 30, fontSize: 16, fontWeight: "bold", marginRight: 20 },
  transactionDetails: { flex: 1 },
  transactionTitle: { fontSize: 16, color: "#555" },
  transactionDate: { fontSize: 12, color: "#888" },
  transactionAmount: { fontSize: 16, fontWeight: "600", marginRight: 10 },
});
