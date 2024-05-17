import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import BottomMenu from "../components/BottomMenu";
import BleManager from "react-native-ble-manager";
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from "react-native-sensors";
import { map, filter } from "rxjs/operators";
import { useAuth } from "../contexts/AuthContext";
import FirebaseService from "../services/FirebaseService";
import { limit } from "firebase/firestore";
import { set } from "firebase/database";
import Toast from "react-native-toast-message";

const HomeScreen = ({ navigation }) => {
  const [heartRate, setHeartRate] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [isMoving, setMoving] = useState(false);
  const [movments, setMovments] = useState([]);
  let limite_medic = null;

  const [masuratori, setMasuratori] = useState([]);

  const { userData } = useAuth();
  if (userData) {
    limite_medic = userData["limite_medic"];
    if (limite_medic.puls_max_miscare == "") {
      limite_medic = null;
    }
  }
  //const parameters = userData.limite_medic ? userData.limite_medic : null;

  setUpdateIntervalForType(SensorTypes.accelerometer, 1000);

  const peripherals = new Map();
  const [connectedDevices, setConnectedDevices] = useState([]);

  const handleGetConnectedDevices = () => {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length === 0) {
        console.log("No connected bluetooth devices");
        BleManager.getBondedPeripherals([]).then((results) => {
          if (results.length === 0) {
            console.log("No associated bluetooth devices");
          } else {
            for (let i = 0; i < results.length; i++) {
              let peripheral = results[i];
              console.log("Found associated device: " + peripheral.name);
              if (peripheral.name === "HC-05") {
                console.log("Found HC-05 device");
                peripheral.connected = true;
                peripherals.set(peripheral.id, peripheral);
                console.log("HC-05 device is already connected");
              }
            }
          }
        });
      }
    });
  };

  const getRandomValues = () => {
    const minHeartRate = 80;
    const maxHeartRate = 90;
    const heartRate =
      Math.floor(Math.random() * (maxHeartRate - minHeartRate + 1)) +
      minHeartRate;
    setHeartRate(heartRate);

    const minTemperature = 29;
    const maxTemperature = 30;
    const temperature =
      Math.floor(Math.random() * (maxTemperature - minTemperature + 1)) +
      minTemperature;
    setTemperature(temperature);

    const minHumidity = 60;
    const maxHumidity = 60;
    const humidity =
      Math.floor(Math.random() * (maxHumidity - minHumidity + 1)) + minHumidity;
    setHumidity(humidity);
  };
  const displayAlertOnScreen = (alert) => {
    Toast.show({
      type: "info",
      position: "top",
      text1: alert.tip,
      text2: alert.descriere,
      visibilityTime: 10000,
      autoHide: true,
      topOffset: 40,
      bottomOffset: 40,
      onPress: () => {
        navigation.navigate("Alerts");
      },
    });
  };

  const verifyLimits = () => {
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
    console.log("Verifying limits");
    //console.log("Is moving: " + isMoving);
    if (isMoving) {
      console.log("Is moving");
      if (
        (heartRate > limite_medic.puls_max_miscare ||
          heartRate < limite_medic.puls_min_miscare) &&
        heartRate !== 0
      ) {
        const alert = {
          tip: "Puls",
          descriere:
            "Interval puls: " +
            limite_medic.puls_min_miscare +
            " - " +
            limite_medic.puls_max_miscare +
            " -> Limita depasita " +
            (heartRate < limite_medic.puls_min_miscare
              ? "inferior: "
              : "superior: ") +
            heartRate +
            " bpm",
          stare: "Miscare",
          time_stamp: dateString,
          comentariu: "",
        };
        FirebaseService.addPatientAlert(userData.ID, alert);
        displayAlertOnScreen(alert);
      } else if (
        (temperature > limite_medic.temp_max_miscare ||
          temperature < limite_medic.temp_min_miscare) &&
        temperature !== 0
      ) {
        console.log("Temperature: " + temperature);
        const alert = {
          tip: "Temperatura",
          descriere:
            "Interval temperatura: " +
            limite_medic.temp_min_miscare +
            " - " +
            limite_medic.temp_max_miscare +
            " -> Limita depasita " +
            (temperature < limite_medic.temp_min_miscare
              ? "inferior: "
              : "superior: ") +
            temperature,
          stare: "Miscare",
          time_stamp: dateString,
          comentariu: "",
        };
        FirebaseService.addPatientAlert(userData.ID, alert);
        displayAlertOnScreen(alert);
      } else if (
        (humidity > limite_medic.umid_max_miscare ||
          humidity < limite_medic.umid_min_miscare) &&
        humidity !== 0
      ) {
        const alert = {
          tip: "Umiditate",
          descriere:
            "Interval umiditate: " +
            limite_medic.umid_min_miscare +
            " - " +
            limite_medic.umid_max_miscare +
            " -> Limita depasita " +
            (humidity < limite_medic.umid_min_miscare
              ? "inferior: "
              : "superior: ") +
            humidity,
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
        (heartRate > limite_medic.puls_max_repaus ||
          heartRate < limite_medic.puls_min_repaus) &&
        heartRate !== 0
      ) {
        const alert = {
          tip: "Puls",
          descriere:
            "Interval puls: " +
            limite_medic.puls_min_repaus +
            " - " +
            limite_medic.puls_max_repaus +
            " -> Limita depasita " +
            (heartRate < limite_medic.puls_min_repaus
              ? "inferior: "
              : "superior: ") +
            heartRate +
            " bpm",
          stare: "Repaus",
          time_stamp: dateString,
          comentariu: "",
        };
        FirebaseService.addPatientAlert(userData.ID, alert);
        displayAlertOnScreen(alert);
      } else if (
        (temperature > limite_medic.temp_max_repaus ||
          temperature < limite_medic.temp_min_repaus) &&
        temperature !== 0
      ) {
        const alert = {
          tip: "Temperatura",
          descriere:
            "Interval temperatura: " +
            limite_medic.temp_min_repaus +
            " - " +
            limite_medic.temp_max_repaus +
            " -> Limita depasita " +
            (heartRate < limite_medic.puls_min_repaus
              ? "inferior: "
              : "superioar: ") +
            temperature,
          stare: "Repaus",
          time_stamp: dateString,
          comentariu: "",
        };
        FirebaseService.addPatientAlert(userData.ID, alert);
        displayAlertOnScreen(alert);
      } else if (
        (humidity > limite_medic.umid_max_repaus ||
          humidity < limite_medic.umid_min_repaus) &&
        humidity !== 0
      ) {
        const alert = {
          tip: "Umiditate",
          descriere:
            "Interval umiditate: " +
            limite_medic.umid_min_repaus +
            " - " +
            limite_medic.umid_max_repaus +
            " -> Limita depasita " +
            (humidity < limite_medic.umid_min_repaus
              ? "inferior: "
              : "superior: ") +
            humidity,
          stare: "Repaus",
          time_stamp: dateString,
          comentariu: "",
        };
        FirebaseService.addPatientAlert(userData.ID, alert);
        displayAlertOnScreen(alert);
      }
    }
  };

  //adaugare masuratori la fiecare 30 de secunde
  useEffect(() => {
    const heartInterval = setInterval(() => {
      getRandomValues();
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
        puls: heartRate,
        temp: temperature,
        umid: humidity,
        time_stamp: dateString,
      };
      setMasuratori((prevMasuratori) => [...prevMasuratori, newValues]);
      if (limite_medic) {
        //console.log("moooving", isMoving);
        verifyLimits();
      }
    }, 6000000);

    /*
    if (!isConnected) {
      BleManager.start({ showAlert: false }).then(() => {
        console.log("BleManager initialized");
        handleGetConnectedDevices();
      });
      setIsConnected(true);
    }*/
    const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) => {
      const viteza = Math.sqrt(x * x + y * y + z * z);
      setMovments((prevMovments) => [
        ...prevMovments,
        parseFloat(viteza.toFixed(2)),
      ]);
      if (movments.length > 10) {
        avg = movments.reduce((a, b) => a + b, 0) / movments.length;
        //console.log("avg", avg);
        if (avg > 11.0) {
          setMoving(true);
        } else {
          setMoving(false);
        }
        setMovments([]);
      }
      //console.log(isMoving + " " + Math.sqrt(x * x + y * y + z * z));
    });

    setUpdateIntervalForType(SensorTypes.accelerometer, 1000);

    return () => {
      clearInterval(heartInterval);
      subscription.unsubscribe();
    };
  }, [isMoving, heartRate, temperature, humidity]);

  useEffect(() => {
    if (masuratori.length === 3) {
      let newValues = {
        puls: (
          (masuratori[0].puls + masuratori[1].puls + masuratori[2].puls) /
          3
        ).toFixed(2),
        temp: (
          (masuratori[0].temp + masuratori[1].temp + masuratori[2].temp) /
          3
        ).toFixed(2),
        umid: (
          (masuratori[0].umid + masuratori[1].umid + masuratori[2].umid) /
          3
        ).toFixed(2),
        time_stamp: masuratori[2].time_stamp,
      };
      FirebaseService.addMeasurementToPatient(userData.ID, newValues);
      setMasuratori([]);
    }
  }, [masuratori]);

  return (
    <View style={styles.container}>
      <View style={styles.topLeft}>
        <Ionicons name="thermometer-outline" size={60} color="black" />
        <Text style={styles.text}>{temperature}°C</Text>
      </View>
      <View style={styles.topRight}>
        <Ionicons name="water-outline" size={60} color="black" />
        <Text style={styles.text}>{humidity}%</Text>
      </View>
      <View style={styles.center}>
        <Animatable.View
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
          style={styles.heart}
        >
          <Ionicons name="heart" size={350} color="#C62A47" />
          <Text style={styles.heartRate}>{heartRate}</Text>
        </Animatable.View>
      </View>
      {connectedDevices.map((device) => (
        <TouchableOpacity key={device.id}>
          <Text>{device.name}</Text>
        </TouchableOpacity>
      ))}
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
