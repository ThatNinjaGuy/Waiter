import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import FloatingCloseButton from "@/components/FloatingCloseButton/FloatingCloseButton";

const TableManagement = ({ table, onUpdateTable, onClose }) => {
  const [guests, setGuests] = useState(table?.guests ? table?.guests : 0);
  const [notes, setNotes] = useState(table?.notes ? table?.notes : "");
  const [waiter, setWaiter] = useState(table?.waiter ? table?.waiter : "");
  const [guestName, setGuestName] = useState(
    table?.guestName ? table?.guestName : ""
  );
  const [guestMobile, setGuestMobile] = useState(
    table?.guestMobile ? table?.guestMobile : ""
  );
  const [occasion, setOccasion] = useState(
    table?.occasion ? table?.occasion : "Birthday"
  );
  const [bookingTime, setBookingTime] = useState(new Date());
  const [isBookingNow, setIsBookingNow] = useState(true);

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
    });
  };

  return (
    <View style={styles.container}>
      <FloatingCloseButton onClose={onClose} />
      <Text style={styles.title}>Table {table?.number}</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputFieldContainer}>
          <Text style={styles.label}>Guest Name:</Text>
          <TextInput
            style={styles.input}
            value={guestName}
            onChangeText={setGuestName}
          />
        </View>
        <View style={styles.inputFieldContainer}>
          <Text style={styles.label}>Guest Mobile Number:</Text>
          <TextInput
            style={styles.input}
            value={guestMobile}
            onChangeText={setGuestMobile}
            keyboardType="phone-pad"
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputFieldContainer}>
          <Text style={styles.label}>Number of Guests:</Text>
          <TextInput
            style={styles.input}
            value={guests.toString()}
            onChangeText={setGuests}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputFieldContainer}>
          <Text style={styles.label}>Occasion:</Text>
          <Picker
            selectedValue={occasion}
            style={styles.picker}
            onValueChange={(itemValue) => setOccasion(itemValue)}
          >
            <Picker.Item label="Friends" value="Friends" />
            <Picker.Item label="Family" value="Family" />
            <Picker.Item label="Party" value="Party" />
            <Picker.Item label="Office Party" value="Office Party" />
            <Picker.Item label="Official" value="Official" />
            <Picker.Item label="Family & Friends" value="Family and Friends" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputFieldContainer}>
          <Text style={styles.label}>Booking Time:</Text>
          <View style={styles.radioContainer}>
            <Text>Later</Text>
            <Switch
              value={isBookingNow}
              onValueChange={(value) => setIsBookingNow(value)}
            />
            <Text>Now</Text>
            {!isBookingNow && (
              <DateTimePicker
                value={bookingTime}
                mode="time"
                display="default"
                onChange={(event, selectedDate) =>
                  setBookingTime(selectedDate || bookingTime)
                }
              />
            )}
          </View>
        </View>
        <View style={styles.inputFieldContainer}>
          <Text style={styles.label}>Server:</Text>
          <TextInput
            style={styles.input}
            value={waiter}
            onChangeText={setWaiter}
          />
        </View>
      </View>
      <View style={styles.inputFieldContainer}>
        <Text style={styles.label}>Notes:</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>
      <Pressable style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Book Table</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
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
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
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
});

export default TableManagement;
