import FirebaseService from "../services/FirebaseService";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { authentication } from "../firebase/config";
import { signOut } from "firebase/auth";
import { set } from "firebase/database";
import { useEffect, useState } from "react";

const ProfileScreen = () => {
  const { setLoggedInUser, userData, setUserData } = useAuth();
  const [doctorName, setDoctorName] = useState("");

  const signOutUser = () => {
    signOut(authentication)
      .then(() => {
        setLoggedInUser(null);
        setUserData(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  async function fetchDoctorName() {
    let docName = await FirebaseService.getDoctorName(userData.medic_id);
    setDoctorName(docName);
  }

  useEffect(() => {
    fetchDoctorName();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Date personale</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detail}>
              <Text style={styles.label}>Nume complet:</Text>
              <Text style={styles.value}>{userData.nume_prenume}</Text>
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.detail}>
              <Text style={styles.label}>Vârsta:</Text>
              <Text style={styles.value}>{userData.varsta}</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.label}>CNP:</Text>
              <Text style={styles.value}>{userData.CNP}</Text>
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.detail}>
              <Text style={styles.label}>Telefon:</Text>
              <Text style={styles.value}>{userData.telefon}</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{userData.email}</Text>
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.detail}>
              <Text style={styles.label}>Profesie și loc de munca:</Text>
              <Text style={styles.value}>{userData.profesie}</Text>
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.detail}>
              <Text style={styles.label}>Adresă:</Text>
              <Text style={styles.value}>{userData.adresa}</Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionContainers}>
          <Text style={styles.sectionTitle}>Detalii medicale</Text>
          <View style={styles.detailsContainer2}>
            <View style={styles.detail2}>
              <Text style={styles.label}>Monitorizat de:</Text>
              <Text style={styles.value}>{doctorName}</Text>
            </View>
            <View style={styles.detail2}>
              <Text style={styles.label}>Alergii:</Text>
              <Text style={styles.value}>{userData.alergii}</Text>
            </View>
            <View style={styles.detail2}>
              <Text style={styles.label}>Istoric medical:</Text>
              <Text style={styles.value}>{userData.istoric}</Text>
            </View>
            <View style={styles.detail2}>
              <Text style={styles.label}>Consultații radiologice:</Text>
              <Text style={styles.value}>{userData.consultatii}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={signOutUser} style={styles.button}>
        <Text style={styles.signOutText}>Deconectare</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "flex-start",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  detailsContainer2: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },

  sectionContainer: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detail: {
    flex: 1,
    marginRight: 10,
    padding: 5,
    borderWidth: 1,
    borderBlockColor: "grey",
    borderRadius: 10,
  },
  detail2: {
    flex: 1,
    marginTop: 10,
    padding: 5,
    borderWidth: 1,
    borderBlockColor: "grey",
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    fontSize: 17,
  },
  button: {
    backgroundColor: "#DC143C",
    borderRadius: 50,
    padding: 10,
    marginVertical: 10,
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  signOutText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
