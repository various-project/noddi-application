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
import { AllergyModal } from '../components/AllergyModal';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    header: null
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
    ],
    modalVisible: false
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
    this.setState(
      prev => ({
        ...prev,
        allergies: {
          ...prev.allergies,
          [key]: value
        }
      }),
      () => {
        this.asyncStoreData();
      }
    );
  };

  removeAllergy = key => {
    this.setState(
      prev => ({
        ...prev,
        allergies: {
          ...prev.allergies,
          [key]: false
        }
      }),
      () => {
        this.asyncStoreData();
      }
    );
  };

  addAllergy = key => {
    this.setState(
      prev => ({
        ...prev,
        allergies: {
          ...prev.allergies,
          [key]: true
        }
      }),
      () => {
        this.asyncStoreData();
      }
    );
  };

  getTrueAllergies = key => {
    return this.state.allergies[key];
  };

  getFalseAllergies = key => {
    return !this.state.allergies[key];
  };

  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    // return <ExpoConfigView />;
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.scrollView}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Dine</Text>
              <Text style={styles.title}>Allergier</Text>
            </View>
            {Object.keys(this.state.allergies)
              .slice(0)
              .reverse()
              .filter(this.getTrueAllergies)
              .map((name, i) => (
                <CustomSwitch
                  key={i}
                  name={name}
                  value={this.state.allergies[name]}
                  handleChange={this.handleChange}
                  removeAllergy={this.removeAllergy}
                />
              ))}
            <Button
              color="#fff"
              title={'Legg til allergier'}
              onPress={() => this.setModalVisible(true)}
            />
          </View>
          <AllergyModal
            modalVisible={this.state.modalVisible}
            setModalVisible={this.setModalVisible}
            allergies={this.state.allergies}
            handleChange={this.handleChange}
            removeAllergy={this.addAllergy}
            allergieList={this.state.allergieList}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#82AD9A'
  },
  allergyText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    backgroundColor: 'red',
    lineHeight: 24,
    textAlign: 'center'
  },
  titleContainer: {
    fontSize: 64,
    color: '#fff',
    textAlign: 'left',
    marginBottom: 20
  },
  title: {
    fontSize: 64,
    color: '#fff',
    textAlign: 'left',
    margin: 0,
    marginBottom: -10,
    padding: 0,
    fontWeight: '200'
  },
  scrollView: {
    padding: 30
  }
});
