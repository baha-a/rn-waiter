import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class FAIcon extends Component {
    render() {
        switch (this.props.name) {
            case 'hotjar':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeBrands' }}>&#xf3b1;</Text>;

            case 'hashtag':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf292;</Text>;
            case 'clock':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf017;</Text>;
            case 'male':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf183;</Text>;
            case 'file-invoice-dollar':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf571;</Text>;
            case 'utensils':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf2e7;</Text>;
            case 'check-circle':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf058;</Text>;

            case 'bars':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf0c9;</Text>;
            case 'street-view':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf21d;</Text>;
            case 'sticky-note':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf249;</Text>;
            case 'hand-rock':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf255;</Text>;
            case 'plus':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf067;</Text>;

            default:
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf059;</Text>;
        }
    }
}