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
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const TableManagement = React.memo(({ table, onUpdateTable, onClose }) => {
  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");

  const [formData, setFormData] = useState({
    guests: table?.guests ?? 0,
    notes: table?.notes ?? "",
    waiter: table?.waiter ?? "",
    guestName: table?.guestName ?? "",
    guestMobile: table?.guestMobile ?? "",
    occasion: table?.occasion ?? "Birthday",
    bookingTime: new Date(),
    isBookingNow: true,
  });

  const [staffs, setStaffs] = useState([]);

  const updateFormData = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  useEffect(() => {
    setFormData({
      guests: table?.guests ?? 0,
      notes: table?.notes ?? "",
      waiter: table?.waiter ?? "",
      guestName: table?.guestName ?? "",
      guestMobile: table?.guestMobile ?? "",
      occasion: table?.occasion ?? "Friends",
      bookingTime: new Date(),
      isBookingNow: true,
    });
  }, [table]);

  const handleUpdate = (orderStatus) => {
    onUpdateTable({
      ...table,
      ...formData,
      guests: parseInt(formData.guests, 10),
      bookingTime: formData.isBookingNow ? new Date() : formData.bookingTime,
      status: orderStatus,
    });
  };

  useEffect(() => {
    const fetchAllStaffs = async () => {
      try {
        const staffsSnapshot = await getDocs(
          collection(db, "hotel-details/staff-details/staffs")
        );
        const items = staffsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStaffs(items);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchAllStaffs();
  }, []);

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

  const MemoizedInput = React.memo(
    ({ style, onChangeText, value, ...props }) => (
      <TextInput
        style={style}
        onChangeText={onChangeText}
        value={value}
        {...props}
      />
    )
  );

  const MemoizedPicker = React.memo(
    ({ selectedValue, style, onValueChange, children }) => (
      <Picker
        selectedValue={selectedValue}
        style={style}
        onValueChange={onValueChange}
      >
        {children}
      </Picker>
    )
  );

  const MemoizedSwitch = React.memo(({ value, onValueChange }) => (
    <Switch value={value} onValueChange={onValueChange} />
  ));

  const MemoizedDateTimePicker = React.memo(({ value, onChange }) => (
    <DateTimePicker
      value={value}
      mode="time"
      display="default"
      onChange={onChange}
    />
  ));

  const TimeSelection = React.memo(
    ({ formData, updateFormData, bookingTime, styles }) => (
      <ThemedView style={styles.inputFieldContainer}>
        <ThemedText style={styles.label}>Time:</ThemedText>
        <ThemedView style={styles.radioContainer}>
          <ThemedText>Later</ThemedText>
          <MemoizedSwitch
            value={formData.isBookingNow}
            onValueChange={(value) => updateFormData("isBookingNow", value)}
          />
          <ThemedText>Now</ThemedText>
          {!formData.isBookingNow && (
            <MemoizedDateTimePicker
              value={bookingTime}
              onChange={(event, selectedDate) =>
                updateFormData("bookingTime", selectedDate || bookingTime)
              }
            />
          )}
        </ThemedView>
      </ThemedView>
    )
  );

  const renderHeader = useCallback(
    () => (
      <View>
        <ThemedView style={styles.container}>
          <FloatingCloseButton onClose={onClose} />
          <ThemedText style={styles.title}>Table {table?.number}</ThemedText>
          <ThemedView style={styles.inputContainer}>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Name:</ThemedText>
              <MemoizedInput
                style={[styles.input, { color: textColor }]}
                onChangeText={(value) => updateFormData("guestName", value)}
                value={formData.guestName}
              />
            </ThemedView>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Mobile:</ThemedText>
              <MemoizedInput
                style={[styles.input, { color: textColor }]}
                onChangeText={(value) => updateFormData("guestMobile", value)}
                inputMode="phone-pad"
                value={formData.guestMobile}
              />
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.inputContainer}>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Guests:</ThemedText>
              <MemoizedInput
                style={[styles.input, { color: textColor }]}
                onChangeText={(value) => updateFormData("guests", value)}
                inputMode="numeric"
                value={formData.guests.toString()}
              />
            </ThemedView>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Occasion:</ThemedText>
              <MemoizedPicker
                selectedValue={formData.occasion}
                style={[
                  styles.input,
                  { color: textColor, backgroundColor: bgColor },
                ]}
                onValueChange={(value) => updateFormData("occasion", value)}
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
              </MemoizedPicker>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.inputContainer}>
            <TimeSelection
              formData={formData}
              updateFormData={updateFormData}
              bookingTime={formData.bookingTime}
              styles={styles}
            />
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Server :</ThemedText>
              <MemoizedPicker
                selectedValue={formData.waiter}
                style={[
                  styles.input,
                  { color: textColor, backgroundColor: bgColor },
                ]}
                onValueChange={(value) => updateFormData("waiter", value)}
              >
                {staffs.length > 0 ? (
                  staffs.map((staff) => (
                    <Picker.Item
                      label={staff.name}
                      value={staff.name}
                      key={staff.id}
                    />
                  ))
                ) : (
                  <Picker.Item label="Loading..." value="" />
                )}
                <Picker.Item label="Other" value="Other" key="Other" />
              </MemoizedPicker>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.notesContainer}>
            <ThemedText style={styles.label}>Notes:</ThemedText>
            <MemoizedInput
              style={[styles.input, styles.notesInput, { color: textColor }]}
              onChangeText={(value) => updateFormData("notes", value)}
              multiline
              value={formData.notes}
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
        </ThemedView>
      </View>
    ),
    [[formData, staffs, updateFormData, table?.number]]
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
    flex: 1,
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
