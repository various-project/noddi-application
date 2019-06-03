import React from 'react';
import { Icon } from 'expo';
import { Text, View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';

export class CloseIcon extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Ionicons
          name="ios-close"
          size={42}
          color="white"
          onPress={() => this.props.setModalVisible(false)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#82AD9A',
    alignItems: 'flex-end',
    paddingTop: 20,
    paddingRight: 20,
    marginBottom: 0
  }
});
