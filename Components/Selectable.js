 import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export default class Selectable extends Component {
    constructor(props) {
        super(props);
        this.toggleSelection = this.toggleSelection.bind(this);
    }

    toggleSelection() {
        if (this.props.onSelect) {
            this.props.onSelect(!this.props.selected);
        }
    }

    render() {
        let color = this.props.disabled == true
            ? { backgroundColor: 'rgba(0,0,0,0.2)' }
            : { backgroundColor: this.props.selected ? '#007bff' : '#fff' };

        return (
            <TouchableOpacity
                disabled={this.props.disabled == true}
                onPress={this.toggleSelection}
                style={{
                    margin: 4,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: this.props.selected ? '#007bff' : 'rgba(0, 0, 0, .125)',
                    ...color, 
                    ...this.props.style
                }}
            >
                <Text style={{ color: this.props.selected ? '#fff' : '#212121' }}> {this.props.title} </Text>
            </TouchableOpacity>
        )
    }
}
