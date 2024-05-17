import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { authentication, db } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import styles from "../../styles/styles";
import FirebaseService from "../services/FirebaseService";
import BleManager from "react-native-ble-manager";
import { PermissionsAndroid, Platform } from "react-native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  const inputRef = React.useRef();
  const passwordRef = React.useRef();

  const [isLoading, setIsLoading] = useState(false);

  const { setLoggedInUser, setUserData } = useAuth();

  const handleSignIn = async () => {
    setIsLoading(true);
    signInWithEmailAndPassword(authentication, email, password)
      .then((res) => {
        FirebaseService.getPatientData(res.user.uid).then((data) => {
          setUserData(data);
        });
        setLoggedInUser(res.user);
        FirebaseService.initialize(res.user.uid);
      })
      .catch((err) => {
        console.log(err);
        setError("Incorrect Email/Password");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    // turn on bluetooth if it is not on
    BleManager.enableBluetooth().then(() => {
      console.log("Bluetooth is turned on!");
    });

    if (Platform.OS === "android" && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then((result) => {
        if (result) {
          console.log("Permission is OK");
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          ).then((result) => {
            if (result) {
              console.log("User accept");
            } else {
              console.log("User refuse");
            }
          });
        }
      });
    }
  }, []);

  return (
    <View style={localStyles.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={localStyles.logo}
      />
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#003f5c"
        value={email}
        onChangeText={(email) => setEmail(email)}
        onPressIn={() => setError(null)}
      />
      <TextInput
        ref={passwordRef}
        style={styles.input}
        placeholder="Parola"
        placeholderTextColor="#003f5c"
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        onPressIn={() => setError(null)}
      />
      {error && <Text style={localStyles.errorText}>{error}</Text>}

      <TouchableOpacity onPress={handleSignIn} style={styles.button}>
        <Text style={styles.buttonText}>Conectare</Text>
        {isLoading && (
          <ActivityIndicator
            size="small"
            color="white"
            style={{
              alignSelf: "center",
              justifyContent: "center",
              paddingLeft: 10,
            }}
          />
        )}
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text style={localStyles.downText}>Nu ai cont?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Apply")}>
          <Text style={localStyles.signup}>Aplica</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  logo: {
    width: 300,
    height: 150,
    marginBottom: 20,
  },
  downText: {
    color: "#C62A47",
    fontSize: 16,
    fontWeight: "400",
    marginTop: 10,
  },
  signup: {
    alignSelf: "flex-start",
    textDecorationLine: "underline",
    color: "#DC143C",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 5,
    marginTop: 10,
  },
});

export default LoginScreen;
