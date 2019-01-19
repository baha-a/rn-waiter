import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Button, View, Text, Accordion as Acc } from 'native-base';
import ItemButton from './ItemButton';
import FAIcon from './FAIcon';
import ItemPriceBar from './ItemPriceBar';
import Api from '../api';
import Loader from './Loader';
import TableMenu from './TableMenu';


export default class Accordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNewItem: 0,
      hotjarEnabled: [],


      sections: [
        // {
        //   id: 1, category_name: 'Main Dish', color: '#546e7a', content:
        //     [
        //       { id: 1, en_name: 'item1', price: 24, category: 1 },
        //       { id: 2, en_name: 'item2', price: 991, category: 1 },
        //       { id: 3, en_name: 'item3', price: 2, category: 1 }
        //     ]
        // },
        // { id: 2, category_name: 'Sandwich', color: '#6d4c41', content: [] },
        // { id: 3, category_name: 'Salad', color: '#7cb342', content: [] },
        // { id: 4, category_name: 'Drinks', color: '#fdd835', content: [] },
        // { id: 5, category_name: 'Sweet', color: '#e53935', content: [] },
      ],
      ready: false,

    }

    this._body = this._body.bind(this);
    this._head = this._head.bind(this);
    this.isHotjarEnabled = this.isHotjarEnabled.bind(this);
    this.addItemToMenu = this.addItemToMenu.bind(this);
  }


  componentDidMount() {
    Api.getCategories()
      .then(cat => {
        this.addIsBarProperty(cat);
        this.setState({ sections: cat, ready: true });
      });
  }

  addIsBarProperty(cats){
    if(cats == null)
      return;
    cats.forEach(c => {
      if(c.isBar || c.category_name.toLowerCase() == 'bar'){
        c.products.forEach(p => p.isBar = true);
        c.sub_categories.forEach(p => p.isBar = true);
        this.addIsBarProperty(c.sub_categories);
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    for (const key in this.state)
      if (nextState[key] != this.state[key])
        return true;
    return false;
  }


  _head(item) {
    let radius = item.id == 1 ? 4 : 0;
    let hotjarColor = this.isHotjarEnabled(item.id) ? '#fff' : 'rgba(0,0,0,0.2)';
    return (
      <View style={{
        backgroundColor: Api.mapCategoryWithColors(item.id),
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
          <Text style={{ color: '#fff' }}>{item.category_name}</Text>
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
    if (item.sub_categories && item.sub_categories.length > 0) {
      return <View style={{ padding: 10, }}>
        <Acc dataArray={item.sub_categories} renderHeader={this._head} renderContent={this._body} />
      </View>;
    }

    return (
      <View style={{
        padding: 10,
        borderColor: Api.mapCategoryWithColors(item.id),
        borderWidth: 1,
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}>

        {
          this.state.addNewItem == item.id && <ItemPriceBar onAdd={(name,price)=>{
            let sections = this.state.sections.slice();
            let section = sections.find(x=>x.id == item.id);
            section.products.push({id: Api.guid() ,en_name:name, price:price, isBar: section.isBar});
            this.setState({ addNewItem: 0, sections: sections });
          }} />
        }

        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          {
            item.products.map(x => <ItemButton key={x.id} title={x.en_name} category={item.id} price={x.price}
              onPressMid={() => this.addItemToMenu(x)} />)
          }
        </View>
      </View>
    );
  }

  addItemToMenu(x) {
    TableMenu.addItem(x);
  }

  render() {
    if (this.state.ready == false)
      return <Loader />
    return <Acc dataArray={this.state.sections} renderHeader={this._head} renderContent={this._body} />;
  }
}