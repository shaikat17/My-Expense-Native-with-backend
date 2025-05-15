import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Pressable,
  Alert,
} from "react-native";


function formatCurrentDateTime() {
  const now = new Date();
  const optionsDate: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const dateStr = now.toLocaleDateString(undefined, optionsDate); // e.g., "15 May 2025"
  const timeStr = now.toLocaleTimeString(undefined, optionsTime); // e.g., "2:06 PM"

  return { dateStr, timeStr };
}

const dummyTransactions = [
  { id: "1", title: "Groceries", amount: -50, date: "2025-05-16T14:06:00" },
  { id: "2", title: "Salary", amount: 1200, date: "2025-05-16T09:00:00" },
  { id: "3", title: "Transport", amount: -20, date: "2025-05-14T16:30:00" },
  {
    id: "4",
    title: "Electricity Bill",
    amount: -70,
    date: "2025-05-10T11:00:00",
  },
];

// Utility to format date as "15 May, Thu, 2:06 PM"
const formatTime = (isoDateString: string) => {
  const d = new Date(isoDateString);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    weekday: 'short' as 'short', // Add this type annotation
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return d.toLocaleString('en-US', options).replace(',', ',');
};

export default function HomePage() {
  const { auth: { user }, logout } = useAuth();

  const { dateStr, timeStr } = formatCurrentDateTime();

  // States for modals
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");

  // States for 3-dot menu
  const [selectedTransactionId, setSelectedTransactionId] = useState< string | number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Dummy state to simulate transactions (replace with real state in your app)
  const [transactions, setTransactions] = useState(dummyTransactions);

  // Filter transactions for today and month
  const today = new Date();
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const isSameMonth = (d1: Date, d2: Date) =>
    d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

  const todayTransactions = transactions.filter((t) =>
    isSameDay(new Date(t.date), today)
  );

  const monthTransactions = transactions.filter((t) =>
    isSameMonth(new Date(t.date), today)
  );

  // Totals calculations
  const todayExpenseTotal = todayTransactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const todayIncomeTotal = todayTransactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const monthExpenseTotal = monthTransactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const monthIncomeTotal = monthTransactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const handleModalPress = (type: string) => {
    setModalType(type);
    setModalVisible(true);
  }
  // Toggle 3-dot menu
  const toggleMenu = (id: string | number) => {
    if (selectedTransactionId === id && menuVisible) {
      setMenuVisible(false);
      setSelectedTransactionId(null);
    } else {
      setSelectedTransactionId(id);
      setMenuVisible(true);
    }
  };

  // Edit handler
  const handleEdit = (item) => {
    Alert.alert("Edit", `Edit: ${item.title}`);
    setMenuVisible(false);
    setSelectedTransactionId(null);
  };

  // Delete handler
  const handleDelete = (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setTransactions((prev) => prev.filter((t) => t.id !== id));
            setMenuVisible(false);
            setSelectedTransactionId(null);
          },
        },
      ]
    );
  };

  return (
    <Pressable onPress={() => {
      if(menuVisible) {
        setMenuVisible(false);
        setSelectedTransactionId(null);
      }
    }} style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcome}>Welcome, {user?.name}</Text>
        <Pressable onPress={logout}>
          <Text style={styles.logoutBtn}>Log Out</Text>
        </Pressable>
      </View>

      <View style={styles.summaryCard}>
      <View style={styles.leftSide}>
        <Text style={styles.summaryTitle}>Today's Expense</Text>
        <Text style={styles.summaryAmount}>${todayExpenseTotal.toFixed(2)}</Text>

        <Text style={styles.summaryTitle}>Month's Expense</Text>
        <Text style={styles.summaryAmount}>${monthExpenseTotal.toFixed(2)}</Text>

        <Text style={styles.summaryTitle}>Month's Income</Text>
        <Text style={styles.summaryAmount}>${monthIncomeTotal.toFixed(2)}</Text>
      </View>

      <View style={styles.rightSide}>
        <Text style={styles.dateText}>{dateStr}</Text>
        <Text style={styles.timeText}>{timeStr}</Text>
      </View>
    </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={() => handleModalPress("Expense")}
        >
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.incomeButton]}
          onPress={() => handleModalPress("Income")}
        >
          <Text style={styles.buttonText}>Add Income</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.recentTitle}>Today's Transactions</Text>

      <FlatList
        data={todayTransactions.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )}
        keyExtractor={(item) => item.id}
        style={styles.transactionList}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            {/* Plus/Minus sign */}
            <Text
              style={
                item.amount > 0 ? styles.transactionSignIncome : styles.transactionSignExpense}
            >
              {item.amount > 0 ? "+" : "-"}
            </Text>

            {/* Middle: title and date */}
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.transactionDate}>
                {formatTime(item.date)}
              </Text>
            </View>

            {/* Amount */}
            <Text
              style={[
                styles.transactionAmount,
                item.amount > 0 ? styles.incomeColor : styles.expenseColor,
              ]}
            >
              {item.amount > 0 ? "+" : "-"}${Math.abs(item.amount).toFixed(2)}
            </Text>

            {/* Three-dot menu */}
            <Pressable
              onPress={() => toggleMenu(item.id)}
              style={styles.threeDotButton}
            >
              <Text style={styles.threeDotText}>⋮</Text>
            </Pressable>

            {/* Conditional menu */}
            {menuVisible && selectedTransactionId === item.id && (
              <View style={styles.menu}>
                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  style={styles.menuItem}
                >
                  <Text>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.menuItem}
                >
                  <Text>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
            No transactions for today
          </Text>
        }
      />

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{`Add ${modalType}`} </Text>
            <TextInput placeholder="Title" style={styles.input} />
            <TextInput
              placeholder="Amount"
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  welcomeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  welcome: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0a7ea4",
  },
  logoutBtn: {
    fontSize: 16,
    backgroundColor: "#0a7ea4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    color: "#fff",
  },
  summaryCard: {
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSide: {
    flex: 1,
  },
  rightSide: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  dateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  timeText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalBox: {
    flex: 1,
    alignItems: "center",
  },
  totalLabel: {
    color: "#d0e6f2",
    fontSize: 14,
  },
  totalAmount: {
    fontSize: 26,
    fontWeight: "bold",
  },
  expenseColor: {
    color: "#e74c3c",
  },
  incomeColor: {
    color: "#27ae60",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#0a7ea4",
    marginRight: 10,
  },
  incomeButton: {
    backgroundColor: "#27ae60",
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  recentTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  transactionList: {
    flexGrow: 0,
    paddingBottom: 30,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    position: "relative", // needed for menu position
  },
  transactionSignIncome: {
    color: "#27ae60",
    backgroundColor: "rgba(39, 174, 96, 0.1)",
    width: 30,
    height: 30,
    borderRadius: 50,
    textAlign: "center",
    lineHeight: 30,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 20,
  },
  transactionSignExpense: {
    color: "#e74c3c",
    backgroundColor: "rgba(231, 76, 60, 0.1)",
    width: 30,
    height: 30,
    borderRadius: 50,
    textAlign: "center",
    lineHeight: 30,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    color: "#555",
  },
  transactionDate: {
    fontSize: 12,
    color: "#888",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
  },
  threeDotButton: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  threeDotText: {
    fontSize: 22,
    color: "#555",
  },
  menu: {
    position: "absolute",
    top: "50%",
    right: 40,
    backgroundColor: "#fff",
    borderRadius: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    zIndex: 10,
    width: 120,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#0a7ea4",
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
