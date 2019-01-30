import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export default class Selectable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false,
        };
        this.toggleSelection = this.toggleSelection.bind(this);
    }

    componentDidMount() {
        if (this.props.selected) {
            this.setState({ selected: true });
        }
    }

    toggleSelection() {
        let newSeleted = !this.state.selected;
        this.setState({ selected: newSeleted });
        if (this.props.onSelect) {
            this.props.onSelect(newSeleted);
        }
    }

    render() {
        let color = this.props.disabled == true
            ? { backgroundColor: 'rgba(0,0,0,0.2)' }
            : { backgroundColor: this.state.selected ? '#007bff' : '#fff' };

        return (
            <TouchableOpacity
                disabled={this.props.disabled == true}
                onPress={this.toggleSelection}
                style={{
                    margin: 4,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: this.state.selected ? '#007bff' : 'rgba(0, 0, 0, .125)',
                    ...color
                }}
            >
                <Text style={{ color: this.state.selected ? '#fff' : '#212121' }}> {this.props.title} </Text>
            </TouchableOpacity>
        )
    }
}
