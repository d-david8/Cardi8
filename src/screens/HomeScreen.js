import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import BottomMenu from "../components/BottomMenu";
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from "react-native-sensors";
import { useAuth } from "../contexts/AuthContext";
import FirebaseService from "../services/FirebaseService";
import Toast from "react-native-toast-message";
import BluetoothSerial from "react-native-bluetooth-hc05";
const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState({
    heartRate: 0,
    temperature: 0,
    humidity: 0,
  });
  const [isMoving, setIsMoving] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isAlaramSet, setIsAlramSet] = useState(false);
  const { userData } = useAuth();
  let masuratori = [];
  let lastTS = 0;
  const delimiter = "#";

  subscribeTo = async () => {
    await BluetoothSerial.subscribe(delimiter)
      .then(() => {
        console.log("Subscribed for data with delimiter", delimiter);
        setIsConnected(true);
        dsiplaySuccessToast(
          "Dispozitiv inteligent",
          "Conexiunea s-a realizat cu success!"
        );
      })
      .catch((err) => console.log("Error subscribing ", err));

    await BluetoothSerial.on("data", (data) => {
      if (data.data.indexOf("/") != -1) {
        console.log("date modul", data);
        let listData = data.data.split("/");
        let hRate = 0;
        let tmp = 0;
        let hum = 0;

        if (
          listData.length == 4 &&
          listData[0].indexOf("NAN") == -1 &&
          listData[1].indexOf("NAN") == -1 &&
          listData[2].indexOf("NAN") == -1 &&
          parseInt(listData[3]) !== lastTS
        ) {
          hRate = parseInt(listData[0]);
          tmp = parseFloat(listData[2]);
          hum = parseFloat(listData[1]);
          setData({
            heartRate: hRate,
            temperature: tmp,
            humidity: hum,
          });
          //console.log("setare", parseInt(listData[3]));
          lastTS = parseInt(listData[3]);
          //console.log("last TS", lastTS);
          let currentDate = new Date();
          const dateString =
            ("0" + currentDate.getDate()).slice(-2) +
            "." +
            ("0" + (currentDate.getMonth() + 1)).slice(-2) +
            "." +
            currentDate.getFullYear() +
            " - " +
            ("0" + currentDate.getHours()).slice(-2) +
            ":" +
            ("0" + currentDate.getMinutes()).slice(-2) +
            ":" +
            ("0" + currentDate.getSeconds()).slice(-2);
          const newValues = {
            puls: hRate,
            temp: tmp,
            umid: hum,
            time_stamp: dateString,
          };
          //console.log("nv: ", newValues);
          console.log("aici:", masuratori);
          if (masuratori.length === 2) {
            saveMeasurement([...masuratori, newValues]);
            //console.log("masuratori", masuratori);
            console.log("salvare masuraori");
            masuratori = [];
          } else {
            console.log("else");
            masuratori.push(newValues);
          }
          verifyLimits();
        }
      }
    });

    await BluetoothSerial.clear();
  };

  connectToDevice = async () => {
    try {
      if (!BluetoothSerial) {
        console.log("BluetoothSerial is not defined");
        return;
      }
      await BluetoothSerial.enable();
      const devices = await BluetoothSerial.list();
      console.log("Available devices:", devices);
      if (!devices || devices.length === 0) {
        console.log("No devices found");
        return;
      }
      const device = devices.find((d) => d.name === "HC-05");
      if (device) {
        console.log("Found device:", device);
        await BluetoothSerial.connect(device.id);

        const connected = await BluetoothSerial.isConnected();
        if (connected) {
          console.log("Connected to device:", device.name);
          subscribeTo();
        } else {
          console.log("Failed to connect to device");
        }
      } else {
        console.log("Device not found ");
      }
    } catch (error) {
      console.log("Error connecting to device:", error);
      displayErrorToast("Eroare Bluetooth", "Va rugam sa va reconectati!");
    }
  };

  useEffect(() => {
    connectToDevice();
    return () => {
      BluetoothSerial.unsubscribe();
      BluetoothSerial.disconnect();
    };
  }, []);

  const displayErrorToast = (type, message) => {
    Toast.show({
      type: "error",
      position: "top",
      text1: type,
      text2: message,
      text1Style: { fontSize: 15 },
      text2Style: { fontSize: 15 },
      visibilityTime: 10000,
      autoHide: true,
      topOffset: 40,
      bottomOffset: 40,
    });
  };

  const dsiplaySuccessToast = (type, message) => {
    Toast.show({
      type: "success",
      position: "top",
      text1: type,
      text2: message,
      text1Style: { fontSize: 15 },
      text2Style: { fontSize: 15 },
      visibilityTime: 10000,
      autoHide: true,
      topOffset: 40,
      bottomOffset: 40,
    });
  };
  const displayAlertOnScreen = (alert) => {
    if (isAlaramSet) {
      return;
    }
    Toast.show({
      type: "info",
      position: "top",
      text1: alert.descriere.split("->")[0],
      text2: alert.descriere.split("->")[1],
      text1Style: { fontSize: 15 },
      text2Style: { fontSize: 15 },
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 40,
      bottomOffset: 40,
      onPress: () => {
        navigation.navigate("Alerts");
      },
    });
    setIsAlramSet(true);
  };

  verifyLimits = () => {
    console.log("Verifying limits");
    console.log(isMoving);
    console.log("LIMITE: ", userData.limite_medic);
    if (
      userData &&
      userData.hasOwnProperty("limite_medic") &&
      userData.limite_medic != null &&
      isAlaramSet == false
    ) {
      let currentDate = new Date();
      const dateString =
        ("0" + currentDate.getDate()).slice(-2) +
        "." +
        ("0" + (currentDate.getMonth() + 1)).slice(-2) +
        "." +
        currentDate.getFullYear() +
        " - " +
        ("0" + currentDate.getHours()).slice(-2) +
        ":" +
        ("0" + currentDate.getMinutes()).slice(-2) +
        ":" +
        ("0" + currentDate.getSeconds()).slice(-2);

      //console.log("Is moving: " + isMoving);
      if (isMoving) {
        console.log("Is moving");
        if (
          (data.heartRate > userData.limite_medic.puls_max_miscare ||
            data.heartRate < userData.limite_medic.puls_min_miscare) &&
          data.heartRate !== 0
        ) {
          const alert = {
            tip: "Puls",
            descriere:
              "Interval puls: " +
              userData.limite_medic.puls_min_miscare +
              " - " +
              userData.limite_medic.puls_max_miscare +
              " -> Limita depasita " +
              (data.heartRate < userData.limite_medic.puls_min_miscare
                ? "inferior: "
                : "superior: ") +
              data.heartRate +
              " bpm",
            stare: "Miscare",
            time_stamp: dateString,
            comentariu: "",
          };
          FirebaseService.addPatientAlert(userData.ID, alert);
          displayAlertOnScreen(alert);
        } else if (
          (data.temperature > userData.limite_medic.temp_max_miscare ||
            data.temperature < userData.limite_medic.temp_min_miscare) &&
          data.temperature !== 0
        ) {
          console.log("data.Temperature: " + data.temperature);
          const alert = {
            tip: "Temperatura",
            descriere:
              "Interval temperatura: " +
              userData.limite_medic.temp_min_miscare +
              " - " +
              userData.limite_medic.temp_max_miscare +
              " -> Limita depasita " +
              (data.temperature < userData.limite_medic.temp_min_miscare
                ? "inferior: "
                : "superior: ") +
              data.temperature,
            stare: "Miscare",
            time_stamp: dateString,
            comentariu: "",
          };
          FirebaseService.addPatientAlert(userData.ID, alert);
          displayAlertOnScreen(alert);
        } else if (
          (data.humidity > userData.limite_medic.umid_max_miscare ||
            data.humidity < userData.limite_medic.umid_min_miscare) &&
          data.humidity !== 0
        ) {
          const alert = {
            tip: "Umiditate",
            descriere:
              "Interval umiditate: " +
              userData.limite_medic.umid_min_miscare +
              " - " +
              userData.limite_medic.umid_max_miscare +
              " -> Limita depasita " +
              (data.humidity < userData.limite_medic.umid_min_miscare
                ? "inferior: "
                : "superior: ") +
              data.humidity,
            stare: "Miscare",
            time_stamp: dateString,
            comentariu: "",
          };
          FirebaseService.addPatientAlert(userData.ID, alert);
          displayAlertOnScreen(alert);
        }
      } else {
        console.log("Is not moving");
        if (
          (data.heartRate > userData.limite_medic.puls_max_repaus ||
            data.heartRate < userData.limite_medic.puls_min_repaus) &&
          data.heartRate !== 0
        ) {
          const alert = {
            tip: "Puls",
            descriere:
              "Interval puls: " +
              userData.limite_medic.puls_min_repaus +
              " - " +
              userData.limite_medic.puls_max_repaus +
              " -> Limita depasita " +
              (data.heartRate < userData.limite_medic.puls_min_repaus
                ? "inferior: "
                : "superior: ") +
              data.heartRate +
              " bpm",
            stare: "Repaus",
            time_stamp: dateString,
            comentariu: "",
          };
          FirebaseService.addPatientAlert(userData.ID, alert);
          displayAlertOnScreen(alert);
        } else if (
          (data.temperature > userData.limite_medic.temp_max_repaus ||
            data.temperature < userData.limite_medic.temp_min_repaus) &&
          data.temperature !== 0
        ) {
          const alert = {
            tip: "Temperatura",
            descriere:
              "Interval temperatura: " +
              userData.limite_medic.temp_min_repaus +
              " - " +
              userData.limite_medic.temp_max_repaus +
              " -> Limita depasita " +
              (data.heartRate < userData.limite_medic.puls_min_repaus
                ? "inferior: "
                : "superior: ") +
              data.temperature,
            stare: "Repaus",
            time_stamp: dateString,
            comentariu: "",
          };
          FirebaseService.addPatientAlert(userData.ID, alert);
          displayAlertOnScreen(alert);
        } else if (
          (data.humidity > userData.limite_medic.umid_max_repaus ||
            data.humidity < userData.limite_medic.umid_min_repaus) &&
          data.humidity !== 0
        ) {
          const alert = {
            tip: "Umiditate",
            descriere:
              "Interval umiditate: " +
              userData.limite_medic.umid_min_repaus +
              " - " +
              userData.limite_medic.umid_max_repaus +
              " -> Limita depasita " +
              (data.humidity < userData.limite_medic.umid_min_repaus
                ? "inferior: "
                : "superior: ") +
              data.humidity,
            stare: "Repaus",
            time_stamp: dateString,
            comentariu: "",
          };
          FirebaseService.addPatientAlert(userData.ID, alert);
          displayAlertOnScreen(alert);
        }
      }
    }
  };

  saveMeasurement = async (measurements) => {
    console.log("salvare masuratori in db");
    const average = (values) =>
      (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
    const [puls, temp, umid] = ["puls", "temp", "umid"].map((key) =>
      average(measurements.map((m) => m[key]))
    );
    const time_stamp = measurements[measurements.length - 1].time_stamp;
    const newValues = { puls, temp, umid, time_stamp };
    console.log(newValues);
    if (userData && newValues) {
      FirebaseService.addMeasurementToPatient(userData.ID, newValues);
    }
  };
  useEffect(() => {
    const movementData = [];
    setUpdateIntervalForType(SensorTypes.accelerometer, 1000);
    const subscription = accelerometer.subscribe(({ x, y, z }) => {
      const speed = Math.sqrt(x * x + y * y + z * z);
      movementData.push(parseFloat(speed.toFixed(2)));
      if (movementData.length >= 10) {
        const avg =
          movementData.reduce((a, b) => a + b, 0) / movementData.length;
        setIsMoving(avg > 12.0);
        movementData.length = 0;
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topLeft}>
        <Ionicons name="thermometer-outline" size={60} color="black" />
        <Text style={styles.text}>{data.temperature}°C</Text>
      </View>
      <View style={styles.topRight}>
        <Ionicons name="water-outline" size={60} color="black" />
        <Text style={styles.text}>{data.humidity}%</Text>
      </View>
      <View style={styles.center}>
        <Animatable.View
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
          style={styles.heart}
        >
          <Ionicons name="heart" size={350} color="#C62A47" />
          <Text style={styles.heartRate}>{data.heartRate}</Text>
        </Animatable.View>
      </View>
      <BottomMenu navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  topLeft: {
    position: "absolute",
    top: 40,
    left: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  topRight: {
    position: "absolute",
    top: 40,
    right: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heart: {
    alignItems: "center",
  },
  heartRate: {
    position: "absolute",
    fontSize: 60,
    color: "white",
    top: "38%",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  device: {
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
    top: 100,
    right: 40,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default HomeScreen;
