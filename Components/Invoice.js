import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import FAIcon from './FAIcon';
import { Actions } from 'react-native-router-flux';

function parseDate(date) {
    date = String(date).split(' ');
    //var days = String(date[0]).split('-');
    var hours = String(date[1]).split(':');
    return hours[0] + ':' + hours[1];
    //return [parseInt(days[0]), parseInt(days[1])-1, parseInt(days[2]), parseInt(hours[0]), parseInt(hours[1]), parseInt(hours[2])];
}

export default class Invoice extends Component {
    render() {
        return (
            <View style={{ ...this.props.style, margin: 10, backgroundColor: '#eee' }}>
                {this.renderUpperPartOfInvoice()}
                {this.renderLowerPartOfInvoice()}
            </View>
        )
    }

    toggleSelected() {
        if (this.props.onSelected) {
            this.props.onSelected(!this.props.isSelected);
        }
    }


    renderUpperPartOfInvoice() {
        let {
            created_at,
            table_number,
            waiter,
        } = this.props.info;

        return (
            <TouchableOpacity
                style={{ flex: 0.8, flexDirection: 'row' }}
                onPress={() => this.toggleSelected()}
            >
                <View style={{ flex: 0.4, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 6, }}>
                    <Text style={{ color: '#c7c7c7' }}>
                        <FAIcon name='clock' />
                        {parseDate(created_at.date)}
                    </Text>
                    <Text style={{ color: '#c7c7c7' }}>
                        <FAIcon name='hashtag' />
                        {table_number}
                    </Text>
                    <Text style={{ color: '#c7c7c7' }}>
                        <FAIcon name='male' />
                        {waiter}
                    </Text>
                </View>
                <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{ color: 'black', fontSize: 30, }}>
                        <FAIcon name='utensils' />
                        {table_number}
                    </Text>
                </View>
                {
                    this.props.isSelected ?
                        <FAIcon name='check-circle' style={{ position: 'absolute', top: 4, right: 4, color: '#28a745' }} />
                        : null
                }
            </TouchableOpacity>
        );
    }


    callService(serviceNumber) {
        // call the service 'serviceNumber'
    }

    renderLowerPartOfInvoice() {
        let {
            pays,
            services,
        } = this.props.info;

        let nextService = null;
        if (services) {
            services.forEach(s => {
                if (s.service_status == 'ToBeCall') {
                    nextService = s;
                    return;
                }
            });
        }

        return (
            <View style={{ flex: 0.2, flexDirection: 'row' }}>
                <TouchableOpacity style={{ flex: 0.3, backgroundColor: '#545b62', justifyContent: 'center', alignItems: 'center' }}>
                    <FAIcon style={{ color: '#fff', fontSize: 20 }} name='file-invoice-dollar' />
                </TouchableOpacity>
                {
                    nextService != null ?
                        (<TouchableOpacity style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center', backgroundColor: '#bd2130' }}
                            onPress={() => this.callService(nextService.service_number)}
                        >
                            <Text numberOfLines={1} lineBreakMode='middle' style={{ color: '#fff' }} >call service #{nextService.service_number}</Text>
                        </TouchableOpacity>)
                        : (
                            <TouchableOpacity style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e7e34' }}
                                onPress={() => Actions.billInfo({ id: 1 })}
                            >
                                <Text style={{ color: '#fff' }} >Pay {pays}$</Text>
                            </TouchableOpacity>)

                }
            </View>);
    }
}
