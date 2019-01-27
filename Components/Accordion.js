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
    Api.getCategories()
      .then(cat => {
        this.addIsBarProperty(cat);
        this.addCategoryInfoIntoProducts(cat);
        this.setState({ sections: cat, ready: true, error: false });
      }).then(() => {

        Api.getTasting()
          .then(tast =>
            this.setState(state => {
              if (state == null) { return { sections: [{ id: -1, category_color: '#64206f', category_name: 'tasting', isTasting: true, products: this.addIsTastingProperty(tast) }] } }
              return { sections: [...state.sections, { id: -1, category_color: '#64206f', category_name: 'tasting', isTasting: true, products: this.addIsTastingProperty(tast) }] }
            }
            )).catch(x => { });
      })
      .catch(x => {
        console.log(x);
        this.setState({ ready: true, error: true });
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
        // c.products = this.getAllProductsFroSubCat(c);
        // c.sub_categories = [];
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

  _body(item) {
    if (item.sub_categories && item.sub_categories.length > 0) {
      return <View style={{ padding: 10, }}>
        <Acc style={{ margin:6 }} dataArray={item.sub_categories} renderHeader={this._head} renderContent={this._body} />
      </View>;
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
          {this.renderProductsOfCategory(item)}
        </View>
      </View>
    );
  }

  renderProductsOfCategory(item) {
    if (item.isTasting) {
      return item.products.map(x => <ItemButton
        style={{ width: '42%' }}
        key={x.id}
        title={x.tasting_name}
        color={x.color}
        price={x.price}
        onPressMid={() => this.addItemToMenu(x)}
      />);
    }

    if (item.isBar) {
      return item.products.map(x => <ItemButton
        style={{ width: '42%' }}
        key={x.id}
        title={x.en_name}
        color={x.category_color}
        onPressMid={() => this.addItemToMenu(x)}
      />);
    }

    return item.products.map(x => <ItemButton
      style={{ width: '42%' }}
      key={x.id}
      title={x.en_name}
      color={x.category_color}
      price={x.price}
      quantity={x.limit_quantity || -1}
      showCount
      onPressMid={() => this.addItemToMenu(x)}
    />);
  }

  addItemToMenu(x) {
    TableMenu.addItem(x);
  }

  render() {
    if (this.state.ready == false) {
      return <Loader />;
    }

    if (this.state.error || !this.state.sections || this.state.sections.length == 0) {
      return <ReloadBtn title='no categories' onReload={() => { this.setState({ ready: false, error: false }); this.fetchData(); }} />;
    }

    return <Acc dataArray={this.state.sections} renderHeader={this._head} renderContent={this._body} />;
  }
}