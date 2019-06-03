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
  Animated
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
        <Text style={styles.text}>{props.text}</Text>
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
    modalVisible: true,
    page: 1,
    offset: 0
  };

  handlePageChange = e => {
    var offset = e.nativeEvent.contentOffset;
    if (offset) {
      var page = offset.x / width;
      this.setState({ page: page, offset: xOffset });
    }
  };

  setModalVisible = value => {
    this.setState({
      modalVisible: value
    });
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
          <CloseIcon setModalVisible={this.setModalVisible} />
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
            <Screen text="Screen 1" index={0} />
            <Screen text="Screen 2" index={1} />
            <Screen text="Screen 3" index={2} />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  text: {
    fontSize: 45,
    fontWeight: 'bold'
  }
});
