import React from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Constants, Permissions, BarCodeScanner } from 'expo';
import { db } from '../db/db';
import { AsyncStorage } from 'react-native';

import { AlertComponent } from '../components/AlertComponent';

import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default class ScanScreen extends React.Component {
  constructor(props) {
    super();
    this.updateLoading = this.updateLoading.bind(this);
  }
  static navigationOptions = {
    title: 'Scanner',
    header: null
  };

  state = {
    hasCameraPermission: null,
    scanned: false,

    noMatch: false,
    allergyMatch: false,
    loadingIsFinished: false,
    allergyType: '',
    userAllergies: {
      blotdyr: false,
      egg: false,
      fisk: false,
      gluten: false,
      melk: false,
      notter: false,
      peanotter: false,
      selleri: false,
      sennep: false,
      sesamfrø: false,
      skalldyr: false,
      soya: false,
      sulfitter: false,
      svoveldioksid: false
    },
    data: {}
  };

  componentWillMount() {
    this.load();
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      scanned: false,
      hasCameraPermission: status === 'granted'
    });
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
    await fetch('http://192.168.1.6/api/foods/' + data)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          data: responseJson
        });
      })
      .catch(error => console.log(error + 'Husk og oppdatere ip'));
  };
  updateLoading() {
    this.setState({ loadingIsFinished: false, scanned: false });
  }

  render() {
    const {
      hasCameraPermission,
      scanned,
      noMatch,
      data,
      loadingIsFinished,
      allergyMatch,
      allergyType
    } = this.state;
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
        {loadingIsFinished && (
          <AlertComponent
            triggerClosing={this.updateLoading}
            allergyMatch={allergyMatch}
            noMatch={noMatch}
            foodObject={data}
            ready={loadingIsFinished}
            allergyType={allergyType}
          />
        )}
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
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
      this.setState({ noMatch: true, allergyMatch: false });
    } else {
      let allergic = false;
      var allergyType = '';
      const productAllergies = data['allergies'];
      const userAllergies = this.state.userAllergies;
      const entries = Object.entries(productAllergies);
      for (const [allergen, boolean] of entries) {
        if (boolean) {
          if (userAllergies[allergen]) {
            allergic = true;
            allergyType = allergen;
          }
        }
      }
      if (allergic) {
        this.setState({ allergyMatch: true, allergyType: allergyType });
      } else {
        this.setState({ allergyMatch: false, noMatch: false });
      }
    }
    this.setState({ loadingIsFinished: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff'
  }
});
