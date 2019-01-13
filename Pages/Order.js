import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Navbar from '../Components/Navbar';
import { Container, Icon } from 'native-base';
import Accordion from '../Components/Accordion';
import ItemPriceBar from '../Components/ItemPriceBar';
import Collapsible from '../Components/Collapsible';
import TableMenu from '../Components/TableMenu';


export default class Order extends Component {
  constructor(props) {
    super(props);

    let clients =[];
    for (let i = 1; i <= 100; i++) {
      clients.push(i);
    }

    this.state = {
      openOverly: false,

      clients: clients,

      selectedClient:1,
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


  render() {
    return (
      <Container>
        <Navbar />
        <View style={{ flex: 1, backgroundColor: '#eee', flexDirection: 'row', }}>
          <View style={{ flex: 0.6 }} >
            <ScrollView>
              <ScrollView
                horizontal
                alwaysBounceHorizontal
                showsHorizontalScrollIndicator={false}
              >
                {
                  this.state.clients.map(x => <TouchableOpacity key={x} style={{
                      backgroundColor: x == this.state.selectedClient ?'#929292':'#323232',
                      margin: 10,
                      marginHorizontal: 4,
                      padding: 10,
                      paddingHorizontal: 20,
                      borderRadius: 4,
                      maxHeight: 40
                    }}
                    onPress={e => this.setState({ selectedClient: x})}>

                      <Text style={{ color: '#fff' }}> #{x} </Text>
                    </TouchableOpacity>
                )
              }
              </ScrollView>
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
            <TableMenu id={this.props.id}/>
          </View>
        </View>
        {
          this.state.openOverly &&
          <View style={{
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
        }
      </Container>
    )
  }
}
