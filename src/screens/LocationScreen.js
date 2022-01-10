import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/FontAwesome";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

function LandingScreen({ navigation }) {
  const width = Dimensions.get("window").width;
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState({
    latitude: 38.9637,
    longitude: 35.2433,
    latitudeDelta: 10,
    longitudeDelta: 20,
  });

  const getCurrentLocation = async () => {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({});
      let address = `http://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;
      setAddress(address);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.000922,
        longitudeDelta: 0.00033,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => getCurrentLocation()}
          title="Current Location"
        >
          <Text style={{ color: "white" }}>
            Current Location <Icon name="location-arrow" />
          </Text>
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => navigation.navigate("Contacts", { address: address })}
          title="Share Location"
        >
          <Text style={{ color: "white" }}>
            Share Location <Icon name="share-square-o" />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  map: {
    width: width,
    height: height * 0.86,
  },
  buttonContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "flex-end",
    bottom: 0,
  },
  buttonStyle: {
    width: width * 0.5,
    alignItems: "center",
    backgroundColor: "#03A9F4",
    padding: 10,
  },
  verticleLine: {
    height: "100%",
    width: 0.4,
    backgroundColor: "white",
  },
});

export default LandingScreen;
