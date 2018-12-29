import React, {Component} from 'react';
import { Grid, Col, Content, View, Icon } from 'native-base';
import Product from './Product';
import Text from './Text';

export default class ProductList extends Component{
  render() {  
    let items = this.props.items;

    if(items == null || items.length == 0) {
      return ( <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {
                  this.props.emptyListIcon == null || this.props.emptyListIcon == '' ? null:
                  <Icon name={this.props.emptyListIcon} size={38} style={{fontSize: 38, color: '#95a5a6', marginBottom: 7}} />
                }
                {
                  this.props.emptyListText == null || this.props.emptyListText == '' ? null:
                  <Text style={{color: '#95a5a6'}}>{this.props.emptyListText}</Text>
                }
            </View>);
    }

    let res = [];
    for(var i=0; i < items.length; i+=2 ) {
        res.push(
          <Grid key={i}>
            <Product key={items[i].id} product={items[i]} />
            { items[i+1] ? <Product key={items[i+1].id} product={items[i+1]} isRight /> : <Col key={i+1} /> }
          </Grid>
        );
    }
    
    return (
        <Content padder>
            {res}
        </Content>
    );
  }
}