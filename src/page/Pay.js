// React native and others libraries imports
import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { Container, Left, Right, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';

// Our custom files and classes import
import Navbar from '../component/Navbar';
import SideMenuDrawer from '../component/SideMenuDrawer';
import Api from '../ApiClient';
import Loader from '../component/Loader';
import ProductList from '../component/ProductList';

export default class Category extends Component {
  constructor(props) {
      super(props);
      this.state = {
        items: [],
        isReady:false,
      };
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(async () => {
      let products = Api.mapProductValues((await Api.getProductsByCategory(this.props.id)));
      this.setState({items: products, isReady:true});
    });
  }

  render() {
    var left = (
      <Left style={{flex:1}}>
        <Button onPress={() => this._sideMenuDrawer.open()} transparent>
          <Icon name='ios-menu-outline' />
        </Button>
      </Left>
    );
    var right = (
      <Right style={{flex:1}}>
        <Button onPress={() => Actions.search()} transparent>
          <Icon name='ios-search-outline' />
        </Button>
        <Button onPress={() => Actions.cart()} transparent>
          <Icon name='ios-cart' />
        </Button>
      </Right>
    );

    return(
      <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
          <Container style={{backgroundColor: '#fdfdfd'}}>
            <Navbar left={left} right={right} title={this.props.title} />
            {
              this.state.isReady == false ? <Loader /> : 
              <ProductList items={this.state.items} emptyListIcon='ios-list' emptyListText={this.props.title} />
            }
          </Container>
      </SideMenuDrawer>
    );
  }
}
