import React from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Modal,
  Platform,
  Image,
  Dimensions
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Constants, Permissions, BarCodeScanner } from 'expo';
import { db } from '../db/db';
import { AsyncStorage } from 'react-native';

import { AlertComponent } from '../components/AlertComponent';
import SettingsScreen from './SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import { InformationModal } from '../components/InformationModal';
import { Icon } from 'expo';

import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const { width, height } = Dimensions.get('window');

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
    settingsVisible: false,
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
    await fetch('http://10.0.0.4/api/foods/' + data)
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

  setSettingsVisible = value => {
    this.setState(() => ({
      settingsVisible: value
    }));
  };

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
        <View style={styles.iconContainer}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
            size={42}
            color="white"
            onPress={() => this.setSettingsVisible(true)}
            style={styles.icon}
          />
        </View>
        {!this.state.scanned && (
          <Image
            style={{
              width: 310,
              height: 218,
              zIndex: 2,
              top: height / 2 - 109,
              justifyContent: 'center',
              position: 'absolute',
              right: width / 2 - 155
            }}
            source={require('./../assets/images/barcode_area.png')}
          />
        )}

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

        <Modal
          animationType="slide"
          // transparent={true}
          visible={this.state.settingsVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <SettingsScreen setSettingsVisible={this.setSettingsVisible} />
        </Modal>
        {!this.state.scanned && (
          <View style={styles.informationBox}>
            <Icon.MaterialCommunityIcons
              size={26}
              name={'barcode-scan'}
              color={'#DFDFDF'}
            />
            <Text style={styles.informationText}>
              Plasser strekkoden i område for å scanne
            </Text>
          </View>
        )}

        <InformationModal />
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
  },
  iconContainer: {
    flex: 1,
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 2
  },
  informationBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30
  },
  informationText: {
    color: '#DFDFDF'
  }
});
