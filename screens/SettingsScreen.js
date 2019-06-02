import React from 'react';
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
} from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import { AsyncStorage } from 'react-native';
import { CustomSwitch } from '../components/AllergySwitch';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json'
  };

  state = {
    allergies: {
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
    storage: '',
    allergieList: [
      'blotdyr',
      'egg',
      'fisk',
      'gluten',
      'melk',
      'notter',
      'peanotter',
      'selleri',
      'sennep',
      'sesamfrø',
      'skalldyr',
      'soya',
      'sulfitter',
      'svoveldioksid'
    ]
  };

  componentWillMount() {
    this.load();
  }

  load = async () => {
    try {
      const allergies = await AsyncStorage.getItem('allergies');

      if (allergies !== null) {
        const storedAllergies = JSON.parse(allergies);
        this.setState(prev => ({
          ...prev,
          allergies: storedAllergies
        }));
      }
    } catch (e) {
      console.error('Failed to load name.');
    }
  };

  storeData = () => {
    this.asyncStoreData();
    console.log('this');
  };

  getData = () => {
    this.asyncGetData();
    console.log('get');
  };

  asyncStoreData = async () => {
    try {
      await AsyncStorage.setItem(
        'allergies',
        JSON.stringify(this.state.allergies)
      );
    } catch (error) {
      // Error saving data
    }
  };

  asyncGetData = async () => {
    try {
      const value = await AsyncStorage.getItem('allergies');
      if (value !== null) {
        data = JSON.parse(value);
        console.log(data.gluten);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  handleChange = (key, value) => {
    this.setState(prev => ({
      ...prev,
      allergies: {
        ...prev.allergies,
        [key]: value
      }
    }));
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    // return <ExpoConfigView />;
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <Text>This is Noddi!</Text>
            {this.state.allergieList
              .slice(0)
              .reverse()
              .map((name, i) => (
                <CustomSwitch
                  key={i}
                  name={name}
                  value={this.state.allergies[name]}
                  handleChange={this.handleChange}
                />
              ))}
            <Button title={'Tap to save'} onPress={this.storeData} />
            <Text>
              Gluten state: {this.state.allergies.gluten ? 'Sant' : 'Usant'}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#82AD9A',
    flexDirection: 'row'
  },
  allergyText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    backgroundColor: 'red',
    lineHeight: 24,
    textAlign: 'center'
  }
});
