import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Switch
} from "react-native";
import { ExpoConfigView } from "@expo/samples";
import { AsyncStorage } from "react-native";

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: "app.json"
  };

  state = {
    allergies: {
      lactose: false,
      gluten: false
    },
    storage: ""
  };

  componentWillMount() {
    this.load();
  }

  load = async () => {
    try {
      const allergies = await AsyncStorage.getItem("allergies");

      if (allergies !== null) {
        const storedAllergies = JSON.parse(allergies);
        this.setState(prev => ({
          ...prev,
          allergies: storedAllergies
        }));
      }
    } catch (e) {
      console.error("Failed to load name.");
    }
  };

  storeData = () => {
    this.asyncStoreData();
    console.log("this");
  };

  getData = () => {
    this.asyncGetData();
    console.log("get");
  };

  asyncStoreData = async () => {
    try {
      await AsyncStorage.setItem(
        "allergies",
        JSON.stringify(this.state.allergies)
      );
    } catch (error) {
      // Error saving data
    }
  };

  asyncGetData = async () => {
    try {
      const value = await AsyncStorage.getItem("allergies");
      if (value !== null) {
        data = JSON.parse(value);
        console.log(data.gluten);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  handleChange(key, value) {
    console.log(value);
    this.setState(prev => ({
      ...prev,
      allergies: {
        ...prev.allergies,
        [key]: value
      }
    }));
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    // return <ExpoConfigView />;
    return (
      <View>
        <ScrollView>
          <View>
            <Text>This is Noddi!</Text>

            <Text>
              An application for analysing allergen's in food and drink.
            </Text>
            <Text>Lactose</Text>
            <Switch
              onValueChange={value => this.handleChange("lactose", value)}
              value={this.state.allergies.lactose}
            />

            <Text>Gluten</Text>
            <Switch
              onValueChange={value => this.handleChange("gluten", value)}
              value={this.state.allergies.gluten}
            />

            <Button title={"Tap to save"} onPress={this.storeData} />
            <Button title={"Tap to save"} onPress={this.getData} />
            <Text>
              Lactose state: {this.state.allergies.lactose ? "Sant" : "Usant"}
            </Text>
            <Text>
              Gluten state: {this.state.allergies.gluten ? "Sant" : "Usant"}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
