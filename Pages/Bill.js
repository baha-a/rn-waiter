import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Container } from 'native-base';
import Navbar from '../Components/Navbar';
import Invoice from '../Components/Invoice';

const Row=({children})=> {
  return(<View style={{ flex:1, flexDirection:'row', justifyContent:'flex-start'}}>
          {children}
        </View>);
  }


const invoiceData=[{
  id:1,
  time:'309',
  table:'15',
  waiter:'user1',
  
  clients:'6',

  pays:'1120',
  nextService:null,
},
{
  id:2,
  time:'409',
  table:'13',
  waiter:'user2',
  
  clients:'7',

  pays:null,
  nextService:'2',
},




{
  id:2,
  time:'409',
  table:'13',
  waiter:'user2',
  
  clients:'7',

  pays:null,
  nextService:'2',
},
{
  id:2,
  time:'409',
  table:'13',
  waiter:'user2',
  
  clients:'7',

  pays:null,
  nextService:'2',
},
{
  id:2,
  time:'409',
  table:'13',
  waiter:'user2',
  
  clients:'7',

  pays:null,
  nextService:'2',
},
{
  id:2,
  time:'409',
  table:'13',
  waiter:'user2',
  
  clients:'7',

  pays:null,
  nextService:'2',
},


];

export default class Bill extends Component {
  render() {
    return (
      <Container>
        <Navbar />

        <View style={{ flex:1, padding:10, backgroundColor:'#eee'}}>
          <View style={{ 
            padding:10,
            backgroundColor:'#fff',
            borderWidth:1,
            borderColor:'rgba(0,0,0,.125)',
            flex:1,
            flexDirection:'column',
            justifyContent:'flex-start',
            borderRadius:4,
          }}>

          {this.renderInvoices()}

          </View>
        </View>
      </Container>
    )
  }

  renderInvoices(){
    let res = [];
    for (let i = 0; i < invoiceData.length; i+=4) {
      let items = [];
      for (let j = 0; j+i < invoiceData.length && j<4; j++) {
        const e = invoiceData[j + i];
        items.push(<Invoice style={{ flex:1, margin:10,}} key={e.id} {...e} />)
      }
      
      if(items.length==0){
        break;
      }
      res.push(<Row key={i}>{items}</Row>);
    }
    
    if(res.length == 0){
      return <View />;
    }
    return res;
  }
}
