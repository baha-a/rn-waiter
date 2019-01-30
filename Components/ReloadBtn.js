import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import FAIcon from './FAIcon';
import { Actions } from 'react-native-router-flux';

export default ReloadBtn = ({ title = 'something went wrong', onReload }) =>
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems:'flex-start'}}>
        <Text style={{ textAlignVertical:'center', paddingHorizontal:10}}>
            {title}
        </Text>
        <TouchableOpacity
            style={{ backgroundColor: '#4090f0', padding: 4, margin: 4 }}
            onPress={() => onReload()}
        >
            <Text style={{ color: '#fff' }}>
                <FAIcon name='redo' />
                refresh
            </Text>
        </TouchableOpacity>
    </View>
