import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Icon } from 'native-base';

export default class Invoice extends Component {
    render() {

        let {
            time,
            table,
            waiter,
            clients,
            pays,
            nextService,
        } = this.props;

        return (
            <View style={{ margin: 10, flex: 1, flexDirection: 'column', backgroundColor: '#eee', minHeight: 100 }}>
                <View style={{ flex: 0.8, flexDirection: 'row' }}>
                    <View style={{ flex: 0.3, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ color: '#c7c7c7' }}>
                            <Text style={{ fontFamily: 'FontAwesomeSolid' }}>&#xf017;</Text>
                            {time}
                        </Text>
                        <Text style={{ color: '#c7c7c7' }}>
                            <Text style={{ fontFamily: 'FontAwesomeSolid' }}>&#xf292;</Text>
                            {table}
                        </Text>
                        <Text style={{ color: '#c7c7c7' }}>
                            <Text style={{ fontFamily: 'FontAwesomeSolid' }}>&#xf183;</Text>
                            {waiter}
                        </Text>
                    </View>
                    <View style={{ flex: 0.7, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ color: 'black', fontSize: 40, fontWeight: '600' }}>
                            <Text style={{ fontFamily: 'FontAwesomeSolid' }}>&#xf2e7;</Text>
                            {clients}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={{ flex: 0.2, flexDirection: 'row' }}>
                    <View style={{ flex: 0.3, backgroundColor: '#545b62', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontFamily: 'FontAwesomeSolid', fontSize: 20 }}>&#xf571;</Text>
                    </View>
                    {
                        nextService != null ?
                            (<View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center', backgroundColor: '#bd2130' }}>
                                <Text style={{ color: '#fff' }} >call service #{nextService}</Text>
                            </View>)
                            : (<View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e7e34' }}>
                                <Text style={{ color: '#fff' }} >Pay {pays}$</Text>
                            </View>)

                    }
                </TouchableOpacity>
            </View>
        )
    }
}
