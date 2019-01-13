import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Api from '../api';

export default class CustomizeItem extends Component {
  constructor(props){
    super(props);
    this.state={
      options:[]
    };
  }
  componentDidMount(){
    Api.getCustomizes(this.props.id)
    .then(x=> this.setState({ options: x}));
  }
  render() {
    return (
      <View>
        <Text>{this.props.item.en_name}</Text>
        {
          this.state.options.map(x=> <Text key={x.id}>{x.custom_name}</Text>)
        }
      </View>
    )
  }
}
