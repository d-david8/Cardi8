import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";

const BottomMenu = ({ navigation }) => {
  return (
    <View style={styles.bottom}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        <Ionicons name="home" size={30} color="white" />
        <Text style={{ color: "white" }}>Acasa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          navigation.navigate("ECK");
        }}
      >
        <Ionicons name="pulse" size={30} color="white" />
        <Text style={{ color: "white" }}>ECG</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Activities")}
      >
        <Ionicons name="fitness-outline" size={30} color="white" />
        <Text style={{ color: "white" }}>Măsurători</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Recommendations")}
      >
        <Ionicons name="alert-circle-outline" size={30} color="white" />
        <Text style={{ color: "white" }}>Recomandări</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  bottom: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#C62A47",
    paddingVertical: 10,
  },
  menuItem: {
    alignItems: "center",
    flex: 1,
  },
  text: {
    marginLeft: 5,
    fontSize: 20,
  },
};

export default BottomMenu;
