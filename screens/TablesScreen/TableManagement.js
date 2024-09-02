import React, { useState, useEffect, useCallback } from "react";
import { TextInput, StyleSheet, Switch, View, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import FloatingCloseButton from "@/components/FloatingCloseButton/FloatingCloseButton";
import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import ThemedButton from "@/components/common/ThemedButton";
import OrderDetails from "./OrderDetails";
import generatePDF from "@/utils/generatePDF";

const TableManagement = React.memo(({ table, onUpdateTable, onClose }) => {
  const [guests, setGuests] = useState(table?.guests ?? 0);
  const [notes, setNotes] = useState(table?.notes ?? "");
  const [waiter, setWaiter] = useState(table?.waiter ?? "");
  const [guestName, setGuestName] = useState(table?.guestName ?? "");
  const [guestMobile, setGuestMobile] = useState(table?.guestMobile ?? "");
  const [occasion, setOccasion] = useState(table?.occasion ?? "Birthday");
  const [bookingTime, setBookingTime] = useState(new Date());
  const [isBookingNow, setIsBookingNow] = useState(true);

  const setGuestsCallback = useCallback((value) => setGuests(value), []);
  const setNotesCallback = useCallback((value) => setNotes(value), []);
  const setWaiterCallback = useCallback((value) => setWaiter(value), []);
  const setGuestNameCallback = useCallback((value) => setGuestName(value), []);
  const setGuestMobileCallback = useCallback(
    (value) => setGuestMobile(value),
    []
  );
  const setOccasionCallback = useCallback((value) => setOccasion(value), []);
  const setBookingTimeCallback = useCallback(
    (value) => setBookingTime(value),
    []
  );
  const setIsBookingNowCallback = useCallback(
    (value) => setIsBookingNow(value),
    []
  );
  useEffect(() => {
    setGuests(table?.guests ? table?.guests : 0);
    setNotes(table?.notes ? table?.notes : "");
    setGuestName(table?.guestName ? table?.guestName : "");
    setGuestMobile(table?.guestMobile ? table?.guestMobile : "");
    setOccasion(table?.occasion ? table?.occasion : "Friends");
    setWaiter(table?.waiter ? table?.waiter : "");
    setBookingTime(new Date());
    setIsBookingNow(true);
  }, [table]);

  const handleUpdate = () => {
    onUpdateTable({
      ...table,
      guestName,
      guestMobile,
      guests: parseInt(guests, 10),
      occasion,
      bookingTime: isBookingNow ? new Date() : bookingTime,
      waiter,
      notes,
      status: "Occupied",
    });
  };

  // const [bill, setBill] = useState(false);
  const handleGenerateBillClick = () => {
    const restaurantName = "Thorat Barbeque";
    const orderItems = table.orders;
    const tableData = {
      number: table.number,
      guests,
      occasion,
      waiter,
      notes,
    };
    // setBill(true);
    generatePDF(restaurantName, guestName, orderItems, tableData);
  };

  const renderHeader = useCallback(
    () => (
      <View>
        <ThemedView style={styles.container}>
          <FloatingCloseButton onClose={onClose} />
          <ThemedText style={styles.title}>Table {table?.number}</ThemedText>
          <ThemedView style={styles.inputContainer}>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Name:</ThemedText>
              <TextInput
                style={styles.input}
                value={guestName}
                onChangeText={setGuestNameCallback}
              />
            </ThemedView>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Mobile:</ThemedText>
              <TextInput
                style={styles.input}
                value={guestMobile}
                onChangeText={setGuestMobileCallback}
                inputMode="phone-pad"
              />
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.inputContainer}>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Guests:</ThemedText>
              <TextInput
                style={styles.input}
                value={guests.toString()}
                onChangeText={setGuestsCallback}
                inputMode="numeric"
              />
            </ThemedView>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Occasion:</ThemedText>
              <Picker
                selectedValue={occasion}
                style={styles.picker}
                onValueChange={setOccasionCallback}
              >
                <Picker.Item label="Friends" value="Friends" />
                <Picker.Item label="Family" value="Family" />
                <Picker.Item label="Party" value="Party" />
                <Picker.Item label="Office Party" value="Office Party" />
                <Picker.Item label="Official" value="Official" />
                <Picker.Item
                  label="Family & Friends"
                  value="Family and Friends"
                />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.inputContainer}>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Time:</ThemedText>
              <ThemedView style={styles.radioContainer}>
                <ThemedText>Later</ThemedText>
                <Switch
                  value={isBookingNow}
                  onValueChange={setIsBookingNowCallback}
                />
                <ThemedText>Now</ThemedText>
                {!isBookingNow && (
                  <DateTimePicker
                    value={bookingTime}
                    mode="time"
                    display="default"
                    onChange={(event, selectedDate) =>
                      setBookingTimeCallback(selectedDate || bookingTime)
                    }
                  />
                )}
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Server:</ThemedText>
              <TextInput
                style={styles.input}
                value={waiter}
                onChangeText={setWaiterCallback}
              />
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.notesContainer}>
            <ThemedText style={styles.label}>Notes:</ThemedText>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotesCallback}
              multiline
            />
          </ThemedView>
          <ThemedView style={styles.buttonsContainer}>
            <ThemedButton
              style={styles.updateButton}
              onPress={handleGenerateBillClick}
              type="primary"
            >
              <ThemedText style={styles.updateButtonText}>
                Generate Bill
              </ThemedText>
            </ThemedButton>
            <ThemedButton
              style={styles.updateButton}
              onPress={handleUpdate}
              type="success"
            >
              <ThemedText style={styles.updateButtonText}>
                Book Table
              </ThemedText>
            </ThemedButton>
          </ThemedView>
          <OrderDetails rawOrders={table.orders} />
        </ThemedView>
      </View>
    ),
    [
      guests,
      notes,
      waiter,
      guestName,
      guestMobile,
      occasion,
      bookingTime,
      isBookingNow,
    ]
  );

  return <ScrollView>{renderHeader()}</ScrollView>;
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputFieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    gap: 10,
    maxWidth: "40%",
  },
  notesContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    gap: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  notesInput: {
    height: 60,
    width: "90%",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  updateButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "45%",
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default TableManagement;
