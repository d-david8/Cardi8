import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import styles from "../../styles/styles";

//import RNSmtpMailer from "react-native-smtp-mailer";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [fisrstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = () => {
    setIsLoading(true);
  };

  return (
    <View style={localStyles.container}>
      <Text style={localStyles.title}>Aplica pentru un cont</Text>

      <TextInput
        style={styles.input}
        placeholder="Nume"
        autoCapitalize="none"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Prenume"
        autoCapitalize="none"
        value={fisrstName}
        onChangeText={(text) => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefon"
        keyboardType="phone-pad"
        autoCapitalize="none"
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />
      <TouchableOpacity onPress={sendEmail} style={styles.button}>
        <Text style={styles.buttonText}>Aplica</Text>
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
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default SignUpScreen;
