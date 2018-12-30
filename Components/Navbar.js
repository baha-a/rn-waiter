import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Header, Body, Text, Left, Right, Icon, Button, Container, Content } from 'native-base';



export default class Navbar extends Component {
  render() {
    return (
      <Header noShadow={true} style={{ backgroundColor: '#323232' }} >
        <Content contentContainerStyle={{flex: 1, flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>

          <Left>
            <Button onPress={() => Actions.order()} transparent>
              <Text style={{ color: '#fff' }}> Order </Text>
            </Button>
          </Left>

          {/*
          <Body style={{ flex:1, justifyContent: 'center', alignItems: 'center'}} >
            <Title style={{ fontWeight: '60' }}>{this.props.title}</Title>
          </Body> */}

          <Right>
            <Button onPress={() => Actions.bill()} transparent>
              <Text style={{ color: '#fff' }}> Bill </Text>
            </Button>
          </Right>
        </Content>

      </Header>
    );
  }
}
