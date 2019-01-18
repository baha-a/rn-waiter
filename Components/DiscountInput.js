import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';

const percent = 'percent';
const dolar = 'dolar';

export default class DiscountInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dolarOrPercent: dolar,
            value: 0,
        };

        this.toggleInputType = this.toggleInputType.bind(this);
    }

    componentDidMount() {
        let {
            type,
            value
        } = this.props;
        if (!value)
            value = '';
        this.setState({
            dolarOrPercent: type,
            value: value
        });
    }

    toggleInputType() {
        if (this.state.dolarOrPercent == dolar) {
            this.setState({ dolarOrPercent: percent });
        } else {
            this.setState({ dolarOrPercent: dolar });
        }
    }

    render() {
        let style = { flexDirection: 'column', alignItems: 'stretch', padding: 6, borderColor: '#ddd', borderWidth: 1 };
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', margin: 4, }}>
                <TouchableOpacity onPress={this.toggleInputType}
                    style={[{ flex: 0.1, backgroundColor: '#ddd', justifyContent: 'center', }, style]}>
                    <Text style={{ alignItems:'center', justifyContent:'center'}}>{this.state.dolarOrPercent == dolar ? '$' : '%'}</Text>
                </TouchableOpacity>
                <View style={[{ flex: 0.9, backgroundColor: '#fff', justifyContent: 'flex-start', }, style]}>
                    <TextInput placeholder={this.props.placeholder}
                        value={this.state.value + ''}
                        onChangeText={x => this.setState({ value: x })}
                        keyboardType='numeric'
                        disableFullscreenUI underlineColorAndroid='rgba(0,0,0,0)'
                    />
                </View>
            </View>
        )
    }
}
