import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { Container, Input } from 'native-base';
import Navbar from '../Components/Navbar';
import Invoice from '../Components/Invoice';
import FAIcon from '../Components/FAIcon';

const Row = ({ children }) => {
  return (<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
    {children}
  </View>);
}

const CardView = ({ children, style }) => {
  return (
    <View style={{
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,.125)',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      borderRadius: 4,

      padding: 10,
      marginBottom: 10,

      ...style
    }}>
      {children}
    </View>);
}

export default class Bill extends Component {
  constructor(props) {
    super(props);

    this.state = {
      combining: false,
      invoiceData: [
        { id: 1, time: '309', table: '15', waiter: 'user1', clients: '6', pays: '1120', nextService: null, },
        { id: 2, time: '409', table: '13', waiter: 'user2', clients: '7', pays: null, nextService: '2', },
        { id: 3, time: '409', table: '13', waiter: 'user2', clients: '7', pays: null, nextService: '2', },
        { id: 4, time: '409', table: '13', waiter: 'user2', clients: '7', pays: null, nextService: '2', },
        { id: 5, time: '409', table: '13', waiter: 'user2', clients: '7', pays: null, nextService: '2', },
        { id: 6, time: '409', table: '13', waiter: 'user2', clients: '7', pays: null, nextService: '2', },
        { id: 7, time: '409', table: '13', waiter: 'user2', clients: '7', pays: null, nextService: '2', },
      ],

      selectedInvoices: []
    }
  }


  render() {
    return (
      <Container>
        <Navbar />

        <ScrollView style={{ backgroundColor: '#eee' }} contentContainerStyle={{ padding: 10, }}>
          <CardView>
            {this.renderSearchAndCombinBar()}
          </CardView>

          <CardView>
            {this.renderInvoices()}
          </CardView>
        </ScrollView>
      </Container>
    )
  }

  renderSearchAndCombinBar() {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flex: 0.8 }}>
            <TextInput disableFullscreenUI underlineColorAndroid='#fff' placeholder='Table No#' style={{ borderWidth: 1, borderColor: '#bbb', borderBottomStartRadius: 4, paddingLeft: 6 }} />
          </View>
          <View style={{ flex: 0.2 }}>
            <TouchableOpacity style={{ backgroundColor: '#6c757d', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff' }}> Search </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'stretch' }}>
          {
            this.state.combining == false ?
              <View style={{ flex: 0.7, paddingLeft: 10, flexDirection: 'row' }}>
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#6c757d', alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => this.startCombining()}>
                  <Text style={{ color: '#fff' }}> Combine </Text>
                </TouchableOpacity>
              </View>
              :
              <View style={{ flex: 0.7, paddingLeft: 10, flexDirection: 'row' }}>
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#28a745', alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => this.finishCombining()}>
                  <Text style={{ color: '#fff' }}> Do Combine </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#dc3545', alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => this.cancelCombining()}>
                  <Text style={{ color: '#fff' }}> Cancel </Text>
                </TouchableOpacity>
              </View>
          }

          <View style={{ flex: 0.3, paddingLeft: 10 }}>
            <TouchableOpacity style={{ backgroundColor: '#dc3545', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <FAIcon style={{ color: '#fff' }} name='file-invoice-dollar' />
            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  }

  startCombining() {
    this.setState({ combining: true });
  }

  cancelCombining() {
    this.setState({ combining: false, selectedInvoices: [] });
  }
  finishCombining() {
    let idsOfInvoicesToCombineThem = this.state.selectedInvoices;
    //
    // combine it later
    // 
    this.setState({ combining: false, selectedInvoices: [] });
  }


  renderInvoices() {
    let res = [],
      bills = this.state.invoiceData;

    for (let i = 0; i < bills.length; i += 4) {
      let items = [];
      for (let j = 0; j + i < bills.length && j < 4; j++) {
        const e = bills[j + i];
        items.push(<Invoice isSelectionEnabeld={this.state.combining}
          onSelected={(isOn) => {
            let list = this.state.selectedInvoices.slice();
            if (isOn) list.push(e.id);
            else list = list.filter(x => x != e.id);

            this.setState({ selectedInvoices: list });
          }}
          isSelected={this.state.selectedInvoices.findIndex(x => x == e.id) != -1}
          style={{ flex: 1, margin: 10, }} key={e.id} {...e} />)
      }

      if (items.length == 0) {
        break;
      }
      res.push(<Row key={i}>{items}</Row>);
    }

    if (res.length == 0) {
      return <View />;
    }
    return res;
  }
}
