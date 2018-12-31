import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Button, View, Text, Accordion as Acc } from 'native-base';
import ItemButton from './ItemButton';
import FAIcon from './FAIcon';

const sections = [{
  id: 1, title: 'Main Dish', color: '#546e7a', content:[{ name:'item1',price:24}, {name:'item2', price:991},{name:'item3',price:2}]
}, {
  id: 2, title: 'Sandwich', color: '#6d4c41', content:[]
}, {
  id: 3, title: 'Salad', color: '#7cb342', content:[]
}, {
  id: 4, title: 'Drinks', color: '#fdd835', content:[]
}, {
  id: 5, title: 'Sweet', color: '#e53935', content:[]
},
];

export default class Accordion extends Component {
  constructor(props) {
    super(props);
  }

  _head(item) {
    let radius = item.key == 1 ? 4 : 0;
    return (
      <View style={{
        backgroundColor: item.color,
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
          <Text style={{ color: '#fff' }}>{item.title}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button transparent style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: 2 }}>
            <Text style={{ color: '#fff' }}> Not listed ?</Text>
          </Button>
          <Button transparent>
            <FAIcon style={{ color: '#fff', fontSize: 20 }} name='hotjar' />
          </Button>
        </View>
      </View>
    );
  }

  _body(item) {
    return (
      <View style={{
        padding: 10,
        borderColor: item.color,
        borderWidth: 1,
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap:'wrap' 
        }}>
          {
            item.content.map(x=> <ItemButton key={x.id} title={x.name} color={item.color} price={x.price} />)
          }
      </View>
    );
  }

  render() {
    return <Acc dataArray={sections} renderHeader={this._head} renderContent={this._body} />;
  }
}