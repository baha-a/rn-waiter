import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Navbar from '../Components/Navbar';
import { Container, Icon } from 'native-base';
import Accordion from '../Components/Accordion';
import ItemPriceBar from '../Components/ItemPriceBar';
import Collapsible from '../Components/Collapsible';
import TableMenu from '../Components/TableMenu';
import { Actions } from 'react-native-router-flux';
import DiscountInput from '../Components/DiscountInput';

const isCloseToEnd = ({ layoutMeasurement, contentOffset, contentSize }) => {
  return layoutMeasurement.width + contentOffset.x >= contentSize.width - 20
};

const ClientList = ({ clients, selectedClient, onSelect, onEndReached }) => (
  <ScrollView
    horizontal
    alwaysBounceHorizontal
    showsHorizontalScrollIndicator={false}

    onScroll={({ nativeEvent }) => { if (isCloseToEnd(nativeEvent)) onEndReached(); }}
    scrollEventThrottle={400}
  >
    {
      clients.map(x => <TouchableOpacity key={x} style={{
        backgroundColor: x == selectedClient ? '#929292' : '#323232',
        margin: 10,
        marginHorizontal: 4,
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
        maxHeight: 40
      }}
        onPress={() => onSelect(x)}>

        <Text style={{ color: '#fff' }}> #{x} </Text>
      </TouchableOpacity>
      )
    }
  </ScrollView>
);

const pushSomeNewClients = (clientsList = null) => {

  if (!clientsList) {
    clientsList = [];
  }

  let last = 0;
  if (clientsList.length > 0) {
    last = clientsList[clientsList.length - 1];
  }

  for (let i = 0; i < 10; i++)
    clientsList.push(++last);

  return clientsList;
}

export default class Order extends Component {
  constructor(props) {
    super(props);

    let {
      discount = 0,
      discountType = '$',
    } = this.props;

    this.state = {
      openOverly: false,
      clients: pushSomeNewClients(),
      selectedClient: 1,

      discount: discount,
      discountType: discountType,
    };

    Order.openOverlyEvt = () => {
      //this.setState({ openOverly: true });
    };
  }

  static openOverlyEvt = null;
  static openOverly() {
    if (Order.openOverlyEvt)
      Order.openOverlyEvt();
  }

  renderOverl() {
    if (!this.state.openOverly)
      return null;
    return (<View style={{
      flex: 1,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    }}>
      <View style={{
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
        width: Dimensions.get('window').width,

      }}
        onTouchStart={() => this.setState({ openOverly: false })}>
        <Text></Text>
      </View>

      {/* <View style={{
          backgroundColor: '#fff', flex: 1,
          width: Dimensions.get('window').width,
          flexDirection: 'column',
          justifyContent:'flex-start',
        }}>
          <Text  style={{ fontSize: 16, margin:10 }}>Choose Table:</Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            flexWrap: 'wrap'
          }}>
              <TouchableOpacity style={{ backgroundColor: '#f5f5f5', padding: 14, margin: 6, }}>
                <Text style={{ fontSize: 14 }}>#{t}</Text>
              </TouchableOpacity>
          </View>
        </View> */}
    </View>
    );
  }

  handelSplit() {
    alert('Split not supported yet');
  }
  handelFlip() {
    alert('Flip not supported yet');
  }
  handelPay() {
    alert('Pay not supported yet');
  }

  renderHeader() {
    //if (!this.props.id){
      return null;
    //}

    // return (
    //   <View style={{ flexDirection: 'column', justifyContent: 'flex-start', }}>
    //     <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 6, paddingHorizontal: 16 }}>
    //       <View style={{ flex: 1, justifyContent: 'center' }}>
    //         <Text style={{ fontSize: 18, textAlignVertical: 'center' }}>Inv No#<Text style={{ color: '#6c757d' }}>{' ' + this.props.id}</Text></Text>
    //       </View>
    //       <View style={{ flex: 1, justifyContent: 'center' }}>
    //         <Text style={{ fontSize: 18, textAlignVertical: 'center' }}>Waiter:<Text style={{ color: '#6c757d' }}>{' ' + this.props.waiter}</Text></Text>
    //       </View>
    //       <View style={{ flex: 1 }}>
    //         <DiscountInput
    //           placeholder='discount value'
    //           value={this.state.discount}
    //           type={this.state.discountType}
    //           onValueChange={v => this.setState({ discount: v })}
    //           onTypeChange={v => this.setState({ discountType: v })}
    //         />
    //       </View>
    //     </View>
    //     <View style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: 10, paddingTop: 0 }}>
    //       <TouchableOpacity style={{ backgroundColor: '#6c757d', flex: 1, padding: 10, }} onPress={() => this.handelSplit()}>
    //         <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: '#fff' }}>Split</Text>
    //       </TouchableOpacity>
    //       <TouchableOpacity style={{ backgroundColor: '#f8f9fa', flex: 1, padding: 10, }} onPress={() => this.handelFlip()}>
    //         <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: '#000' }}>Flip</Text>
    //       </TouchableOpacity>
    //       <TouchableOpacity style={{ backgroundColor: '#1e7e34', flex: 1, padding: 10, }} onPress={() => this.handelPay()}>
    //         <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: '#fff' }}>Pay</Text>
    //       </TouchableOpacity>
    //     </View>
    //   </View>
    // );
  }

  render() {
    return (
      <Container style={{ backgroundColor: '#eee' }}>
        <Navbar />
        {this.renderHeader()}
        <View style={{ flex: 1, flexDirection: 'row', }}>
          <View style={{ flex: 0.6 }} >
            <ScrollView>
              <ClientList
                clients={this.state.clients}
                selectedClient={this.state.selectedClient}
                onSelect={(id) => this.setState({ selectedClient: id })}
                onEndReached={() => this.setState({ clients: pushSomeNewClients(this.state.clients.slice()) })}
              />
              <View style={{ marginLeft: 6 }}>
                <Accordion onItemPress={this.onItemPress} />
              </View>
              <View>
                <Collapsible title='Custom Dish' style={{
                  backgroundColor: '#fff',
                  borderWidth: 2,
                  borderColor: '#ccc',
                  marginVertical: 10,
                  marginLeft: 6,
                  padding: 10
                }}
                >
                  <ItemPriceBar secandInputTitle='Budget' buttonTitle='Add' />
                </Collapsible>
              </View>
            </ScrollView>

          </View>
          <View style={{ flex: 0.4, padding: 10 }}>
            <TableMenu id={this.props.id} selectedClient={this.state.selectedClient} />
          </View>
        </View>
        {this.renderOverl()}
        <View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <TouchableOpacity style={{ backgroundColor: '#dc3545', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, }}
              onPress={() => Actions.replace('bill')}>
              <Text style={{ color: '#fff' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: '#1e7e34', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, }}
              onPress={() => {
                TableMenu.PostTheOrder()
                  .then(x => Actions.replace('bill'))
                  .catch(x => alert(x));
              }}>
              <Text style={{ color: '#fff' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    )
  }
}
