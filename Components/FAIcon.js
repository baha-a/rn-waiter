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
            case 'minus':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf068;</Text>;
            case 'dollar-sign':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf155;</Text>;
            case 'cc-visa':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeBrands' }}>&#xf1f0;</Text>;
            case 'cc-mastercard':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeBrands' }}>&#xf1f1;</Text>;
            case 'cc-amex':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeBrands' }}>&#xf1f3;</Text>;
            case 'credit-card':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf09d;</Text>;

            case 'redo':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf01e;</Text>;
            case 'undo':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf0e2;</Text>;
            case 'share-alt':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf1e0;</Text>;

            case 'concierge-bell':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf562;</Text>;

            case 'percent':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf295;</Text>;

            case 'infinity':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf534;</Text>;

            case 'arrow-left':
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf060;</Text>;

            default:
                return <Text style={{ ...this.props.style, fontFamily: 'FontAwesomeSolid' }}>&#xf059;</Text>;
        }
    }
}