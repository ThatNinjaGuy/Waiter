import React, { useState, useEffect, useCallback } from "react";
import { TextInput, StyleSheet, Switch, View, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import FloatingCloseButton from "@/components/FloatingCloseButton/FloatingCloseButton";
import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import ThemedButton from "@/components/common/ThemedButton";
import OrderDetails from "./OrderDetails";
import generatePDF from "@/utils/generatePDF";
import { useThemeColor } from "@/hooks/useThemeColor";

const TableManagement = React.memo(({ table, onUpdateTable, onClose }) => {
  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");

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

  const handleUpdate = (orderStatus) => {
    onUpdateTable({
      ...table,
      guestName,
      guestMobile,
      guests: parseInt(guests, 10),
      occasion,
      bookingTime: isBookingNow ? new Date() : bookingTime,
      waiter,
      notes,
      status: orderStatus,
    });
  };

  const handleGenerateBillClick = async () => {
    // Mark the table as free, indicating order has completed
    handleUpdate("Available");

    // Generate bill
    const restaurantName = "Thorat Barbeque";
    const orderItems = table.orders;
    const tableData = {
      number: table.number,
      guests,
      occasion,
      waiter,
      notes,
    };

    try {
      await generatePDF(restaurantName, guestName, orderItems, tableData);
      console.log("Bill generated successfully");
    } catch (error) {
      console.error("Error generating bill:", error);
      // alert("Failed to generate bill. Please try again.");
    }
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
                style={[styles.input, { color: textColor }]}
                onChangeText={setGuestNameCallback}
                value={guestName}
              />
            </ThemedView>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Mobile:</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor }]}
                onChangeText={setGuestMobileCallback}
                inputMode="phone-pad"
                value={guestMobile}
              />
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.inputContainer}>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Guests:</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor }]}
                onChangeText={setGuestsCallback}
                inputMode="numeric"
                value={guests.toString()}
              />
            </ThemedView>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Occasion:</ThemedText>
              <Picker
                selectedValue={occasion}
                style={[
                  styles.input,
                  { color: textColor, backgroundColor: bgColor },
                ]}
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
                style={[styles.input, { color: textColor }]}
                onChangeText={setWaiterCallback}
                value={waiter}
              />
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.notesContainer}>
            <ThemedText style={styles.label}>Notes:</ThemedText>
            <TextInput
              style={[styles.input, styles.notesInput, { color: textColor }]}
              onChangeText={setNotesCallback}
              multiline
              value={notes}
            />
          </ThemedView>
          <ThemedView style={styles.buttonsContainer}>
            <ThemedButton
              style={styles.updateButton}
              onPress={onClose}
              type="danger"
            >
              <ThemedText style={styles.updateButtonText}>CANCEL</ThemedText>
            </ThemedButton>
            <ThemedButton
              style={styles.updateButton}
              onPress={handleGenerateBillClick}
              type="primary"
            >
              <ThemedText style={styles.updateButtonText}>BILL</ThemedText>
            </ThemedButton>
            <ThemedButton
              style={styles.updateButton}
              onPress={() => handleUpdate("Occupied")}
              type="success"
            >
              <ThemedText style={styles.updateButtonText}>BOOK</ThemedText>
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
  const renderFooter = useCallback(
    () => (
      <View style={styles.orderDetailsContainer}>
        <OrderDetails rawOrders={table.orders} />
      </View>
    ),
    [table.orders]
  );

  return (
    <FlatList
      data={[]} // We don't need actual data items
      renderItem={null} // We don't need to render list items
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      contentContainerStyle={styles.contentContainer}
    />
  );
  // return <ScrollView>{renderHeader()}</ScrollView>;
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
    flexDirection: "column",
    alignItems: "flex-start",
    margin: 10,
    gap: 10,
    minWidth: "40%",
    maxWidth: "50%",
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
    fontWeight: "bold",
  },
  input: {
    width: "100%",
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
    width: "30%",
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

  overlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    justifyContent: "center",
  },
  contentContainer: {
    flexGrow: 1,
    padding: 10,
  },
  orderDetailsContainer: {
    marginTop: 20,
  },
});

export default TableManagement;
