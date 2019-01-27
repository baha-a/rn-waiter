import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Input, Button } from 'native-base';

export default class Socket extends React.Component {
    constructor() {
        super();

        this.state = { message: '' };
        this.socket = new WebSocket('wss://echo.websocket.org/');
    }


    componentDidMount() {
        this.socket.onopen = () => { };
        this.socket.onmessage = ({ data }) => alert('websocket msg:' + data);
    }

    render() {
        return (
            <View style={{ padding:4, flexDirection: 'row', justifyContent: 'space-between',
             alignItems: 'center', backgroundColor: '#F5FCFF' }}>
                <Button title='send' onPress={() => this.socket.send(this.state.message)}>
                    <Text>Send</Text>
                </Button>
                <Input  placeholder='message to echo' onChangeText={(t) => this.setState({ message: t })} />
            </View>
        );
    }
}