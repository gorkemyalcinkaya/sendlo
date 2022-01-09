import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";

import * as Contacts from "expo-contacts";
import * as SMS from "expo-sms";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationRouteContext } from "@react-navigation/native";

function ContactScreen({ route, navigation }) {
  const { address } = route.params;
  const [contacts, setContacts] = useState(null);
  const [filteredContacts, setFilteredContacts] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        setContacts(data);
        setFilteredContacts(data);
      }
    })();
  }, []);

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = contacts.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      setFilteredContacts(newData);
      setSearch(text);
    } else {
      setFilteredContacts(contacts);
      setSearch(text);
    }
  };

  const renderHeader = () => {
    return (
      <TextInput
        value={search}
        style={styles.searchBox}
        placeholder="search for contact"
        underlineColorAndroid="transparent"
        onChangeText={(text) => searchFilterFunction(text)}
        autoCorrect={false}
      />
    );
  };
  const ContactOnPress = useCallback((contact) => () => {
    if (selectedContacts.includes(contact.item)) {
      const newArray = selectedContacts.filter((item) => item !== contact.item);
      setSelectedContacts(newArray);
    } else {
      let contacts = [...selectedContacts, contact.item];
      setSelectedContacts(contacts);
    }
  });
  const renderContacts = (contact) => {
    return (
      <TouchableOpacity
        onPress={ContactOnPress(contact)}
        style={
          selectedContacts.includes(contact.item)
            ? styles.contactSelected
            : styles.contactUnSelected
        }
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.contactText}>{contact.item.name}</Text>
          {selectedContacts.includes(contact.item) && (
            <Icon
              name="check-circle-o"
              size={20}
              color="white"
              style={{ top: 10, right: 10 }}
            />
          )}
        </View>

        <View
          style={{
            borderBottomColor: "#F0ECE3",
            borderBottomWidth: 1,
          }}
        />
      </TouchableOpacity>
    );
  };
  const sendSMS = async (address) => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      let numbers = [];
      selectedContacts.map((item) => {
        numbers.push(item.phoneNumbers[0].number);
      });
      if (numbers) {
        const { result } = await SMS.sendSMSAsync(numbers, address);
        navigation.navigate("sendlo");
      }
    }
  };
  const handleSelected = () => {
    if (filteredContacts == selectedContacts) {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(selectedContacts);
    }
  };

  return (
    <View style={styles.container}>
      {contacts && (
        <View style={styles.container}>
          <FlatList
            removeClippedSubviews={false}
            data={filteredContacts}
            renderItem={renderContacts}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader()}
          ></FlatList>
          {selectedContacts.length > 0 ? (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={styles.selectedItems}
                onPress={() => handleSelected()}
              >
                <Text style={styles.fabText}>
                  {selectedContacts.length}{" "}
                  <Icon
                    name="check-circle-o"
                    size={15}
                    color="white"
                    style={{ top: 10, right: 10 }}
                  />
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => sendSMS(address)}
                style={styles.fabSelected}
              >
                <Icon name="send-o" size={25} color={"white"} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.fab} disabled>
              <Icon name="send-o" size={25} color={"black"} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contactText: {
    fontSize: 15,
    margin: 10,
    paddingLeft: 10,
  },
  contactSelected: {
    backgroundColor: "#84DFFF",
  },
  searchBox: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    margin: 5,
    borderColor: "#F0ECE3",
    backgroundColor: "white",
    borderRadius: 10,
  },

  fabSelected: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#03A9F4",
    borderRadius: 30,
    elevation: 8,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#d3d3d3",
    borderRadius: 30,
    elevation: 8,
  },
  selectedItems: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    right: 90,
    bottom: 20,
    backgroundColor: "#84DFFF",
    borderRadius: 30,
  },
  fabText: {
    color: "white",
    padding: 10,

    fontSize: 15,
  },
});

export default ContactScreen;
