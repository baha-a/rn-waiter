import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Navbar from '../Components/Navbar';
import { Container, Icon } from 'native-base';
import Accordion from '../Components/Accordion';
import ItemPriceBar from '../Components/ItemPriceBar';
import Collapsible from '../Components/Collapsible';
import TableMenu from '../Components/TableMenu';
import { Actions } from 'react-native-router-flux';


const ClientList = ({ clients, selectedClient, onSelect }) => <ScrollView
  horizontal
  alwaysBounceHorizontal
  showsHorizontalScrollIndicator={false}
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


export default class Order extends Component {
  constructor(props) {
    super(props);

    let clients = [];
    for (let i = 1; i <= 100; i++) {
      clients.push(i);
    }

    this.state = {
      openOverly: false,
      clients: clients,
      selectedClient: 1,
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


  render() {
    return (
      <Container>
        <Navbar />
        <View style={{ flex: 1, backgroundColor: '#eee', flexDirection: 'row', }}>
          <View style={{ flex: 0.6 }} >
            <ScrollView>
              <ClientList clients={this.state.clients} selectedClient={this.state.selectedClient} onSelect={(id) => this.setState({ selectedClient: id })} />
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
            <TouchableOpacity style={{ backgroundColor: 'red', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, }}
              onPress={() => Actions.replace('bill')}>
              <Text style={{ color: '#fff' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: 'green', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, }}
              onPress={() => {
                TableMenu.PostTheOrder()
                .then(x => Actions.replace('bill'));
                //.then(x=>Actions.replace('bill'));
              }}>
              <Text style={{ color: '#fff' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    )
  }
}
