import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Animated,
  Easing
} from 'react-native';

const { width, height } = Dimensions.get('window');

export class Loader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          zIndex: 1,
          width: width,
          height: height - 40,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator size="large" color="#82AD9A" />
      </View>
    );
  }
}
//
