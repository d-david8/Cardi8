import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import BottomMenu from "../components/BottomMenu";
import "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import FirebaseService from "../services/FirebaseService";
import { FontAwesome } from "@expo/vector-icons";

const RecommendationsScreen = ({ navigation }) => {
  const [recommendations, setRecommendations] = useState([]);
  const { userData } = useAuth();

  useEffect(() => {
    FirebaseService.getPatientRecommendations(userData.ID).then((data) => {
      setRecommendations(data);
    });
  }, []);
  if (recommendations === null || recommendations.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <FontAwesome
          style={{ bottom: 20 }}
          name="exclamation-circle"
          size={60}
          color="black"
        />
        <Text style={{ fontSize: 20 }}>Nu există recomandări!</Text>
        <BottomMenu navigation={navigation} />
      </View>
    );
  }
  const RecommendationItem = ({ item }) => {
    const observations =
      item.altele == null || item.altele.length === 0
        ? "Fără observații"
        : item.altele;
    return (
      <View style={styles.recommendationItem}>
        <Text style={styles.title}>{item.titlu}</Text>
        <Text style={styles.description}>{item.descriere}</Text>
        <Text style={styles.description}>
          <FontAwesome
            style={{ bottom: 20 }}
            name="exclamation-circle"
            size={18}
            color="black"
          />
          {"  "}
          {observations}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={recommendations}
          renderItem={({ item }) => <RecommendationItem item={item} />}
        />
      </View>
      <BottomMenu navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  recommendationItem: {
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
    paddingBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default RecommendationsScreen;
