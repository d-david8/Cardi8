import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import styles from "../../styles/styles";
import BottomMenu from "../components/BottomMenu";
import BluetoothSerial from "react-native-bluetooth-hc05";
import FirebaseService from "../services/FirebaseService";
import { useAuth } from "../contexts/AuthContext";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const graphHeight = screenHeight * 0.6;

const EcgScreen = ({ navigation }) => {
  const [ecgData, setEcgData] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { userData } = useAuth();
  useEffect(() => {
    if (isGenerating) {
      checkifConnected();
    }
  }, [isGenerating]);

  readData = async () => {
    console.log("here");

    BluetoothSerial.on("data", (data) => {
      console.log("dataaici", data);
      if (data.data.indexOf("/") == -1) {
        if (data.data.indexOf("NAN") == -1) {
          let value = parseInt(data.data);
          setEcgData((prevData) => [...prevData, value]);
        }
      }
    });
  };
  checkifConnected = async () => {
    const connected = await BluetoothSerial.isConnected();
    console.log(connected);
    if (connected) {
      await BluetoothSerial.write("a")
        .then((res) => {
          console.log("Succesfully send data to arduino");
          readData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleStartStop = () => {
    if (isGenerating) {
      //BluetoothSerial.write("a");
      console.log(ecgData);
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
      const ecgtoSave = {
        data: ecgData,
        time_stam: dateString,
      };
      FirebaseService.saveECGdata(userData.ID, ecgtoSave);
      setIsGenerating(false);
    } else {
      setIsGenerating(true);
    }
  };
  const normalizeValue = (value, min, max, newMin, newMax) => {
    return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
  };
  return (
    <View style={localStyles.container}>
      <View style={localStyles.ecgContainer}>
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${screenWidth} ${screenHeight * 0.6}`}
        >
          <Path
            fill="none"
            stroke="red"
            strokeWidth="3"
            d={
              `M0,${graphHeight / 2} ` +
              ecgData
                .map((value, index) => {
                  const normalizedValue = normalizeValue(
                    value,
                    200,
                    800,
                    0,
                    graphHeight
                  );
                  return `L${index * 3},${graphHeight - normalizedValue}`;
                })
                .join(" ")
            }
          />
        </Svg>
        <View style={localStyles.backgroundLines} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleStartStop}>
        <Text style={styles.buttonText}>
          {isGenerating ? "Stop ECG" : "Start ECG"}
        </Text>
      </TouchableOpacity>
      <BottomMenu navigation={navigation} />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ecgContainer: {
    width: "90%",
    height: graphHeight,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    marginBottom: 20,
  },
  backgroundLines: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
    borderBottomColor: "rgba(0, 0, 255, 0.1)",
    borderBottomWidth: 1,
    borderStyle: "dashed",
  },
});

export default EcgScreen;
