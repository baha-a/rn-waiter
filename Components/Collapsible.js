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
        let { style, children, title, headerStyle, titleColor = '#000' } = this.props;

        return (
            <View style={style}>
                <TouchableOpacity onPress={() => this.setState({ collapsed: !this.state.collapsed })}
                    style={{ paddingLeft: 10, ...headerStyle }}>
                    <Text lineBreakMode='tail' numberOfLines={1} style={{ color:titleColor }}>{title}</Text>
                </TouchableOpacity>
                {
                    this.state.collapsed &&
                    <View style={{}}>
                        {children}
                    </View>
                }
            </View>
        )
    }
}
