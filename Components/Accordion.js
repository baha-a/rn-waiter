import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Button, View, Text, Accordion as Acc } from 'native-base';
import ItemButton from './ItemButton';
import FAIcon from './FAIcon';
import ItemPriceBar from './ItemPriceBar';

const sections = [
  {
    id: 1, title: 'Main Dish', color: '#546e7a', content:
      [
        { id: 1, name: 'item1', price: 24 },
        { id: 2, name: 'item2', price: 991 },
        { id: 3, name: 'item3', price: 2 }
      ]
  },
  { id: 2, title: 'Sandwich', color: '#6d4c41', content: [] },
  { id: 3, title: 'Salad', color: '#7cb342', content: [] },
  { id: 4, title: 'Drinks', color: '#fdd835', content: [] },
  { id: 5, title: 'Sweet', color: '#e53935', content: [] },
];

export default class Accordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNewItem: 0,
      hotjarEnabled: [],
    }

    this._body = this._body.bind(this);
    this._head = this._head.bind(this);
    this.isHotjarEnabled = this.isHotjarEnabled.bind(this);
  }

  _head(item) {
    let radius = item.id == 1 ? 4 : 0;
    let hotjarColor = this.isHotjarEnabled(item.id) ? '#fff' : 'rgba(0,0,0,0.2)';
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
          <TouchableOpacity transparent style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: 2 }}
            onPress={() => {
              if (this.state.addNewItem == item.id)
                this.setState({ addNewItem: 0 });
              else
                this.setState({ addNewItem: item.id });
            }}
          >
            <Text style={{ color: '#fff' }}> Not listed ? </Text>
          </TouchableOpacity>
          <TouchableOpacity transparent style={{ marginHorizontal: 6 }} onPress={() => this.toggleHotjar(item.id)}>
            <FAIcon style={{ color: hotjarColor, fontSize: 20 }} name='hotjar' />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  isHotjarEnabled(id) {
    return this.state.hotjarEnabled.findIndex(x => x == id) != -1;
  }
  toggleHotjar(id) {
    let list = this.state.hotjarEnabled.slice();
    if (this.isHotjarEnabled(id))
      list = list.filter(x => x != id);
    else
      list.push(id);

    this.setState({ hotjarEnabled: list });
  }

  _body(item) {
    return (
      <View style={{
        padding: 10,
        borderColor: item.color,
        borderWidth: 1,
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}>

        {
          this.state.addNewItem == item.id && <ItemPriceBar />
        }
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          {
            item.content.map(x => <ItemButton key={x.id} title={x.name} color={item.color} price={x.price} />)
          }
        </View>
      </View>
    );
  }

  render() {
    return <Acc dataArray={sections} renderHeader={this._head} renderContent={this._body} />;
  }
}