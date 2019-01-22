import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Button, View, Text, Accordion as Acc } from 'native-base';
import ItemButton from './ItemButton';
import FAIcon from './FAIcon';
import ItemPriceBar from './ItemPriceBar';
import Api from '../api';
import Loader from './Loader';
import TableMenu from './TableMenu';
import ReloadBtn from './ReloadBtn';

export default class Accordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNewItem: 0,
      hotjarEnabled: [],

      sections: [],

      ready: false,
      error:false,
    }

    this._body = this._body.bind(this);
    this._head = this._head.bind(this);
    this.isHotjarEnabled = this.isHotjarEnabled.bind(this);
    this.addItemToMenu = this.addItemToMenu.bind(this);
  }


  componentDidMount() {
    this.fetchData();
  }

  fetchData(){
    Api.getCategories()
    .then(cat => {
      this.addIsBarProperty(cat);
      this.addCategoryNumberToProducts(cat);
      this.setState({ sections: cat, ready: true, error: false });
    }).then(() => {

      Api.getTasting()
        .then(tast =>
          this.setState({
            sections: [
              ...this.state.sections,
              { id: -1, category_name: 'tasting', isTasting: true, products: this.addIsTastingProperty(tast) }
            ]
          })
        );
    })
    .catch(x=> this.setState({ ready:true, error:true}));
  }

  addIsTastingProperty(tasts) {
    tasts.forEach(t => t.isTasting = true);
    return tasts;
  }

  addIsBarProperty(cats) {
    if (cats == null){
      return;
    }

    cats.forEach(c => {
      if (c.isBar || c.category_name.toLowerCase() == 'bar') {
        let products = [];
        c.sub_categories.forEach(s => {
          s.isBar = true;
          products = [...products, ...s.products];
        });
        c.sub_categories = [];
        c.products = products;
        c.products.forEach(p => p.isBar = true);
        //this.addIsBarProperty(c.sub_categories);
      }
    });
  }

  addCategoryNumberToProducts(cats) {
    if (cats == null)
      return;
    cats.forEach(c => {
      c.products.forEach(p => p.category_id = c.id);
      this.addCategoryNumberToProducts(c.sub_categories);
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
          this.state.addNewItem == item.id && <ItemPriceBar onAdd={(name, price) => {
            let sections = this.state.sections.slice();
            let section = sections.find(x => x.id == item.id);
            section.products.push({ id: Api.guid(), en_name: name, price: price, isBar: section.isBar });
            this.setState({ addNewItem: 0, sections: sections });
          }} />
        }

        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          {this.renderProductsOfCategory(item)}
        </View>
      </View>
    );
  }

  renderProductsOfCategory(item) {
    if (item.isTasting){
      return item.products.map(x => <ItemButton style={{width:'42%'}} key={x.id} title={x.tasting_name} color={x.color} price={x.price} onPressMid={() => this.addItemToMenu(x)} />);
    }
    if(item.isBar){
      return item.products.map(x => <ItemButton style={{width:'42%'}} key={x.id} title={x.en_name} category={item.id} onPressMid={() => this.addItemToMenu(x)} />);
    }
    return item.products.map(x => <ItemButton style={{width:'42%'}} key={x.id} title={x.en_name} category={item.id} price={x.price} onPressMid={() => this.addItemToMenu(x)} />);
  }

  addItemToMenu(x) {
    TableMenu.addItem(x);
  }

  render() {
    if (this.state.ready == false)
      return <Loader />
    if(this.state.error)
      return <ReloadBtn onReload={()=> { this.setState({ ready:false}); this.fetchData();}} />
    return <Acc dataArray={this.state.sections} renderHeader={this._head} renderContent={this._body} />;
  }
}