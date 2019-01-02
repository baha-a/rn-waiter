import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity } from 'react-native'

export default ItemPriceBar = ({firstInputTitle='Name', secandInputTitle = 'Price',buttonTitle='Order'  }) =>
    <View style={{ margin: 6, flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'stretch' }}>
        <TextInput style={style} disableFullscreenUI underlineColorAndroid='#fff' placeholder={firstInputTitle} />
        <TextInput style={style} disableFullscreenUI underlineColorAndroid='#fff' placeholder={secandInputTitle} />
        <TouchableOpacity style={[style, { borderWidth: 0, backgroundColor: '#e2e6ea', marginRight: 0, justifyContent: 'center', alignItems: 'center' }]}>
            <Text> {buttonTitle} </Text>
        </TouchableOpacity>
    </View>

const style = { flex: 1, paddingLeft: 2, marginRight: 4, borderRadius: 3, borderWidth: 1, borderColor: '#ced4da' };
