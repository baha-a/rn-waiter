import React, { Component } from 'react'
import { Text, View, TouchableOpacity, TextInput } from 'react-native'

const Btn = ({ name, color = '#f0f0f0', onPress }) => (
    <TouchableOpacity style={{ flex: 1, backgroundColor: color, margin: 4, padding: 10 }} onPress={() => onPress()}>
        <Text style={{ textAlign: 'center' }}>{name}</Text>
    </TouchableOpacity>
);

export default class OptionPad extends Component {
    constructor(props) {
        super(props);

        let { value = 0 } = props;

        this.state = {
            value: value + '',
        };
    }

    onPress(value) {
        let v = (parseFloat(this.state.value) + value);
        v = (Math.round(v * 10) / 10.0);

        if (!this.props.validateValue || this.props.validateValue(v) == true) {
            if (this.props.onValueChange) {
                this.props.onValueChange(v);
            }
            this.setState({ value: v + '' });
        }
    }

    render() {
        let { unit, options } = this.props;

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <View style={{ flex: 0.7, flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Btn name={options[0] + unit} onPress={() => this.onPress(options[0])} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Btn name={options[1] + unit} onPress={() => this.onPress(options[1])} />
                        <Btn name={options[2] + unit} onPress={() => this.onPress(options[2])} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Btn name={options[3] + unit} onPress={() => this.onPress(options[3])} />
                        <Btn name={options[4] + unit} onPress={() => this.onPress(options[4])} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Btn name='Reset' color='#ffc107' onPress={() => this.setState({ value: 0 })} />
                    </View>
                </View>
                <View style={{ flex: 0.3, flexDirection: 'column', justifyContent: 'center' }}>
                    <TextInput
                        
                        style={{ flex: 1, textAlign: 'center', textAlignVertical: 'center', fontSize: 32, fontWeight: 'bold' }}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        disableFullscreenUI
                        keyboardType='numeric'
                        value={this.state.value + unit}
                        onChangeText={v => this.setState({ value: v.replace(unit, '') })}
                    />
                </View>
            </View>
        )
    }
}
