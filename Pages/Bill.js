import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { Container, Input } from 'native-base';
import Navbar from '../Components/Navbar';
import Invoice from '../Components/Invoice';
import FAIcon from '../Components/FAIcon';
import Api from "../api";
import Loader from '../Components/Loader';
import { Actions } from 'react-native-router-flux';
import { ReloadBtn } from '../Components/ReloadBtn';

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
      invoiceData: [],
      selectedInvoices: [],

      ready: false,
    }
  }

  componentDidMount() {
    Api.getOrders()
      .then(orders => this.setState({ invoiceData: orders, ready: true }));
  }


  render() {
    return (
      <Container>
        <Navbar />
        {
          this.state.ready == false ?
            <Loader />
            :
            <ScrollView style={{ backgroundColor: '#eee' }} contentContainerStyle={{ padding: 10, }}>
              <CardView>
                {this.renderSearchAndCombinBar()}
              </CardView>

              <CardView>
                {this.renderInvoices()}
              </CardView>
            </ScrollView>
        }
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
    if (!bills) {
      return <ReloadBtn newProps={this.props}/>;
    }

    for (let i = 0; i < bills.length; i += 4) {
      let items = [];
      for (let j = 0; j + i < bills.length && j < 4; j++) {
        const e = bills[j + i];
        items.push(
          <Invoice isSelectionEnabeld={this.state.combining}
            onSelected={(isOn) => {
              let list = this.state.selectedInvoices.slice();
              if (isOn) list.push(e.id);
              else list = list.filter(x => x != e.id);

              this.setState({ selectedInvoices: list });
            }}
            isSelected={this.state.selectedInvoices.findIndex(x => x == e.id) != -1}
            style={{ flex: 1, margin: 10, }} key={e.id} info={e} />)
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
