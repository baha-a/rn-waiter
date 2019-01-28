import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';

export default class DiscountInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dolarOrPercent: '$',
            value: 0,
        };

        this.toggleInputType = this.toggleInputType.bind(this);
    }

    componentDidMount() {
        let { type = '$', value = 0 } = this.props;

        this.setState({
            dolarOrPercent: type,
            value: value
        });
    }

    toggleInputType() {
        let newType = this.state.dolarOrPercent == '$' ? '%' : '$';

        this.setState({ dolarOrPercent: newType });

        if (this.props.onTypeChange) {
            this.props.onTypeChange(newType);
        }
    }

    valueChange(x) {
        this.setState({ value: x });
        if (this.props.onValueChange)
            this.props.onValueChange(x);
    }

    render() {
        let style = { flexDirection: 'column', alignItems: 'stretch', padding: 6, borderColor: '#ddd', borderWidth: 1 };
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'stretch', margin: 4, }}>
                <TouchableOpacity onPress={this.toggleInputType}
                    style={[{ flex: 0.1, backgroundColor: '#ddd', justifyContent: 'center', }, style]}>
                    <Text style={{ alignItems: 'center', justifyContent: 'center' }}>{this.state.dolarOrPercent}</Text>
                </TouchableOpacity>
                <View style={[{ flex: 0.9, backgroundColor: '#fff', justifyContent: 'flex-start', }, style]}>
                    <TextInput
                        
                        placeholder={this.props.placeholder}
                        value={this.state.value + ''}
                        onChangeText={x => this.valueChange(x)}
                        keyboardType='numeric'
                        disableFullscreenUI underlineColorAndroid='rgba(0,0,0,0)'
                    />
                </View>
            </View>
        )
    }
}
