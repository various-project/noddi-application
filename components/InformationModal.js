import React, { Component } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
  Alert,
  StyleSheet,
  Switch,
  Button,
  Animated,
  AsyncStorage,
  Image,
  Platform
} from 'react-native';
import { CustomSwitch } from './AllergySwitch';
import { Ionicons } from '@expo/vector-icons';
import { PageIndicator } from './PageIndicator';
import { CloseIcon } from './CloseInformationModalIcon';

import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');

const Screen = props => {
  return (
    <View style={styles.scrollPage}>
      <Animated.View style={[styles.screen, transitionAnimation(props.index)]}>
        <Image style={{ width: 200, height: 200 }} source={props.image} />
        <Text style={styles.text}>{props.text}</Text>
        {props.last ? (
          Platform.OS == 'android' ? (
            <TouchableNativeFeedback
              onPress={() => this.setModalVisible(true)}
              background={TouchableNativeFeedback.Ripple()}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 35
                }}
              >
                <Text style={{ fontSize: 20, color: 'white' }}>
                  Legg til allergier
                </Text>
              </View>
            </TouchableNativeFeedback>
          ) : (
            <Button
              color="#000"
              title={'Klikk her for å komme igang'}
              onPress={() => props.setModalVisible(false)}
            />
          )
        ) : (
          <View />
        )}
      </Animated.View>
    </View>
  );
};

const xOffset = new Animated.Value(0);

const transitionAnimation = index => {
  return {
    transform: [
      { perspective: 800 },
      {
        scale: xOffset.interpolate({
          inputRange: [(index - 1) * width, index * width, (index + 1) * width],
          outputRange: [0.25, 1, 0.25]
        })
      },
      {
        rotateX: xOffset.interpolate({
          inputRange: [(index - 1) * width, index * width, (index + 1) * width],
          outputRange: ['45deg', '0deg', '45deg']
        })
      },
      {
        rotateY: xOffset.interpolate({
          inputRange: [(index - 1) * width, index * width, (index + 1) * width],
          outputRange: ['-45deg', '0deg', '45deg']
        })
      }
    ]
  };
};

export class InformationModal extends Component {
  state = {
    modalVisible: false,
    page: 1,
    offset: 0
  };

  componentWillMount() {
    this.load();
  }

  load = async () => {
    try {
      const modalState = await AsyncStorage.getItem('modalVisible');
      console.log('state' + modalState);
      if (modalState !== null) {
        const modalVisible = JSON.parse(modalState);
        console.log(modalVisible);
        this.setState(prev => ({
          ...prev,
          modalVisible: modalVisible
        }));
      } else {
        this.setModalVisible(true);
      }
    } catch (e) {
      console.error('Failed to load name.');
    }
  };

  asyncStoreData = async value => {
    try {
      await AsyncStorage.setItem('modalVisible', JSON.stringify(value));
    } catch (error) {
      // Error saving data
    }
  };

  handlePageChange = e => {
    var offset = e.nativeEvent.contentOffset;
    if (offset) {
      var page = offset.x / width;
      this.setState({ page: page, offset: xOffset });
    }
  };

  setModalVisible = value => {
    console.log('To early');
    this.setState(
      () => ({
        modalVisible: value
      }),
      () => {
        this.asyncStoreData(value);
      }
    );
  };

  closeModalOpenSetting = () => {
    this.setModalVisible(false);
    this.props.setSettingsVisible(true);
    console.log('this');
  };

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <CloseIcon setModalVisible={this.closeModalOpenSetting} />
          <Animated.ScrollView
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: xOffset } } }],

              {
                listener: event => this.handlePageChange(event)
              },
              { useNativeDriver: true }
            )}
            horizontal
            pagingEnabled
            style={styles.scrollView}
            showsHorizontalScrollIndicator={false}
          >
            <Screen
              text="Dette er noddi, din nye handlehjelp"
              index={0}
              image={require('./../assets/images/undraw_empty_cart.png')}
              last={false}
            />
            <Screen
              text="Velg dine allergier"
              index={1}
              image={require('./../assets/images/undraw_select.png')}
              last={false}
            />
            <Screen
              text="Få vite om du kan spise maten"
              index={2}
              image={require('./../assets/images/undraw_order_confirmed.png')}
              last={true}
              setModalVisible={this.closeModalOpenSetting}
            />
          </Animated.ScrollView>
          <PageIndicator page={this.state.page} offset={this.state.offset} />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  allergyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  allergyText: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    alignItems: 'center'
  },
  icon: {
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: '300',
    marginBottom: 15
  },
  scrollView: {
    flexDirection: 'row',
    backgroundColor: '#82AD9A'
  },
  scrollPage: {
    width: width,
    padding: 20
  },
  screen: {
    height: height - 140,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20
  },
  text: {
    fontSize: 35,
    fontWeight: '200',
    textAlign: 'center'
  }
});
