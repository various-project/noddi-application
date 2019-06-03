import React from 'react';
import { Icon } from 'expo';
import { Text, View, StyleSheet, Animated, Dimensions } from 'react-native';

import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

export class PageIndicator extends React.Component {
  render() {
    let position = Animated.divide(this.props.offset, width);

    return (
      <View style={styles.container}>
        {[1, 2, 3].map((_, i) => {
          // console.log(this.props.page);

          let opacity = position.interpolate({
            inputRange: [i - 1, i, i + 1], // each dot will need to have an opacity of 1 when position is equal to their index (i)
            outputRange: [0.3, 1, 0.3], // when position is not i, the opacity of the dot will animate to 0.3
            extrapolate: 'clamp' // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.3)
          });

          return (
            <Animated.View // we will animate the opacity of the dots later, so use Animated.View instead of View here
              key={i} // we will use i for the key because no two (or more) elements in an array will have the same index
              style={{
                opacity,
                height: 10,
                width: 10,
                backgroundColor: '#DBCFB0',
                margin: 8,
                borderRadius: 5
              }}
            />
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#82AD9A',
    height: 40
  },

  scrollView: {
    flexDirection: 'row',
    backgroundColor: '#82AD9A'
  },
  text: {
    fontSize: 45,
    fontWeight: 'bold'
  }
});
