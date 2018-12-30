import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import Navbar from '../Components/Navbar';
import { Container, Icon } from 'native-base';
import Accordion from '../Components/Accordion';
import ItemButton from '../Components/ItemButton';

clinets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export default class Order extends Component {
  render() {
    return (
      <Container>
        <Navbar />
        <View style={{ flex: 1, backgroundColor: '#eee', flexDirection: 'row', }}>

          <View style={{ flex: 5 }}>
            <ScrollView
              horizontal
              alwaysBounceHorizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0.05 }}
            >
              {
                clinets.map(x =>
                  <TouchableOpacity key={x} style={{
                    backgroundColor: '#323232',
                    margin: 10,
                    marginHorizontal: 4,
                    padding: 10,
                    borderRadius: 4,
                    maxHeight: 40
                  }}>

                    <Text style={{ color: '#fff' }}> #{x} </Text>
                  </TouchableOpacity>
                )
              }
            </ScrollView>
            <View style={{ flex: 0.95 }}>
              <Accordion />
            </View>
          </View>

          <View style={{ flex: 3, padding: 10}}>
            <ItemButton title='test button' color='magenta' add remove />
          </View>
        </View>
      </Container>
    )
  }
}
