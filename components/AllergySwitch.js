import React from 'react';
import { Text, Switch, View, StyleSheet, Platform, Button } from 'react-native';
import { MonoText } from '../components/StyledText';
import { Ionicons } from '@expo/vector-icons';

export class CustomSwitch extends React.Component {
  changeValue = value => {
    this.props.handleChange(this.props.name, value);
  };

  handleClick = () => {
    console.log('Test');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.allergyText}>{this.props.name}</Text>
        <Ionicons
          name="ios-close"
          size={42}
          color="white"
          onPress={() => this.props.removeAllergy(this.props.name)}
          style={styles.icon}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    alignItems: 'center'
  },
  allergyText: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    alignItems: 'center'
  },
  icon: {
    justifyContent: 'center'
  }
});
