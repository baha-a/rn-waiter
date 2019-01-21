import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import FAIcon from './FAIcon';
import { Actions } from 'react-native-router-flux';

export const ReloadBtn = ({ title = 'something went wrong', newProps }) =>
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems:'flex-start'}}>
        <Text style={{ justifyContent:'center', alignItems:'center'}}>
            {title}
        </Text>
        <TouchableOpacity
            style={{ backgroundColor: '#4090f0', padding: 4, margin: 4 }}
            onPress={() => Actions.refresh({key:Actions.currentScene , ...newProps})}
        >
            <Text style={{ color: '#fff' }}>
                <FAIcon name='redo' />
                refresh
            </Text>
        </TouchableOpacity>
    </View>
