import React, { useState, useEffect } from "react";
import { TextInput, StyleSheet, Switch, View, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import FloatingCloseButton from "@/components/FloatingCloseButton/FloatingCloseButton";
import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import ThemedButton from "@/components/common/ThemedButton";
import OrderDetails from "@/components/TableManagement/OrderDetails";
import generatePDF from "@/utils/generatePDF";
import { useThemeColor } from "@/hooks/useThemeColor";

const TableManagement = React.memo(
  ({ table, staffs, onUpdateTable, onClose }) => {
    const textColor = useThemeColor({}, "text");
    const bgColor = useThemeColor({}, "background");

    // Local state for form inputs
    const [localInputs, setLocalInputs] = useState({
      guests: table?.guests ?? 0,
      notes: table?.notes ?? "",
      waiter: table?.waiter ?? "",
      guestName: table?.guestName ?? "",
      guestMobile: table?.guestMobile ?? "",
      occasion: table?.occasion ?? "Friends",
      bookingTime: new Date(),
      isBookingNow: true,
    });

    useEffect(() => {
      setLocalInputs({
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

    const handleInputChange = (field, value) => {
      setLocalInputs((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = (orderStatus) => {
      onUpdateTable({
        ...table,
        ...localInputs,
        guests: parseInt(localInputs.guests, 10) || 0, // Add fallback for NaN
        bookingTime: localInputs.isBookingNow
          ? new Date()
          : localInputs.bookingTime,
        status: orderStatus,
      });
    };

    const handleGenerateBillClick = async () => {
      try {
        handleUpdate("Available");
        await generateBill();
      } catch (error) {
        console.error("Error generating bill:", error);
        // alert("Failed to generate bill. Please try again.");
      }
    };

    const generateBill = async () => {
      const restaurantName = "Shree RAM VEG";
      const orderItems = table.orders;
      const tableData = {
        number: table.number,
        ...localInputs,
      };
      await generatePDF(
        restaurantName,
        localInputs.guestName,
        orderItems,
        tableData
      );
      console.log("Bill generated successfully");
      // alert("Bill generated successfully");
    };

    const TimeSelection = React.memo(({ bookingTime, styles }) => {
      return (
        <ThemedView style={styles.inputFieldContainer}>
          <ThemedText style={styles.label}>Time:</ThemedText>
          <ThemedView style={styles.radioContainer}>
            <ThemedText>Later</ThemedText>
            <Switch
              value={localInputs.isBookingNow}
              onValueChange={(value) =>
                handleInputChange("isBookingNow", value)
              }
            />
            <ThemedText>Now</ThemedText>
            {!localInputs.isBookingNow && (
              <DateTimePicker
                value={bookingTime}
                onChange={(value) =>
                  handleInputChange("bookingTime", value || bookingTime)
                }
                mode="time"
                display="default"
              />
            )}
          </ThemedView>
        </ThemedView>
      );
    });

    const renderHeader = (
      <View>
        <ThemedView style={styles.container}>
          <FloatingCloseButton onClose={onClose} />
          <ThemedText style={styles.title}>Table {table?.number}</ThemedText>
          <ThemedView style={styles.inputContainer}>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Name:</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor }]}
                onChangeText={(value) => handleInputChange("guestName", value)}
                value={localInputs.guestName}
              />
            </ThemedView>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Mobile:</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor }]}
                onChangeText={(value) =>
                  handleInputChange("guestMobile", value)
                }
                inputMode="phone-pad"
                value={localInputs.guestMobile}
              />
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.inputContainer}>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Guests:</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor }]}
                onChangeText={(value) => handleInputChange("guests", value)}
                inputMode="numeric"
                value={localInputs.guests.toString()}
              />
            </ThemedView>
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Occasion:</ThemedText>
              <Picker
                selectedValue={localInputs.occasion}
                style={[
                  styles.input,
                  { color: textColor, backgroundColor: bgColor },
                ]}
                onValueChange={(value) => handleInputChange("occasion", value)}
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
            <TimeSelection
              bookingTime={localInputs.bookingTime}
              styles={styles}
            />
            <ThemedView style={styles.inputFieldContainer}>
              <ThemedText style={styles.label}>Server :</ThemedText>
              <Picker
                selectedValue={localInputs.waiter}
                style={[
                  styles.input,
                  { color: textColor, backgroundColor: bgColor },
                ]}
                onValueChange={(value) => handleInputChange("waiter", value)}
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
              </Picker>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.notesContainer}>
            <ThemedText style={styles.label}>Notes:</ThemedText>
            <TextInput
              style={[styles.input, styles.notesInput, { color: textColor }]}
              onChangeText={(value) => handleInputChange("notes", value)}
              multiline
              value={localInputs.notes}
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
    );

    const renderFooter = (
      <View style={styles.orderDetailsContainer}>
        <OrderDetails rawOrders={table.orders} />
      </View>
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
  }
);

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
