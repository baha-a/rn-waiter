import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import FAIcon from './FAIcon';

export default class Invoice extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => this.toggleSelected()}
                style={{ margin: 10, flex: 1, flexDirection: 'column', backgroundColor: '#eee', minHeight: 100 }}>
                {this.renderUpperPartOfInvoice()}
                {this.renderLowerPartOfInvoice()}
            </TouchableOpacity>
        )
    }

    toggleSelected() {
        if (this.props.isSelectionEnabeld && this.props.onSelected)
            this.props.onSelected(!this.props.isSelected);
    }

    renderUpperPartOfInvoice() {
        let {
            time,
            table,
            waiter,
            clients,
            isSelectionEnabeld
        } = this.props;

        return (<View style={{ flex: 0.8, flexDirection: 'row' }}>
            <View style={{ flex: 0.4, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 6, }}>
                <Text style={{ color: '#c7c7c7' }}>
                    <FAIcon name='clock' />
                    {time}
                </Text>
                <Text style={{ color: '#c7c7c7' }}>
                    <FAIcon name='hashtag' />
                    {table}
                </Text>
                <Text style={{ color: '#c7c7c7' }}>
                    <FAIcon name='male' />
                    {waiter}
                </Text>
            </View>
            <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                <Text style={{ color: 'black', fontSize: 36, }}>
                    <FAIcon name='utensils' />
                    {clients}
                </Text>
            </View>

            {
                isSelectionEnabeld && this.props.isSelected ?
                    <FAIcon name='check-circle' style={{ position: 'absolute', top: 4, right: 4, color: '#28a745' }} />
                    : null
            }
        </View>
        );
    }

    renderLowerPartOfInvoice() {
        let {
            pays,
            nextService,
            isSelectionEnabeld
        } = this.props;

        let overly = null;
        if (isSelectionEnabeld)
            overly = 'rgba(0,0,0,0.2)';

        return (
            <TouchableOpacity style={{ flex: 0.2, flexDirection: 'row' }}>
                <View style={{ flex: 0.3, backgroundColor: '#545b62', justifyContent: 'center', alignItems: 'center' }}>
                    <FAIcon style={{ color: '#fff', fontSize: 20 }} name='file-invoice-dollar' />
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

                {
                    isSelectionEnabeld &&
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', opacity: 0.4 }} />
                }

            </TouchableOpacity>);
    }
}
