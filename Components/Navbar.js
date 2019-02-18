import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Header, Body, Text, Left, Right, Icon, Container, Content } from 'native-base';
import Touchable from './Touchable';


export default class Navbar extends Component {
  render() {
    return (
      <Header noShadow={true} style={{ backgroundColor: '#323232' }} >
        <Content contentContainerStyle={{flex: 1, flexDirection: 'row',justifyContent:'space-between', alignItems:'center'}}>
            <Touchable onPress={() => Actions.replace('order')} style={{ padding:10,}} background={Touchable.Ripple('#fff')}>
              <Text style={{ color: '#fff' }}> Order </Text>
            </Touchable>
            <Touchable onPress={() => Actions.replace('bill')} style={{ padding:10,}} background={Touchable.Ripple('#fff')}>
              <Text style={{ color: '#fff' }}> Bill </Text>
            </Touchable>
        </Content>
      </Header>
    );
  }
}
