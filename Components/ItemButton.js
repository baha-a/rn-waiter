import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

export default class ItemButton extends Component {
    render() {
        let {
             color, 
             title, 
             add, 
             remove,
             price,

             detials
            } = this.props;

        let padding = 10;

        return (
            <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                margin: 10,
                minHeight: 40,
                maxHeight: 60,
                minWidth:150,
            }}>
                <View style={{
                    backgroundColor: color,
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderRadius: 6,
                    minHeight: 40,
                }}>

                    {
                        remove &&
                        <TouchableOpacity style={{
                            padding: padding,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            alignContent: 'center',
                            alignSelf: 'center',
                            borderTopLeftRadius: 6,
                            borderBottomLeftRadius: 6,
                        }}>
                            <Icon style={{ color: '#fff', fontWeight: 'bold' }} name='ios-remove' />
                        </TouchableOpacity>
                    }

                    <TouchableOpacity style={{
                        padding: padding, alignSelf: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center', flex: 1
                    }}>
                        <Text style={{ color: '#fff' }}> {title} </Text>
                    </TouchableOpacity>

                    {
                        (add || price ) &&
                        <TouchableOpacity style={{
                            padding: padding,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            alignContent: 'center',
                            alignSelf: 'center',
                            borderTopRightRadius: 6,
                            borderBottomRightRadius: 6,
                        }}>
                            {
                                add ? <Icon style={{ color: '#fff', fontWeight: 'bold' }} name='ios-add' />
                                : <Text style={{ color: '#fff', fontWeight: 'bold' }} > {price}$ </Text>
                            }
                        </TouchableOpacity>
                    }
                    

                </View>

                {
                    detials &&
                    <View style={{ flex:1, backgroundColor: color,}}>
                        {detials.map(x=> <Text key={x}>{x}</Text>)}
                    </View>
                }
            </View>
        )
    }
}
