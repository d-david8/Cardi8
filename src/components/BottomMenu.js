import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const BottomMenu = ({ navigation }) => {
  const route = useRoute();

  const getIconColor = (routeName) => {
    return route.name === routeName ? "black" : "white";
  };
  return (
    <View style={styles.bottom}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        <Ionicons name="home" size={30} color={getIconColor("Home")} />
        <Text style={{ color: getIconColor("Home") }}>Acasa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          navigation.navigate("ECK");
        }}
      >
        <Ionicons name="pulse" size={30} color={getIconColor("ECK")} />
        <Text style={{ color: getIconColor("ECK") }}>ECG</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Activities")}
      >
        <Ionicons
          name="fitness-outline"
          size={30}
          color={getIconColor("Activities")}
        />
        <Text style={{ color: getIconColor("Activities") }}>Măsurători</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Recommendations")}
      >
        <Ionicons
          name="alert-circle-outline"
          size={30}
          color={getIconColor("Recommendations")}
        />
        <Text style={{ color: getIconColor("Recommendations") }}>
          Recomandări
        </Text>
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
