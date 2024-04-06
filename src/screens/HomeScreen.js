import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import BottomMenu from "../components/BottomMenu";

const HomeScreen = ({ navigation }) => {
  const [heartRate, setHeartRate] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);

  useEffect(() => {
    // Generare valori random pentru ratele inimii, temperatură și umiditate
    const heartInterval = setInterval(() => {
      setHeartRate(Math.floor(Math.random() * 150));
    }, 2000);

    const temperatureInterval = setInterval(() => {
      setTemperature(Math.floor(Math.random() * 40));
    }, 3000);

    const humidityInterval = setInterval(() => {
      setHumidity(Math.floor(Math.random() * 100));
    }, 4000);

    return () => {
      clearInterval(heartInterval);
      clearInterval(temperatureInterval);
      clearInterval(humidityInterval);
    };
  }, []);

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
});

export default HomeScreen;
