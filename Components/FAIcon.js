import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class FAIcon extends Component {
    render() {
        let icon = this.mapNameWithCode(this.props.name);
        if (icon == null) {
            return null;
        }

        return (
            <Text style={{...this.props.style , fontFamily: icon.fontFamily }}>{icon.code}</Text>
        );
    }

    mapNameWithCode(name) {
        let icon = icons.find(x => x.name == name);
        if (icon == null)
            icon = { name: 'question-circle', code: 'f059', type: 'Solid' };

        return {
            code:
            
            '&#x' + icon.code + ';',
            fontFamily: 'FontAwesome' + icon.type
        };
    }
}




const icons = [
    { name: 'hashtag', code: 'f292', type: 'Solid' },
    { name: 'clock  ', code: 'f017', type: 'Solid' },
    { name: 'utensils', code: 'f2e7', type: 'Solid' },
    { name: 'male', code: 'f183', type: 'Solid' },
    { name: 'file-invoice-dollar', code: 'f571', type: 'Solid' },
    

    { name: 'hotjar', code: 'f3b1', type: 'Brands' },
];