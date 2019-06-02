import React from 'react';
import { ScrollView, Text, View, StyleSheet, Button } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Constants, Permissions, BarCodeScanner } from 'expo';
import { db } from '../db/db';
import { AsyncStorage } from 'react-native';

export default class ScanScreen extends React.Component {
  static navigationOptions = {
    title: 'Scanner'
  };

  state = {
    hasCameraPermission: null,
    scanned: false,
    userAllergies: {
      lactose: false,
      gluten: false
    },
    data: {}
  };

  componentWillMount() {
    this.load();
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  load = async () => {
    try {
      const allergies = await AsyncStorage.getItem('allergies');

      if (allergies !== null) {
        const storedAllergies = JSON.parse(allergies);
        this.setState(prev => ({
          ...prev,
          userAllergies: storedAllergies
        }));
      }
    } catch (e) {
      console.error('Failed to load name.');
    }
  };

  getFood = async data => {
    await fetch('http://10.0.0.4/api/foods/' + data)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          data: responseJson
        });
      })
      .catch(error => console.log(error + 'Husk og oppdatere ip'));
  };

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
          justifyContent: 'flex-end'
        }}
      >
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
  handleBarCodeScanned = async ({ type, data }) => {
    this.setState({ scanned: true });
    const barCode = data;
    await this.getFood(barCode)
      .then(this.load())
      .then(() => this.matchAllergy(this.state.data));
  };

  matchAllergy = data => {
    if (data == null) {
      alert('No Match..');
    } else {
      let allergic = false;
      const productAllergies = data['allergies'];
      const userAllergies = this.state.userAllergies;
      const entries = Object.entries(productAllergies);
      for (const [allergen, boolean] of entries) {
        if (boolean) {
          if (userAllergies[allergen]) {
            allergic = true;
          }
        }
      }
      if (allergic) {
        alert('Buhu you are allergic to ' + data['navn']);
      } else {
        alert('This is safe to eat');
      }
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff'
  }
});
