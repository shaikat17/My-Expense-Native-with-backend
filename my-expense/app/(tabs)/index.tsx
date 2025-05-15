import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Home() {
  // Modal control
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"expense" | "income" | null>(null);

  // Common form states
  const [amount, setAmount] = useState("");
  const [categoryOrSource, setCategoryOrSource] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const openModal = (type: "expense" | "income") => {
    setModalType(type);
    setModalVisible(true);
    resetForm();
  };

  const resetForm = () => {
    setAmount("");
    setCategoryOrSource("");
    setDescription("");
    setDate(new Date());
    setShowDatePicker(false);
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  const handleSave = () => {
    // Validation
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (!categoryOrSource.trim()) {
      alert(
        `Please enter a ${
          modalType === "expense" ? "category" : "source"
        }`
      );
      return;
    }

    // Save logic here, for now just alert
    alert(
      `${modalType === "expense" ? "Expense" : "Income"} saved!\n
      Amount: ${amount}\n
      ${modalType === "expense" ? "Category" : "Source"}: ${categoryOrSource}\n
      Description: ${description}\n
      Date: ${date.toDateString()}`
    );

    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to My Expense Tracker</Text>

      <TouchableOpacity
        style={[styles.button, styles.expenseButton]}
        onPress={() => openModal("expense")}
      >
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.incomeButton]}
        onPress={() => openModal("income")}
      >
        <Text style={styles.buttonText}>Add Income</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {modalType === "expense" ? "Add Expense" : "Add Income"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <TextInput
            style={styles.input}
            placeholder={modalType === "expense" ? "Category" : "Source"}
            value={categoryOrSource}
            onChangeText={setCategoryOrSource}
          />

          <TextInput
            style={styles.input}
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerText}>Date: {date.toDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>
                Save {modalType === "expense" ? "Expense" : "Income"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

// Import TextInput separately
import { TextInput } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 48,
    color: "#0a7ea4",
    textAlign: "center",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    marginVertical: 12,
    alignItems: "center",
  },
  expenseButton: {
    backgroundColor: "#e74c3c",
  },
  incomeButton: {
    backgroundColor: "#2ecc71",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContent: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0a7ea4",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  datePickerButton: {
    padding: 12,
    backgroundColor: "#e7f1fa",
    borderRadius: 8,
    marginBottom: 24,
  },
  datePickerText: {
    color: "#0a7ea4",
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#0a7ea4",
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#7f8c8d",
    marginLeft: 8,
  },
});
