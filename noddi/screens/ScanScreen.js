import React from 'react';
import { ScrollView, Text, View, StyleSheet, Button } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Constants, Permissions, BarCodeScanner } from 'expo';
import {db} from '../db/db';
import { AsyncStorage } from "react-native";

export default class ScanScreen extends React.Component {
  static navigationOptions = {
    title: 'Scanner',
  };

  state = {
    hasCameraPermission: null,
    scanned: false,
    userAllergies: {
      lactose: false,
      gluten: false,
    }
  };

  componentWillMount() {
    this.load()
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  load = async () => {
    try {
      const allergies = await AsyncStorage.getItem('allergies')

      if (allergies !== null) {
        const storedAllergies = JSON.parse(allergies)
        this.setState(prev => ({
          ...prev,
          userAllergies: storedAllergies,
        }))
      }
    } catch (e) {
      console.error('Failed to load name.')
    }
  }

  asyncGetData = async () => {
    try {
      const value = await AsyncStorage.getItem('allergies');
      if (value !== null) {
        data = JSON.parse(value)
        console.log(data.gluten);
        return data;
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  matchAllergies = (allergies) => {
    const userAllergies = this.state.userAllergies;
    const productAllergies = allergies;
    const keys = Object.keys(productAllergies)
    for (const key of keys) {
      console.log(key)
    }

  }

  getFood = (data) => {
    const ref = db.ref('foods');
    let match = false;
    let productAllergies = {};
    let foodName = "";
    const userAllergies = this.state.userAllergies;

    ref.once("value", function(snapshot) {
      snapshot.forEach(function (childSnap) {
        if(childSnap.key.toString() === data.toString()){
          foodName = childSnap.child("navn").val()
          console.log(childSnap.child("allergies").val().lactose);
          productAllergies = childSnap.child("allergies").val();
          match = true;
        }
      })
      if (match) {
        console.log("match");
        //this.matchAllergies(allergies);
        let allergic = false;
        const entries = Object.entries(productAllergies)
        for (const [allergen, boolean] of entries) {
          if (boolean) {
            console.log("This have " + allergen);
            console.log("User is allergic: " + userAllergies[allergen]);
            if (userAllergies[allergen]) {
              allergic = true;
            }
          }
        }
        if (allergic) {
          alert("Buhu you are allergic to " + foodName);
        }else {
          alert("This is safe to eat")
        }
      } else {
        alert("No Match")
      }
    })

  }

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
        <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        {scanned && (
          <Button
            title={'Tap to Scan Again'}
            onPress={() => this.setState({ scanned: false })}
          />
        )}
      </View>
    );
  }
  handleBarCodeScanned = ({ type, data }) => {
   this.setState({ scanned: true });
   const barCode = "0" + data;
   this.getFood(barCode);
   //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
 };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
