import React, { Component } from 'react';
import { Container, Icon,Header,Content } from 'native-base';
import { Actions } from 'react-native-router-flux';
import FAIcon from '../Components/FAIcon';

import { Text, View, ScrollView, TouchableOpacity, Dimensions, TextInput, StyleSheet } from 'react-native';



export default class PayInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            credit:'',
        
        }
    }
    handelSelectCard(name){
        //alert(name);
        this.setState((prev)=>({credit:prev.credit === name ? '':name}));
    }
    render() {
        return (
            <Container style={{ backgroundColor: '#eee', justifyContent: 'flex-end' }}>
                <Header noShadow={true} style={{ backgroundColor: '#323232' }} >
                    <Content contentContainerStyle={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{color:"#fff"}}>Pay Order Invoice Num #57 - Table Num 26</Text>
                    </Content>
                </Header>

                <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                    <View style={{ flex: 1,justifyContent: 'center' }}>
                        <Text>Subtotal:524</Text>
                        <Text>TPS Taxes : 214</Text>
                        <Text>TVQ taxes: 114</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                        <TextInput style={styles.input} placeholder="Price"></TextInput>
                        <TextInput style={styles.input} placeholder="Balance"></TextInput>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center' }}>
                        <Text>Total:555</Text>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                <TouchableOpacity style={{flex:1}} onPress={()=>{this.handelSelectCard('Visa')}}>
                    <FAIcon name="cc-visa" style={{fontSize: 50,color:this.state.credit === 'Visa'? 'green':'black'}} ></FAIcon>

                </TouchableOpacity>
                <TouchableOpacity style={{flex:1}} onPress={()=>{this.handelSelectCard('MasterCard')}}>
                    <FAIcon name="cc-mastercard" style={{fontSize: 50,color:this.state.credit === 'MasterCard'? 'green':'black'}} onPress={()=>{this.handelSelectCard('visa')}}></FAIcon>

                </TouchableOpacity>
                <TouchableOpacity style={{flex:1}} onPress={()=>{this.handelSelectCard('AmericanExprss')}}>
                    <FAIcon name="cc-amex" style={{fontSize: 50,color:this.state.credit === 'AmericanExprss'? 'green':'black'}} onPress={()=>{this.handelSelectCard('visa')}}></FAIcon>

                </TouchableOpacity>
                <TouchableOpacity style={{flex:1}} onPress={()=>{this.handelSelectCard('Other')}}>
                    <FAIcon name="credit-card" style={{fontSize: 50,color:this.state.credit === 'Other'? 'green':'black'}} onPress={()=>{this.handelSelectCard('visa')}}></FAIcon>

                </TouchableOpacity>
                    
                  


                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>

                    <TextInput placeholder="Cash" style={styles.input}></TextInput>
                    <TextInput placeholder="Debit" style={styles.input}></TextInput>

                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <TextInput placeholder="Coupon" style={styles.input}></TextInput>
                    <TextInput placeholder="Credit" style={styles.input}></TextInput>
                </View>


                <View style={{ flex: 1 }}>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                        <TouchableOpacity style={{ backgroundColor: '#dc3545', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, }}
                            onPress={() => Actions.replace('bill')}>
                            <Text style={{ color: '#fff' }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: '#1e7e34', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, }}
                            onPress={() => { }}>
                            <Text style={{ color: '#fff' }}>Pay Without Recipet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: '#1e7e34', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, }}
                            onPress={() => { }}>
                            <Text style={{ color: '#fff' }}>Pay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Container>
        );
    }
}


const styles = StyleSheet.create({

    input: {
        flex: 1,
        height: 50,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 5
    },
    credit:{
        flex: 1, 
        fontSize: 50,
    
    },
    creditSelected : {
        color:'green'
    }


});