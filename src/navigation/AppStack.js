import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { FontAwesome } from "@expo/vector-icons";
import ECKScreen from "../screens/ECKScreen";
import ActivityScreen from "../screens/ActivitiesScreen";
import RecommendationsScreen from "../screens/RecommendationsScreen";
import AlertsScreen from "../screens/AlertsScreen";

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <FontAwesome
              name="user-o"
              size={24}
              color="white"
              onPress={() => navigation.navigate("Profile")}
            />
          ),
          headerLeft: () => (
            <FontAwesome
              name="bell-o"
              size={24}
              color="white"
              onPress={() => navigation.navigate("Alerts")}
            />
          ),
          headerShown: true,
          headerTitle: "Acasă",
          headerStyle: {
            backgroundColor: "#C62A47",
            fontWeight: "bold",
            color: "white",
          },
          headerTitleAlign: "center",
          headerTintColor: "white",
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerTitle: "Profilul meu",
          headerStyle: { backgroundColor: "#C62A47" },
          headerTitleAlign: "center",
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="ECK"
        component={ECKScreen}
        options={{
          headerShown: true,
          headerTitle: "ECG",
          headerStyle: { backgroundColor: "#C62A47" },
          headerTitleAlign: "center",
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="Activities"
        component={ActivityScreen}
        options={{
          headerShown: true,
          headerTitle: "Măsurători anterioare",
          headerStyle: { backgroundColor: "#C62A47" },
          headerTitleAlign: "center",
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="Recommendations"
        component={RecommendationsScreen}
        options={{
          headerShown: true,
          headerTitle: "Recomandări",
          headerStyle: { backgroundColor: "#C62A47" },
          headerTitleAlign: "center",
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          headerShown: true,
          headerTitle: "Alerte",
          headerStyle: { backgroundColor: "#C62A47" },
          headerTitleAlign: "center",
          headerTintColor: "white",
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
