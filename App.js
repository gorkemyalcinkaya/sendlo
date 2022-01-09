import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LocationScreen from "./src/screens/LocationScreen";
import ContactScreen from "./src/screens/ContactScreen";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="sendlo">
        <Stack.Screen name="sendlo" component={LocationScreen} />
        <Stack.Screen name="Contacts" component={ContactScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
