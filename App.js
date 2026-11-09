import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Entypo } from '@expo/vector-icons';
import DateTimePicker from "@react-native-community/datetimepicker"

import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  Button,
} from "react-native";
import uuid from "react-native-uuid";

const PICKER_MODE = Platform.select({
  ios: 'datetime',
  android: 'date'
});
const PICKER_DISPLAY = Platform.select({
  ios: 'inline',
  android: 'default'
});
const PICKER_SHOW = Platform.select({
  ios: true,
  android: false
});

import Countdown from "./components/Countdown";

// ----- setup the notifications to works on the device here

export default function App() {

  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputDate, setDate] = useState(new Date());

  const [mode, setMode] = useState(PICKER_MODE);
  const [show, setShow] = useState(PICKER_SHOW);

  const addToList = async () => {
    if (inputValue === "") {
      Alert.alert("Oops", "Input is empty", [
        {
          text: "Ok",
        },
      ]);
      return;
    }
    if (inputDate < new Date()) {
      Alert.alert("Oops", "Date must be future", [
        {
          text: "Ok",
        },
      ]);
      return;
    }

    const newItem = {
      id: uuid.v4(),
      title: inputValue,
      emoji: '⏳', // ----- change the countdown icon here
      date: inputDate
    };

    // ----- schedule the countdown notification here

    setTasks([newItem, ...tasks]);
    setInputValue("");
    Keyboard.dismiss();
  };

  const deleteFromList = async (id) => {
    const item = tasks.find(i => i.id == id);

    if (item) {
      setTasks(tasks.filter((task) => task.id != id));

      // ----- cancel the countdown notification here
    }
  };

  const onChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {

      if (mode === 'date') {
        setDate(selectedDate);
        setMode('time');
        return;
      }
      else {
        setShow(false);
        setMode('date');
      }
    }

    setDate(selectedDate);
  };

  return (

    <View style={styles.container}>
      <View style={styles.taskWrapper}>
        <View>
          <Text style={styles.sectionTitle}>Countdowns</Text>
        </View>
        <TextInput
          value={inputValue}
          style={styles.input}
          placeholder='Enter Countdown Title...'
          testID="input"
          onChangeText={(text) => setInputValue(text)}
        />
        <View
          style={styles.timeBtnWithText}>
          <Button
            color="#085252"
            testID="showPickerButton"
            onPress={() => {
              setShow(!show);
            }}
            title={show ? "Hide time picker" : "Select time 🕒"}
          />
          <Text>{inputDate.toLocaleString()}</Text>
        </View>
        <View style={styles.datePicker}>
          {show && (
            <DateTimePicker
              value={inputDate}
              testID="picker"
              onChange={onChange}
              mode={mode}
              is24Hour
              display={PICKER_DISPLAY}
            />)}
        </View>
        <TouchableOpacity onPress={addToList} testID="addBtn">
          <View style={styles.startBtn}>
            <Text style={{ color: "white" }}>Start Countdown</Text>

            <Entypo
              style={{ marginLeft: 5, color: "white" }}
              name='hour-glass'
              size={20}
              color='black'
            />
          </View>
        </TouchableOpacity>

        <View style={styles.items}>
          <FlatList
            keyExtractor={(item) => item.id}
            data={tasks}
            renderItem={({ item }) => (
              <Countdown countdown={item} deleteFromList={deleteFromList} />
            )}
          />
        </View>
      </View>

      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#E8EAED",
  },
  startBtn: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#008080",
    color: "#ffffff",
  },
  taskWrapper: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 38,
    fontWeight: "bold",
    marginBottom: 10,
  },
  items: {
    flex: 1,
    marginTop: 30,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePicker: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  timeBtnWithText: {
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});
