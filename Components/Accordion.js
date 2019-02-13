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
import Collapsible from './Collapsible';
import SubCat from './SubCat';

export default class Accordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNewItem: 0,
      hotjarEnabled: [],

      sections: [],

      ready: false,
      error: false,
    }

    this._body = this._body.bind(this);
    this._head = this._head.bind(this);
    this.isHotjarEnabled = this.isHotjarEnabled.bind(this);
    this.addItemToMenu = this.addItemToMenu.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.setState({ ready: false, error: false });

    let promises = [
      Api.getCategories()
        .then(sections => {
          console.log('getCategories ok');
          this.addIsBarProperty(sections);
          this.addCategoryInfoIntoProducts(sections);
          this.setState(state => ({ sections: [...sections, ...state.sections] }));
        })
      ,
      Api.getTasting()
        .then(tast =>{
          console.log('getTasting ok');
          this.setState(state => {
            let tastingSection = {
              id: -1,
              category_color: '#64206f',
              category_name: 'Tasting',
              isTasting: true,
              products: this.addIsTastingProperty(tast)
            };
            return { sections: [...state.sections, tastingSection] }
          });
        })
    ]

    Promise.all(promises)
      .then(() => this.setState({ ready: true, error: false }))
      .catch(x => {
        this.setState({ ready: true, error: true });
        alert('Categories\n' + (x.message || 'error'));
      });
  }

  addIsTastingProperty(tasts) {
    if (!tasts)
      tasts = [];

    tasts.forEach(t => t.isTasting = true);
    return tasts;
  }

  addIsBarProperty(cats) {
    if (!cats)
      return;

    cats.forEach(c => {
      if (c.isBar || c.category_name.toLowerCase() == 'bar') {
        c.isBar = true;

        c.products.forEach(p => p.isBar = true);
        c.sub_categories.forEach(p => {
          p.isBar = true;
          p.isSub = true;
        });
        this.addIsBarProperty(c.sub_categories);
      }
    });
  }

  // getAllProductsFroSubCat(cat) {
  //   if (!cat) return [];

  //   let products = [...cat.products];
  //   products.forEach(p => p.category_color = cat.category_color);
  //   cat.sub_categories.forEach(c => {
  //     products = [...products, ...this.getAllProductsFroSubCat(c)];
  //   });
  //   return products;
  // }

  addCategoryInfoIntoProducts(cats) {
    if (cats == null)
      return;
    cats.forEach(c => {
      c.products.forEach(p => {
        p.category_color = c.category_color;
      });
      this.addCategoryInfoIntoProducts(c.sub_categories);
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
    let isSub = item.isSub;

    return (
      <View style={{
        backgroundColor: item.category_color,
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
          <Text style={{ color: '#fff' }}>{item.category_name}</Text>
        </View>
        {
          !isSub &&
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
        }
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


  renderSub(sub) {
    return <View style={{ padding: 4, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
      {
        sub.map(x => <Collapsible
          key={x.id}
          title={x.category_name}
          style={{ width: '44%', margin: 4 }}
          headerStyle={{ backgroundColor: x.category_color, padding: 10 }}
          titleColor='#fff'
        >
          {this._body(x)}
        </Collapsible>)
      }
    </View>;
  }

  _body(item) {
    if (item.sub_categories && item.sub_categories.length > 0) {
      return <SubCat cat={item.sub_categories} renderItems={(items) => this.renderProductsOfCategory(items)} />
    }

    return (
      <View style={{
        padding: 10,
        borderColor: item.category_color,
        borderWidth: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}>

        {
          this.state.addNewItem == item.id && <ItemPriceBar onAdd={(name, price) => {
            let sections = this.state.sections.slice();
            let section = sections.find(x => x.id == item.id);
            section.products.push({
              id: Api.guid(),
              en_name: name,
              price: price,
              isBar: section.isBar,
              category_color: section.category_color,
            });
            this.setState({ addNewItem: 0, sections: sections });
          }} />
        }

        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          {this.renderProductsOfCategory(item.products, item.isTasting)}
        </View>
      </View >
    );
  }

  renderProductsOfCategory(products, isTasting) {
    if (!products || products.length == 0) {
      return null;
    }

    if (isTasting) {
      return products.map(x => <ItemButton
        style={{ width: '42%' }}
        key={x.id}
        title={x.tasting_name || x.en_name}
        color={x.color || x.category_color}
        price={x.price}
        onPressMid={() => this.addItemToMenu(x)}
      />)
    }

    return products.map(x => <ItemButton
      style={{ width: '42%' }}
      key={x.id}
      title={x.en_name}
      color={x.category_color || x.color}
      price={x.price}
      quantity={x.limit_quantity || -1}
      showCount
      onPressMid={() => this.addItemToMenu(x)}
    />)
  }

  addItemToMenu(x) {
    TableMenu.addItem(x);
  }

  render() {
    if (this.state.ready == false) {
      return <Loader />;
    }

    if (this.state.error || !this.state.sections || this.state.sections.length == 0) {
      return <ReloadBtn onReload={() => this.fetchData()} />;
    }

    return <Acc dataArray={this.state.sections} renderHeader={this._head} renderContent={this._body} />;
  }
}