import React from 'react';
import { Text, View, Animated, Dimensions, PanResponder, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const images = [
  { id: 1, url: require('./assets/image1.jpg') },
  { id: 2, url: require('./assets/image2.jpg') },
  { id: 3, url: require('./assets/image3.jpg') },
  { id: 4, url: require('./assets/image4.jpg') },
  { id: 5, url: require('./assets/image5.jpg') }
]

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class App extends React.Component {

  constructor() {

    super();

    this.state = {
      currentIndex: 0
    }

    this.position = new Animated.ValueXY();

    this.imageRotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    });

    this.nextImageOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['1', '0', '1'],
      extrapolate: 'clamp'
    });

    this.nextImageScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.5, 1],
      extrapolate: 'clamp'
    });

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['0', '0', '1'],
      extrapolate: 'clamp'
    });

    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['1', '0', '0'],
      extrapolate: 'clamp'
    });

    this.imageRotateAndTranslate = {
      transform: [{
        rotate: this.imageRotate
      },
      ...this.position.getTranslateTransform()
      ]
    }

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (ev, gestureState) => true,
      onPanResponderMove: (ev, gestureState) => {

        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (ev, gestureState) => {

        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 200, y: gestureState.dy }
          }).start(() => {
            this.setState({
              currentIndex: this.state.currentIndex + 1
            }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          });
        }
        else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 200, y: gestureState.dy }
          }).start(() => {
            this.setState({
              currentIndex: this.state.currentIndex + 1
            }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          });
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 }
          }).start();
        }
      }
    })
  }

  likeImage = () => {
    Animated.timing(this.position, {
      toValue: { x: SCREEN_WIDTH + 200, y: 0 },
      duration: 500
    }).start(() => {
      this.setState({
        currentIndex: this.state.currentIndex + 1
      }, () => {
        this.position.setValue({ x: 0, y: 0 })
      })
    });
  }

  dislikeImage = () => {
    Animated.timing(this.position, {
      toValue: { x: -SCREEN_WIDTH - 200, y: 0 },
      duration: 500
    }).start(() => {
      this.setState({
        currentIndex: this.state.currentIndex + 1
      }, () => {
        this.position.setValue({ x: 0, y: 0 })
      })
    });
  }

  renderImages = () => {

    return images.map((item, i) => {

      if (i < this.state.currentIndex)
        return null;
      else if (i === this.state.currentIndex) {
        return (
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[this.imageRotateAndTranslate,
            {
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT - 140,
              padding: 15,
              position: 'absolute',
            }]}
            key={item.id}>

            <Animated.View
              style={{
                position: 'absolute',
                top: 40,
                left: 40,
                zIndex: 999,
                opacity: this.likeOpacity,
                transform: [{
                  rotate: '-20deg'
                }]
              }}
            >
              <Text style={{ fontSize: 24, color: 'lightgreen' }}>LIKE</Text>
            </Animated.View>

            <Animated.View
              style={{
                position: 'absolute',
                top: 40,
                right: 40,
                zIndex: 999,
                opacity: this.dislikeOpacity,
                transform: [{
                  rotate: '20deg'
                }]
              }}
            >
              <Text style={{ fontSize: 24, color: 'red' }}>DISLIKE</Text>
            </Animated.View>

            <Image
              style={{
                flex: 1,
                width: null,
                height: null,
                resizeMode: 'cover',
                borderRadius: 15
              }}
              source={item.url} />

          </Animated.View>
        )
      }
      else {
        return (
          <Animated.View
            style={
              {
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT - 140,
                padding: 15,
                position: 'absolute',
                opacity: this.nextImageOpacity,
                transform: [{
                  scale: this.nextImageScale
                }]
              }}
            key={item.id}>

            <Image
              style={{
                flex: 1,
                width: null,
                height: null,
                resizeMode: 'cover',
                borderRadius: 15
              }}
              source={item.url} />

          </Animated.View>
        )
      }


    }).reverse();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 60 }} />
        <View style={{ flex: 1 }}>
          {this.renderImages()}
        </View>
        <View style={{
          height: 80,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <TouchableOpacity
            onPress={this.likeImage}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'lightgreen',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Ionicons name='ios-thumbs-up' size={24} color='#fff' />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.dislikeImage}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'red',
              marginLeft: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Ionicons name='ios-thumbs-down' size={24} color='#fff' />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
