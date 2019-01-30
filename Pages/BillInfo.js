import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Navbar from '../Components/Navbar';
import { Container, Input } from 'native-base';
import FAIcon from '../Components/FAIcon';


const ButtonInput = ({ icon, text, placeholder, onPress, onChangeText }) => {
    return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', }}>
            <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'flex-start', borderWidth: 1, borderColor: '#ced4da', backgroundColor: '#e9ecef' }} >
                <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
                    {icon ? <FAIcon name={icon} /> : <Text> {text} </Text>}
                </TouchableOpacity>
            </View>
            <View style={{ flex: 0.8, flexDirection: 'row', justifyContent: 'flex-start', borderWidth: 1, borderColor: '#ced4da' }}>
                <TextInput  underlineColorAndroid='#fff' disableFullscreenUI placeholder={placeholder} onChangeText={onChangeText} style={{ flex: 1 }} />
            </View>
        </View>
    );
}

export default class BillInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invoNum: 57,
            tableNum: 26,

            subtotal: 350,
            tpsTax: 67.40,
            tvqTax: 25.20,
            total: 465.60,

            method: 0
        }
    }

    render() {
        let { id } = this.props;

        return (
            <Container>
                <Navbar />
                <ScrollView>
                    <View style={{ backgroundColor: '#eee', flexDirection: 'column', justifyContent: 'flex-start' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 10, paddingHorizontal: 10 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16 }}>
                                    Pay Order Invoice Num
                                <Text style={{ color: '#6c757d' }}>{' #' + this.state.invoNum}</Text>
                                    - Table Num
                                <Text style={{ color: '#6c757d' }}>{' ' + this.state.tableNum}</Text>
                                </Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TouchableOpacity style={{ margin: 4, backgroundColor: '#28a745' }}>
                                    <Text style={{ color: '#fff', padding: 6, alignItems: 'center', justifyContent: 'center' }}>Pay</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ margin: 4, backgroundColor: '#28a745' }}>
                                    <Text style={{ color: '#fff', padding: 6, alignItems: 'center', justifyContent: 'center' }}>Pay Without Receipt</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ margin: 4, backgroundColor: '#dc3545' }}>
                                    <Text style={{ color: '#fff', padding: 6, alignItems: 'center', justifyContent: 'center' }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(0,0,0,.125)', borderRadius: 4, padding: 16, marginHorizontal: 10, marginTop: 4, }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <Text style={{ color: '#6c757d' }}>Subtotal:  <Text style={{ fontWeight: 'bold' }}>{this.state.subtotal}$</Text></Text>
                                    <Text style={{ color: '#6c757d' }}>TPS Taxes: <Text style={{ fontWeight: 'bold' }}>{this.state.tpsTax}$</Text></Text>
                                    <Text style={{ color: '#6c757d' }}>TVQ Taxes: <Text style={{ fontWeight: 'bold' }}>{this.state.tvqTax}$</Text></Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <View style={{ flex: 1 }}>
                                        <ButtonInput icon='dollar-sign' placeholder='Discount' />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Input  placeholder='Balance' style={{ borderWidth: 1, borderColor: '#ced4da', backgroundColor: '#e9ecef' }} />
                                    </View>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <Text style={{ fontSize: 24 }}>Total: <Text style={{ fontWeight: 'bold' }}>{this.state.total}$</Text></Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#eee', marginTop: 10 }}>
                                <TouchableOpacity onPress={() => this.setState({ method: 1 })}>
                                    <FAIcon name='cc-visa' style={this.state.method == 1 ? { color: '#28a745', fontSize: 50 } : { fontSize: 50 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ method: 2 })}>
                                    <FAIcon name='cc-mastercard' style={this.state.method == 2 ? { color: '#28a745', fontSize: 50 } : { fontSize: 50 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ method: 3 })}>
                                    <FAIcon name='cc-amex' style={this.state.method == 3 ? { color: '#28a745', fontSize: 50 } : { fontSize: 50 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ method: 4 })}>
                                    <FAIcon name='credit-card' style={this.state.method == 4 ? { color: '#28a745', fontSize: 50 } : { fontSize: 50 }} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#eee', marginVertical: 10 }}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                                    <View stlye={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
                                        <Text>123</Text>
                                        <Text>123</Text>
                                        {/* <ButtonInput text='Cash' placeholder='Amount' />
                                    <ButtonInput text='Coupon' placeholder='Discount' /> */}
                                    </View>
                                    <View stlye={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
                                        <Text>123</Text>
                                        <Text>123</Text>
                                        {/* <ButtonInput text='Debit' placeholder='Amount' />
                                    <ButtonInput text='Credit' placeholder='Username' /> */}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Container>
        )
    }
}
