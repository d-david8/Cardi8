import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import BottomMenu from "../components/BottomMenu";
import { useAuth } from "../contexts/AuthContext";
import FirebaseService from "../services/FirebaseService";
import { FontAwesome } from "@expo/vector-icons";

const ActiviesScreen = ({ navigation }) => {
  const [activities, setActivities] = useState([]);
  const { userData } = useAuth();

  useEffect(() => {
    FirebaseService.getMeasurementsForPatient(userData.ID).then((data) => {
      setActivities(data);
    });
  }, []);

  const ActivityItem = ({ item }) => {
    return (
      <View style={styles.activityItem}>
        <Text style={styles.title}>{item.time_stamp.toString()}</Text>
        <Text style={styles.description}>
          <FontAwesome name="heartbeat" size={18} color="black" /> {item.puls}{" "}
          {item.puls > 0 ? "bpm" : ""}
          {"  "}
          <FontAwesome name="thermometer-half" size={18} color="black" />{" "}
          {item.temp} {item.temp > 0 ? "°C" : ""}
          {"  "}
          <FontAwesome name="tint" size={18} color="black" /> {item.umid}{" "}
          {item.umid > 0 ? "%" : ""}
        </Text>
      </View>
    );
  };

  if (activities === null || activities.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <FontAwesome
          style={{ bottom: 20 }}
          name="exclamation-circle"
          size={60}
          color="black"
        />
        <Text style={{ fontSize: 20 }}>Nu există măsurători anterioare!</Text>
        <BottomMenu navigation={navigation} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={activities}
          renderItem={({ item }) => <ActivityItem item={item} />}
        />
      </View>
      <BottomMenu navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  activityItem: {
    margin: 10,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 15,
    marginBottom: 5,
  },
});

export default ActiviesScreen;
