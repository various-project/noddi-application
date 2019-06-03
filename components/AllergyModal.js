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
  Button
} from 'react-native';
import { CustomSwitch } from './AllergySwitch';
import { Ionicons } from '@expo/vector-icons';

import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');

export class AllergyModal extends Component {
  state = {
    modalVisible: false
  };

  render() {
    return (
      <View style={{ marginTop: 22, backgroundColor: '#82AD9A' }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
          style={{ backgroundColor: '#82AD9A' }}
        >
          <ScrollView>
            <View
              style={{
                marginTop: 22,
                backgroundColor: '#82AD9A',
                padding: 30,
                minHeight: height,
                flex: 1,
                flexDirection: 'column'
              }}
            >
              <View>
                <Text style={styles.title}>Velg dine allergier</Text>
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
                        trackColor={{ false: '#fff', true: '#DBCFB0' }}
                      />
                    </View>
                  ))}
              </View>
              <Button
                onPress={() => {
                  this.props.setModalVisible(!this.props.modalVisible);
                }}
                title="Lagre"
                color="white"
              />
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
  }
});
