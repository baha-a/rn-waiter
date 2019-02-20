import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import Api from '../api';
import FAIcon from './FAIcon';


export default class ItemButton extends Component {
    constructor(props) {
        super(props);

        this.removeItem = this.removeItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.pressMid = this.pressMid.bind(this);
    }

    pressMid() {
        if (this.props.onPressMid)
            this.props.onPressMid();
    }

    removeItem() {
        let v = this.props.quantity - 1;

        if (this.props.onAddOrRemove)
            this.props.onAddOrRemove(v, -1);

        if (v <= 0 && this.props.onDelete)
            this.props.onDelete();
    }

    addItem() {
        if (this.props.onAddOrRemove)
            this.props.onAddOrRemove(this.props.quantity + 1, +1);
    }

    render() {
        let {
            color,
            title,

            showCount,
            quantity,

            price,

            details,

            clients = [],

            style = {},

            isSelected = false,

            onRecall = null,
        } = this.props;

        let addAndRemove = this.props.onAddOrRemove ? true : false;

        let padding = 6, radius = 3;

        let overlyOpacity = {};
        if (isSelected) {
            overlyOpacity = { backgroundColor: 'rgba(255,255,255,0.5)' };
        }

        return (
            <View onLayout={this.props.onLayout} style={[style, { margin: 6, backgroundColor: color, borderRadius: radius }]}>
                <View style={overlyOpacity}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {
                            addAndRemove ?
                                <TouchableOpacity style={{
                                    padding: padding,
                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                    borderTopLeftRadius: radius,
                                    borderBottomLeftRadius: radius,
                                }}
                                    onPress={this.removeItem}
                                >
                                    <Icon style={{ color: '#fff', fontWeight: 'bold' }} name='ios-remove' />
                                </TouchableOpacity>
                                : null
                        }

                        <TouchableOpacity style={{
                            padding: padding,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                            onPress={this.pressMid}
                        >
                            {
                                (addAndRemove || showCount) ?
                                    <Text style={{ color: '#fff' }}>
                                        {quantity == -1 ? <FAIcon name='infinity' /> : <Text style={{ fontWeight: 'bold' }}>{quantity}</Text>}
                                    </Text>
                                    : null
                            }
                            <Text numberOfLines={1} lineBreakMode='tail' style={{ color: '#fff' }}> {title} </Text>
                        </TouchableOpacity>

                        {
                            price &&
                            <TouchableOpacity style={{
                                padding: padding,
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                borderTopRightRadius: radius,
                                borderBottomRightRadius: radius,
                            }}
                                onPress={this.pressMid}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }} > {price}$ </Text>
                            </TouchableOpacity>
                        }

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', borderTopRightRadius: radius, borderBottomRightRadius: radius, }}>
                            {
                                addAndRemove ?
                                    <TouchableOpacity style={{ padding: padding, backgroundColor: 'rgba(0,0,0,0.1)' }}
                                        onPress={this.addItem}>
                                        <Icon style={{ color: '#fff', fontWeight: 'bold' }} name='ios-add' />
                                    </TouchableOpacity>
                                    : null
                            }

                            {
                                onRecall ?
                                    <TouchableOpacity style={{ padding: padding, backgroundColor: 'rgba(0,0,0,0.1)' }}
                                        onPress={onRecall}>
                                        <FAIcon style={{ color: '#fff' }} name='redo' />
                                    </TouchableOpacity>
                                    : null
                            }
                        </View>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        flexWrap: 'wrap',
                        borderTopColor: 'rgba(0,0,0,0.1)',
                        borderTopWidth: 1,
                    }}>
                        {clients.map(x => <Text style={{ marginHorizontal: 2, padding: 2, color: '#fff', backgroundColor: '#3e3e3e' }} key={x}>{x}</Text>)}
                    </View>

                    {
                        details ?
                            <View style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                borderTopColor: 'rgba(0,0,0,0.1)',
                                borderTopWidth: 1,
                                paddingLeft: 4,
                            }}
                            >
                                {details.map(x => <Text key={x} style={{ color: '#fff', marginVertical: 2, }}>-{x}</Text>)}
                            </View>
                            : null
                    }
                </View>
            </View>
        )
    }
}