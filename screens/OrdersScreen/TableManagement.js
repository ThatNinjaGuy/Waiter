import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Switch,
  Picker,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const TableManagement = ({ table, onUpdateTable }) => {
  const [guests, setGuests] = useState(table.guests ? table.guests : 0);
  const [notes, setNotes] = useState(table.notes ? table.notes : "");
  const [guestName, setGuestName] = useState(
    table.guestName ? table.guestName : ""
  );
  const [guestMobile, setGuestMobile] = useState(
    table.guestMobile ? table.guestMobile : ""
  );
  const [isFirstTime, setIsFirstTime] = useState(
    table.isFirstTime ? table.isFirstTime : false
  );
  const [occasion, setOccasion] = useState(
    table.occasion ? table.occasion : "Birthday"
  );
  const [bookingTime, setBookingTime] = useState(new Date());
  const [isBookingNow, setIsBookingNow] = useState(true);

  useEffect(() => {
    setGuests(table.guests ? table.guests : 0);
    setNotes(table.notes ? table.notes : "");
    setGuestName(table.guestName ? table.guestName : "");
    setGuestMobile(table.guestMobile ? table.guestMobile : "");
    setIsFirstTime(table.isFirstTime ? table.isFirstTime : false);
    setOccasion(table.occasion ? table.occasion : "Birthday");
    setBookingTime(new Date());
    setIsBookingNow(true);
  }, [table]);

  const handleUpdate = () => {
    onUpdateTable({
      ...table,
      guests: parseInt(guests, 10),
      notes,
      guestName,
      guestMobile,
      isFirstTime,
      occasion,
      bookingTime: isBookingNow ? new Date() : bookingTime,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Table Management</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Number of Guests:</Text>
        <TextInput
          style={styles.input}
          value={guests.toString()}
          onChangeText={setGuests}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Notes:</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Guest Name:</Text>
        <TextInput
          style={styles.input}
          value={guestName}
          onChangeText={setGuestName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Guest Mobile Number:</Text>
        <TextInput
          style={styles.input}
          value={guestMobile}
          onChangeText={setGuestMobile}
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Time Visit:</Text>
        <Switch value={isFirstTime} onValueChange={setIsFirstTime} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Occasion:</Text>
        <Picker
          selectedValue={occasion}
          style={styles.picker}
          onValueChange={(itemValue) => setOccasion(itemValue)}
        >
          <Picker.Item label="Birthday" value="Birthday" />
          <Picker.Item label="Anniversary" value="Anniversary" />
          <Picker.Item label="Business Meeting" value="Business Meeting" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Booking Time:</Text>
        <View style={styles.radioContainer}>
          <Text>Now</Text>
          <Switch
            value={isBookingNow}
            onValueChange={(value) => setIsBookingNow(value)}
          />
          <Text>Later</Text>
        </View>
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
      <Pressable style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update Table</Text>
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
    marginBottom: 15,
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
});

export default TableManagement;
