import React from "react";  
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Button = ({ title, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
    }
export default Button;
const styles = StyleSheet.create({
    button: {
        backgroundColor: "#DC143C",
        borderRadius: 50,
        padding: 10,
        margin: 14,
        width: "70%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
      },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
        alignSelf: "center",
    },
});