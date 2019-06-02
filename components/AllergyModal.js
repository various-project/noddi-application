import React, { Component } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
  Alert,
  StyleSheet,
  Switch
} from 'react-native';
import { CustomSwitch } from './AllergySwitch';
import { Ionicons } from '@expo/vector-icons';

export class AllergyModal extends Component {
  state = {
    modalVisible: false
  };

  render() {
    return (
      <View style={{ marginTop: 22, backgroundColor: '#82AD9A' }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
          style={{ backgroundColor: '#82AD9A' }}
        >
          <ScrollView>
            <View
              style={{ marginTop: 22, backgroundColor: '#82AD9A', padding: 30 }}
            >
              <View>
                <Text>Hello World!</Text>
                {this.props.allergieList
                  .slice(0)
                  .reverse()
                  .map((name, i) => (
                    <View key={i} style={styles.allergyContainer}>
                      <Text style={styles.allergyText}>{name}</Text>
                      <Switch
                        onValueChange={value =>
                          this.props.handleChange(name, value)
                        }
                        value={this.props.allergies[name]}
                      />
                    </View>
                  ))}
                <TouchableHighlight
                  onPress={() => {
                    this.props.setModalVisible(!this.props.modalVisible);
                  }}
                >
                  <Text>Hide Modal</Text>
                </TouchableHighlight>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  allergyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
