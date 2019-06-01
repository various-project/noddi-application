import React from 'react';
import { ScrollView, Text, View, StyleSheet, Button } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Constants, Permissions, BarCodeScanner } from 'expo';
import {db} from '../db/db';

export default class ScanScreen extends React.Component {
  static navigationOptions = {
    title: 'Scanner',
  };

  state = {
    hasCameraPermission: null,
    scanned: false,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  getFood = (data) => {
    const ref = db.ref('foods');
    let match = false;

    ref.once("value", function(snapshot) {
      snapshot.forEach(function (childSnap) {
        if(childSnap.key.toString() === data.toString()){
          const foodName = childSnap.child("navn").val()
          alert("Woho" + foodName + "matched");
          match = true;
        }
      })
      if (!match) {
        alert("No Match")
      }
    })
  }

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
        <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        {scanned && (
          <Button
            title={'Tap to Scan Again'}
            onPress={() => this.setState({ scanned: false })}
          />
        )}
      </View>
    );
  }
  handleBarCodeScanned = ({ type, data }) => {
   this.setState({ scanned: true });
   const barCode = "0" + data;
   this.getFood(barCode);
   //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
 };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
