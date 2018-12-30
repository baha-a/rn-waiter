import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Container } from 'native-base';
import Navbar from '../Components/Navbar';

export default class Bill extends Component {
  render() {
    return (
      <Container>
        <Navbar />

      <View>
        <Text> Bill page </Text>
      </View>
      </Container>
    )
  }
}
