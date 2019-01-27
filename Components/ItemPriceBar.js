import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity } from 'react-native'

export default class ItemPriceBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text1: '',
            text2: '',
        };
    }
    render() {
        let {
            firstInputTitle = 'Name',
            secandInputTitle = 'Price',
            buttonTitle = 'Order',
            onAdd = null
        } = this.props;

        return (<View style={{ margin: 6, flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'stretch' }}>
            <TextInput
                
                style={style} disableFullscreenUI underlineColorAndroid='#fff' placeholder={firstInputTitle}
                onChangeText={value => this.setState({ text1: value })}
                value={this.state.text1}
            />
            <TextInput
                
                style={style} disableFullscreenUI underlineColorAndroid='#fff' placeholder={secandInputTitle} keyboardType='numeric'
                onChangeText={value => this.setState({ text2: value })}
                value={this.state.text2}
            />
            <TouchableOpacity style={[style, { borderWidth: 0, backgroundColor: '#e2e6ea', marginRight: 0, justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => onAdd && onAdd(this.state.text1, this.state.text2)}>
                <Text> {buttonTitle} </Text>
            </TouchableOpacity>
        </View>);
    }
}

const style = { flex: 1, paddingLeft: 2, marginRight: 4, borderRadius: 3, borderWidth: 1, borderColor: '#ced4da' };
