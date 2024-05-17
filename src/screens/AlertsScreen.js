import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Toast from "react-native-toast-message";
import FirebaseService from "../services/FirebaseService";
import { FontAwesome } from "@expo/vector-icons";

const AlertsScreen = () => {
  const [alerts, setAlerts] = useState([]);
  const { userData } = useAuth();

  useEffect(() => {
    FirebaseService.getPatientAlerts(userData.ID).then((data) => {
      setAlerts(data);
    });
  }, []);

  // Component pentru randul din lista de avertizări
  const AlertItem = ({ alert }) => {
    const [comment, setComment] = useState(alert.comentariu);
    const updateComment = () => {
      db.collection("pacienti")
        .doc(userData.ID)
        .update({
          alarme: alerts.map((a) =>
            a.time_stamp === alert.time_stamp
              ? { ...a, comentariu: comment }
              : a
          ),
        })
        .then(() => {
          Toast.show({
            type: "success",
            position: "top",
            text1: "Success",
            text2: "Comentariu actualizat cu succes!",
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 40,
            bottomOffset: 40,
          });
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    };

    return (
      <View style={styles.alertItem}>
        <View style={styles.someStyleName}>
          <Text style={styles.title}>{alert.tip}</Text>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.date}>{alert.time_stamp}</Text>
          </View>
        </View>

        <Text style={styles.description}>{alert.descriere}</Text>
        <Text style={styles.description}>{"Stare: " + alert.stare}</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Adauga comentariu"
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity style={styles.addButton} onPress={updateComment}>
          <Text style={styles.buttonText}>Salveaza comentariul</Text>
        </TouchableOpacity>
      </View>
    );
  };
  if (alerts === null || alerts.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <FontAwesome
          style={{ bottom: 20 }}
          name="exclamation-circle"
          size={60}
          color="black"
        />
        <Text style={{ fontSize: 20 }}>Nu există alerte!</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={alerts}
        renderItem={({ item }) => <AlertItem alert={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  alertItem: {
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#C62A47",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  commentContainer: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    padding: 8,
  },
  comment: {
    fontStyle: "italic",
  },
  date: {
    fontSize: 18,
    color: "#666",
    textAlign: "right",
  },
  someStyleName: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateTimeContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

export default AlertsScreen;
