import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
  TouchableOpacity
} from 'react-native';
import { BlurView } from 'expo';

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
    Animated.sequence([
      Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: 1000,
        delay: 1000,
        easing: Easing.ease
      }),
      Animated.timing(this.animatedValue2, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease
      })
    ]).start();
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
                    height: 250,
                    width: 250,
                    transform: [
                      {
                        scaleX: this.animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0.5]
                        })
                      },
                      {
                        scaleY: this.animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0.5]
                        })
                      }
                    ]
                  }}
                  resizeMode="cover"
                  source={this.state.imgUrl}
                />
              </View>
              <Animated.View
                style={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'column',
                  width: '75%',
                  marginTop: '15%',
                  opacity: this.animatedValue2
                }}
              >
                {this.state.ready && this.renderComponent()}
              </Animated.View>
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
    zIndex: 1
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    width: '75%',
    marginTop: '15%'
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10
  },
  textInnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
