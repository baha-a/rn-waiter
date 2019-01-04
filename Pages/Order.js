import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import Navbar from '../Components/Navbar';
import { Container, Icon } from 'native-base';
import Accordion from '../Components/Accordion';
import ItemButton from '../Components/ItemButton';
import ItemPriceBar from '../Components/ItemPriceBar';
import Collapsible from '../Components/Collapsible';
import TableMenu from '../Components/TableMenu';
import Socket from '../Socket';

clinets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export default class Order extends Component {
  render() {
    return (
      <Container>
        <Navbar />
        <View style={{ flex: 1, backgroundColor: '#eee', flexDirection: 'row', }}>
          <View style={{ flex: 0.6 }} >
            <ScrollView>
              <ScrollView
                horizontal
                alwaysBounceHorizontal
                showsHorizontalScrollIndicator={false}
              >
                {
                  clinets.map(x =>
                    <TouchableOpacity key={x} style={{
                      backgroundColor: '#323232',
                      margin: 10,
                      marginHorizontal: 4,
                      padding: 10,
                      paddingHorizontal:20,
                      borderRadius: 4,
                      maxHeight: 40
                    }}>

                      <Text style={{ color: '#fff' }}> #{x} </Text>
                    </TouchableOpacity>
                  )
                }
              </ScrollView>
              <View style={{ marginLeft: 6 }}>
                <Accordion />
              </View>
              <View>
                <Collapsible title='Custom Dish' style={{
                  backgroundColor:'#fff',
                  borderWidth:2,
                  borderColor:'#ccc',
                  marginVertical:10,
                  marginLeft:6,
                  padding:10
                  }}
                >
                  <ItemPriceBar secandInputTitle='Budget' buttonTitle='Add' />
                </Collapsible>
              </View>

            <View>
              <Socket />
            </View>
            </ScrollView>

          </View>
          <View style={{ flex: 0.4, padding: 10 }}>
            <TableMenu />
          </View>
        </View>
      </Container>
    )
  }
}
