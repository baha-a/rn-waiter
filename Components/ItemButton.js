import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

export default class ItemButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            nextId: 1,
        }

        this.removeUser = this.removeUser.bind(this);
        this.addUser = this.addUser.bind(this);
    }

    mapCategoryWithColors(cat) {
        switch (cat) {
            case 1: return '#546e7a';
            case 2: return '#6d4c41';
            case 3: return '#7cb342';
            case 4: return '#fdd835';
            case 5: return '#e53935';
        }
    }

    removeUser() {
        let users = this.state.users.slice();
        users.pop();
        this.setState({ users: users, nextId: this.state.nextId - 1 });
    }

    addUser() {
        let users = this.state.users.slice();
        users.push(this.state.nextId);
        this.setState({ users: users, nextId: this.state.nextId + 1 });
    }

    render() {
        let {
            category,
            title,
            add,
            remove,
            price,

            detials,
        } = this.props;

        if (title == 'itemD') {
            detials = ['No onion', 'No oil', 'Well done'];
        }

        let padding = 6, radius = 3;

        let color = this.mapCategoryWithColors(category);

        return (
            <View style={{ flexDirection: 'column', margin: 6, backgroundColor: color, borderRadius: radius }}>
                <View style={{ flexDirection: 'row' }}>
                    {
                        remove &&
                        <TouchableOpacity style={{
                            padding: padding,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            alignSelf: 'flex-start',
                            borderTopLeftRadius: radius,
                            borderBottomLeftRadius: radius,
                        }}
                            onPress={this.removeUser}
                        >
                            <Icon style={{ color: '#fff', fontWeight: 'bold' }} name='ios-remove' />
                        </TouchableOpacity>
                    }

                    <TouchableOpacity style={{
                        padding: padding,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{ color: '#fff' }}> {title} </Text>
                    </TouchableOpacity>

                    {
                        price &&
                        <TouchableOpacity style={{
                            padding: padding,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            alignSelf: 'flex-end',
                            borderTopRightRadius: radius,
                            borderBottomRightRadius: radius,
                        }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }} > {price}$ </Text>
                        </TouchableOpacity>
                    }

                    {
                        add &&
                        <TouchableOpacity style={{
                            padding: padding,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            alignSelf: 'flex-end',
                            borderTopRightRadius: radius,
                            borderBottomRightRadius: radius,
                        }}
                            onPress={this.addUser}
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
                    {this.state.users.map(x => <Text style={{ marginHorizontal: 2, padding: 2, color: '#fff', backgroundColor: '#3e3e3e' }} key={x}>{x}</Text>)}
                </View>

                {
                    detials &&
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        borderTopColor: 'rgba(0,0,0,0.1)',
                        borderTopWidth: 1,
                        paddingLeft: 4,
                    }}
                    >
                        {detials.map(x => <Text key={x} style={{ color: '#fff', marginVertical: 2, }}>-{x}</Text>)}
                    </View>
                }
            </View>
        )
    }
}