// React native and others libraries imports
import React, { Component } from 'react';
import { Image } from "react-native-expo-image-cache";
import { View, Col, Card, CardItem, Body, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';

// Our custom files and classes import
import Text from './Text';


export default class product extends Component {
  render() {
    return(
      <Col style={this.props.isRight ? styles.leftMargin : styles.rightMargin}>
        <Card transparent>
            <CardItem cardBody style={styles.border}>
              <Button transparent style={styles.button} onPress={() => this.pressed()}>
                <Image style={styles.image} uri={this.props.product.image } />
              </Button>
            </CardItem>
            <CardItem style={{marginTop: 1}}>
              <Button style={{flex: 1, paddingLeft: 0, paddingRight: 0, paddingBottom: 0, paddingTop: 1}}
                transparent
                onPress={() => this.pressed()}
              >
                <Body>
                    <Text style={{fontSize: 12}} numberOfLines={1}>
                      {this.props.product.title}
                    </Text>
                    <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                      <View style={styles.line} />
                      <Text style={styles.price}>{this.props.product.price}</Text>
                      <View style={styles.line} />
                    </View>
                </Body>
              </Button>
            </CardItem>
          </Card>
      </Col>
    );
  }

  pressed() {
    Actions.product({product: this.props.product});
  }
}

const styles = {
  button: {flex: 1, height: 250},
  image: {height: 250, width: null, flex: 1},
  leftMargin: {
    marginLeft: 7,
    marginRight: 0,
    marginBottom: 7
  },
  rightMargin: {
    marginLeft: 0,
    marginRight: 7,
    marginBottom: 7
  },
  border: {
    borderWidth: 0.5,
    borderColor: '#E0E0E0'
  },
  price: {
    fontSize: 14,
    paddingLeft: 5,
    paddingRight: 5,
    zIndex: 1000,
    backgroundColor: '#fdfdfd'
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    position: 'absolute',
    top: '52%'
  }
}
