import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { Container, Input } from 'native-base';
import Navbar from '../Components/Navbar';
import Invoice from '../Components/Invoice';
import FAIcon from '../Components/FAIcon';
import Api from "../api";
import Loader from '../Components/Loader';
import ReloadBtn from '../Components/ReloadBtn';
import { Actions } from 'react-native-router-flux';

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
      error: false,
    }

    this.handelSelectInvoice = this.handelSelectInvoice.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }
  
  fetchData() {
    Api.getOrders()
      .then(orders => this.setState({ invoiceData: orders, ready: true, error: false }))
      .catch(x => this.setState({ ready: true, error: true }));
  }

  render() {
    let content = null;
    if (this.state.ready == false) {
      content = <Loader />;
    } else if (this.state.error) {
      content = <ReloadBtn onReload={() => { this.setState({ ready: false }); this.fetchData(); }} />;
    } else {
      content = (
        <ScrollView style={{ backgroundColor: '#eee' }} contentContainerStyle={{ padding: 10, }}>
          <CardView>
            {this.renderSearchAndCombinBar()}
          </CardView>

          <CardView>
            {this.renderInvoices()}
          </CardView>
        </ScrollView>);
    }

    return (
      <Container>
        <Navbar />
        {content}
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
    if (!this.state.invoiceData) {
      return <ReloadBtn title='no bills' onReload={() => { this.setState({ ready: false, error: false }); this.fetchData(); }} />;
    }

    return (<View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
      {
        this.state.invoiceData.map(e =>
          <Invoice

            isSelected={this.state.selectedInvoices.findIndex(x => x === e.id) >= 0}
            onSelected={this.handelSelectInvoice}
            style={{ width: '21%' }}
            key={e.id}
            info={e}
          />)
      }
    </View>);
  }

  handelSelectInvoice(isOn) {
    if (!this.state.combining) {
      Actions.order({
        id: e.id,
        waiter: e.waiter,
        discount: e.discount,
        discountType: e.discountType
      });
    }

    let list = this.state.selectedInvoices.slice();
    if (isOn) {
      list.push(e.id);
    } else {
      list = list.filter(x => x != e.id);
    }
    this.setState({ selectedInvoices: list });
    return true;
  }
}
