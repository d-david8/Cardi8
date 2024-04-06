import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import ApplyScreen from "../screens/ApplyScreen";

const Stack = createNativeStackNavigator();

const GuestStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Apply"
        component={ApplyScreen}
        options={{
          headerShown: true,
          headerTitle: "Aplica",
          headerStyle: { backgroundColor: "#C62A47", fontWeight: "bold" },
          headerTitleAlign: "center",
          headerTintColor: "white",
        }}
      />
    </Stack.Navigator>
  );
};

export default GuestStack;
