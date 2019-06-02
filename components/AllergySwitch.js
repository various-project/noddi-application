import React from 'react';
import { Text, Switch, View, StyleSheet, Platform } from 'react-native';
import { MonoText } from '../components/StyledText';

export class CustomSwitch extends React.Component {
  changeValue = value => {
    this.props.handleChange(this.props.name, value);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.allergyText}>{this.props.name}</Text>
        <Switch
          value={this.props.value}
          onValueChange={value =>
            this.props.handleChange(this.props.name, value)
          }
          style={styles.getStartedText}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  allergyText: {
    fontSize: 17,
    color: '#fff',
    lineHeight: 24,
    textAlign: 'center'
  }
});
