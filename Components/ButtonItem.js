import React, { Component } from 'react'
import { Text, View , TouchableHighlight} from 'react-native'

export default class ButtonItem extends Component {
  render() {
    return (
      <View style={{  flexDirection:'row'}}>
        <View style={{ flex: 1 }}>

        </View>
        <View style={{ flex: 4 }}>
                <TouchableHighlight>
                
                </TouchableHighlight>
        </View>
        <View style={{ flex: 1 }}>

        </View>
      </View>
    )
  }
}
