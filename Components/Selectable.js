import React, { Component } from 'react'
import { Text, TouchableOpacity } from 'react-native'

export default class Selectable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false,
        };
        this.toggleSelection = this.toggleSelection.bind(this);
    }

    componentDidMount() {
        if (this.props.initialSelected) {
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
        let borderColor = this.state.selected ? '#007bff' : 'rgba(0, 0, 0, .125)';
        let titleColor = this.state.selected ? '#fff' : '#212121';
        let backgroundColor = this.state.selected ? '#007bff' : '#fff';

        return (
            <TouchableOpacity style={{ padding: 10, borderWidth: 1, borderColor: borderColor, backgroundColor: backgroundColor }}
                onPress={this.toggleSelection}>
                <Text style={{ color: titleColor }}> {this.props.title} </Text>
            </TouchableOpacity>
        )
    }
}
