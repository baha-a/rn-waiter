import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import Api from '../api';


export default class ItemButton extends Component {
    constructor(props) {
        super(props);

        let { quantity = 1 } = props;
        
        this.state = {
            count: quantity,
        }

        this.removeItem = this.removeItem.bind(this);
        this.addItem = this.addItem.bind(this);

        this.pressMid = this.pressMid.bind(this);
    }


    componentDidMount() {
        this.setState({ count: this.props.count ? this.props.count : 1 });
    }

    pressMid() {
        if (this.props.onPressMid)
            this.props.onPressMid();
    }

    removeItem() {
        if (this.state.count > 1) {
            let v = this.state.count - 1;
            this.setState({ count: v });
            if (this.props.onAddOrRemove)
                this.props.onAddOrRemove(v);
        }
        else {
            if (this.props.onDelete) {
                this.props.onDelete();
            }
        }
    }

    addItem() {
        let v = this.state.count + 1;
        this.setState({ count: v });
        if (this.props.onAddOrRemove)
            this.props.onAddOrRemove(v);
    }

    render() {
        let {
            color,
            title,

            addAndRemove,

            price,

            details,

            clients = [],

            style = {}
        } = this.props;

        let padding = 6, radius = 3;

        return (
            <View style={[style, { flexDirection: 'column', margin: 6, backgroundColor: color, borderRadius: radius }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {
                        addAndRemove &&
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
                    }

                    <TouchableOpacity style={{
                        padding: padding,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                        onPress={this.pressMid}
                    >
                        {addAndRemove && <Text style={{ color: '#fff', fontWeight: 'bold' }}> {this.state.count} </Text>}

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
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }} > {price}$ </Text>
                        </TouchableOpacity>
                    }

                    {
                        addAndRemove &&
                        <TouchableOpacity style={{
                            padding: padding,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            borderTopRightRadius: radius,
                            borderBottomRightRadius: radius,
                        }}
                            onPress={this.addItem}
                        >
                            <Icon style={{ color: '#fff', fontWeight: 'bold' }} name='ios-add' />
                        </TouchableOpacity>
                    }


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
                    details &&
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
                }
            </View>
        )
    }
}