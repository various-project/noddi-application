import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Icon } from 'expo';

import { BlurView } from 'expo';

const { width, height } = Dimensions.get('window');

export class AlertComponent extends React.Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.animatedValue2 = new Animated.Value(0);

    this.state = {
      noMatch: false,
      allergyMatch: false,
      imgUrl: require('../assets/images/noMatch.png'),
      ready: false
    };
  }

  componentDidMount() {
    this.setState({
      allergyMatch: this.props.allergyMatch,
      ready: this.props.ready,
      noMatch: this.props.noMatch
    });
    this.changeImage();
    this.runAnimation();
  }
  runAnimation() {
    Animated.timing(this.animatedValue2, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease
    }).start();
  }
  changeImage() {
    if (this.props.allergyMatch) {
      this.setState({ imgUrl: require('../assets/images/notSafe.png') });
    } else if (this.props.noMatch) {
      this.setState({ imgUrl: require('../assets/images/noMatch.png') });
    } else {
      this.setState({ imgUrl: require('../assets/images/checked.png') });
    }
  }

  renderComponent() {
    let innerText;
    if (this.state.allergyMatch) {
      innerText = (
        <View>
          <Text style={styles.title}>Ikke spis!</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
              {this.props.foodObject['navn']}
            </Text>{' '}
            inneholder allergenet:{' '}
            <Text
              style={{ fontWeight: 'bold', fontSize: 20, color: '#AD8282' }}
            >
              {this.props.allergyType}
            </Text>
          </Text>
        </View>
      );
    } else if (this.state.noMatch) {
      innerText = (
        <View>
          <Text style={styles.title}>Ingen treff!</Text>
          <Text style={styles.text}>
            Vi har dessverre ikke tilgang til produktet. Prøv igjen på et senere
            tidspunkt.
          </Text>
        </View>
      );
    } else {
      innerText = (
        <View>
          <Text style={styles.title}>Trygt produkt!</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
              {this.props.foodObject['navn']}
            </Text>{' '}
            inneholder ingen av dine registrerte allergier. Feil kan forekomme,
            så dobbeltsjekk.
          </Text>
        </View>
      );
    }
    return innerText;
  }

  render() {
    const { allergyMatch } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={this.props.triggerClosing}
        >
          <BlurView tint="dark" intensity={60} style={styles.absoluteFill}>
            <View style={styles.content}>
              <View style={styles.imageContainer}>
                <Animated.Image
                  style={{
                    height: width - 130,
                    width: width - 130,
                    opacity: this.animatedValue2
                  }}
                  resizeMode="cover"
                  source={this.state.imgUrl}
                />
              </View>
              <Animated.View
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'column',
                  width: '75%',
                  marginTop: '5%',
                  opacity: this.animatedValue2
                }}
              >
                {this.state.ready && this.renderComponent()}
              </Animated.View>
              <View style={styles.informationBox}>
                <Icon.MaterialIcons
                  size={26}
                  name={'touch-app'}
                  color={'#DFDFDF'}
                />
                <Text style={styles.informationText}>Trykk for å scanne</Text>
              </View>
            </View>
          </BlurView>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
    width: width,
    height: height
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  absoluteFill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white'
  },
  text: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    marginTop: '15%'
  },
  textBox: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    width: '75%',
    marginTop: '15%'
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 100
  },
  textInnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  informationBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10
  },
  informationText: {
    color: '#DFDFDF'
  }
});
