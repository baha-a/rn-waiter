import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'

export default class Collapsible extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        }
    }

    render() {

        let { style, children, title } = this.props;

        return (
            <View style={style}>
                <TouchableOpacity onPress={() => this.setState({ collapsed: !this.state.collapsed })} style={{ paddingLeft:10,}}>
                    <Text>{title}</Text>
                </TouchableOpacity>
                {
                    this.state.collapsed &&
                    <View style={{ marginTop:10}}>
                        {children}
                    </View>
                }
            </View>
        )
    }
}
