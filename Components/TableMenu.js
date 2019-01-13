import React, { Component } from 'react'
import { Switch, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import FAIcon from './FAIcon';
import Selectable from './Selectable';
import { Input, Item, Radio, Tab } from 'native-base';
import ItemButton from './ItemButton';
import Order from '../Pages/Order';
import Api from '../api';
import Loader from './Loader';

export default class TableMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            arrangeItems: false,
            selectedTab: 1,

            selectedSubTab: 1,

            invoiceHoldLimitedTime: true,
            invoiceHoldUnlimited: false,

            tableNumber: 0,

            barItems: [],

            doneServices: [],
            selectedService:1,

            services: [{
                service_number: 1,
                products: [{ id: 2, name: 'item2', price: 991, category: 5 },
                { id: 43, name: 'item33', price: 2, category: 3 }]
            },
            {
                service_number: 3, products: [{ id: 2, name: 'item2', price: 991, category: 5 },
                { id: 43, name: 'item33', price: 2, category: 3 }]
            },
            ],

            clients: [{
                client_number: 1,
                products: [{ id: 2, name: 'item2', price: 991, category: 5 },
                { id: 3, name: 'item3', price: 2, category: 1 },]
            },
            {
                client_number: 2,
                items: [{ id: 2, name: 'item2', price: 991, category: 4 },
                { id: 3, name: 'item3', price: 2, category: 5 }]
            }]
        };
    }

    static adddItemEvt = null;
    static adddItem(x) {
        if (TableMenu.adddItemEvt)
            TableMenu.adddItemEvt(x);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.id != this.props.id)
            return true;

        for (const key in this.state)
            if (nextState[key] != this.state[key])
                return true;
        return false;
    }

    componentWillUnmount() {
        TableMenu.adddItemEvt = null;
    }

    componentDidMount() {
        if (!this.props.id)
            return;

        TableMenu.adddItemEvt = (x) => {
            if (this.state.selectedTab == 1 && this.state.selectedSubTab == 2) {
                let bar = this.state.barItems.slice();
                bar.push(x);
                this.setState({ barItems: bar });
            }
            else if (this.state.selectedTab == 1 && this.state.selectedSubTab == 1) {
                let services = this.state.services.slice();
                if(services.length != 0){
                    services.find(x => x.service_number == this.state.selectedService).products.push(x);
                    this.setState({ services: services });
                }
            }
        };

        Api.getOrder(this.props.id)
            .then(x => {
                let clients = [];
                x.services.forEach(s => {
                    s.products.forEach(p => {
                        let f = clients.find(x => x.client_number == p.client_number);
                        if (f != null) {
                            f.products.push(p);
                        } else {
                            clients.push({ client_number: p.client_number, products: [p] });
                        }
                    });
                });

                this.setState({
                    ready: true,
                    tableNumber: x.table_number,
                    services: x.services,
                    clients: clients
                });
            });
    }

    tab(id, icon) {
        let color = id == this.state.selectedTab ? '#bbb' : '#dae0e5';
        return (<TouchableOpacity style={{ padding: 8, flex: 1, alignItems: 'center', backgroundColor: color }}
            onPress={() => this.setState({ selectedTab: id })}>
            <FAIcon name={icon} />
        </TouchableOpacity>);
    }

    renderNote() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Selectable title='Quickly !' />
                <Selectable title='Well cooked' />
                <Selectable title='Half cooked' />
                <Selectable title='Extral For All' />
                <Selectable title='Extra Fried Potatoes' />
                <Selectable title='Without Mayonnaise For All' />

                <Input style={{
                    marginVertical: 8, padding: 6, justifyContent: 'flex-start', borderRadius: 4,
                    borderColor: '#ddd', borderWidth: 1, textAlignVertical: 'top'
                }}
                    disableFullscreenUI multiline numberOfLines={5} placeholder='Other Notes' />
            </View>
        );
    }

    randerSchedule() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', paddingVertical: 10 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                        this.state.services.map(x =>
                            <View key={x.service_number} style={{ flexDirection: 'row', flexWrap: 'nowrap' }}>
                                <Switch value={this.state.doneServices.findIndex(y => y == x.service_number) != -1} trackColor={{ false: '#dee2e6', true: '#08d' }}
                                    onValueChange={(v) => {
                                        let done = null;
                                        if (v) {
                                            done = this.state.doneServices.slice();
                                            done.push(x.service_number);
                                        }
                                        else {
                                            done = this.state.doneServices.filter(y => y != x.service_number);
                                        }
                                        this.setState({ doneServices: done });
                                    }
                                    } />
                                <Text>Service #{x.service_number}</Text>
                            </View>
                        )
                    }
                </View>

                <View style={{ backgroundColor: '#dee2e6', height: 1, margin: 10 }} />

                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Radio color='#eee' selectedColor='#08d'
                        selected={this.state.invoiceHoldLimitedTime}
                        onPress={(e) => this.setState({
                            invoiceHoldLimitedTime: !this.state.invoiceHoldLimitedTime,
                            invoiceHoldUnlimited: this.state.invoiceHoldLimitedTime,
                        })} />
                    <Text style={{ fontSize: 10, margin: 6 }}>
                        Hold All Invoice For Limited Time
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Radio color='#eee' selectedColor='#08d'
                        selected={this.state.invoiceHoldUnlimited}
                        onPress={(e) => this.setState({
                            invoiceHoldLimitedTime: this.state.invoiceHoldUnlimited,
                            invoiceHoldUnlimited: !this.state.invoiceHoldUnlimited,
                        })} />
                    <Text style={{ fontSize: 10, margin: 6 }}>Hold to Un Hold</Text>
                </View>

                {
                    this.state.invoiceHoldLimitedTime &&
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={{ fontSize: 10 }}>Hold For:</Text>
                            <Input placeholder='30 min' disableFullscreenUI style={{ height: 30, borderRadius: 2, margin: 6, fontSize: 10, borderWidth: 1, borderColor: '#bbb' }} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={{ fontSize: 10 }}>Notify Me During:</Text>
                            <Input placeholder='5 min' disableFullscreenUI style={{ height: 30, borderRadius: 2, margin: 6, fontSize: 10, borderWidth: 1, borderColor: '#bbb' }} />
                        </View>
                    </View>
                }
            </View>
        );
    }

    renderViewByClient() {
        return (
            <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                {
                    this.state.clients.map(client => {
                        return (
                            <View key={client.client_number}>
                                <Text style={{ fontWeight: 'bold' }}>Client #{client.client_number}</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                                    {
                                        client.products.map(x => <ItemButton key={x.id} title={x.en_name} add remove details={x.product_customizes} color={x.category_color} />)
                                    }
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        );
    }

    renderMenuItems() {
        let color1 = 1 == this.state.selectedSubTab ? '#bbb' : '#dae0e5';
        let color2 = 2 == this.state.selectedSubTab ? '#bbb' : '#dae0e5';
        return (
            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ marginVertical: 8, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <TouchableOpacity style={{ padding: 4, flex: 1, alignItems: 'center', backgroundColor: color1 }}
                        onPress={() => this.setState({ selectedSubTab: 1 })}>
                        <Text> Menu </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 4, flex: 1, alignItems: 'center', backgroundColor: color2 }}
                        onPress={() => this.setState({ selectedSubTab: 2 })}>
                        <Text> Bar </Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.selectedSubTab == 1 ?
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                            {
                                this.state.services.map(s => {
                                    return (
                                        <View key={s.service_number} style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>

                                            <View style={{ backgroundColor: '#f5f5f5', padding: 8, margin: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', }}>Service #{s.service_number}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                                                {
                                                    s.products.map(x => <ItemButton key={x.id} title={x.en_name} details={x.product_customizes} add remove color={x.category_color} />)
                                                }
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        :
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                            {
                                this.state.barItems.map(x => <ItemButton key={x.id} title={x.en_name} add remove category={x.category} />)
                            }
                        </View>
                }
            </View>
        );
    }

    renderTabContent() {
        switch (this.state.selectedTab) {
            case 1:
                return this.renderMenuItems();
            case 2:
                return this.renderViewByClient();
            case 3:
                return this.renderNote();
            case 4:
                return this.randerSchedule();
        }
    }

    postOrder() {
        Api.postOrder({
            table_number: this.state.tableNumber,
            status: 'active',

            services: this.state.services.map(x=>({
                service_number: x.service_number,
                service_status: 'ToBeCall',
                service_type: 'prepaid',
                products:x.products.map(p=> ({
                    product_id: p.id,
                    client_number:1,
                    dish_number:1,
                    product_customizes:[]
                }))
            })),
            
            //bar: this.state.barItems.slice(),
        })
            .then(x => alert('order successfully saved'));
    }

    render() {

        if (this.state.ready == false)
            return <Loader />

        let arrangeItemsColor = this.state.arrangeItems ? '#bbb' : '#dae0e5';
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                <View style={{ flex: 0.1, flexDirection: 'column', marginTop: 1 }}>
                    {
                        this.state.services.map(x => <Text key={x.service_number} 
                            onPress={()=>this.setState({selectedService: x.service_number })}
                            style={{ 
                                padding: 2, 
                                backgroundColor: x.service_number == this.state.selectedService? '#ddd' : '#fff' 
                            }} >#{x.service_number}</Text>)
                    }
                    <TouchableOpacity style={{ padding: 2, backgroundColor: '#fff' }}
                        onPress={() => {
                            let s = this.state.services.slice();
                            s.push({ service_number: s.length + 1, products: [] });
                            this.setState({ services: s });
                        }}>
                        <FAIcon name='plus' />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 0.9, flexDirection: 'column', backgroundColor: '#fff', borderColor: '#eee', borderWidth: 1, borderRadius: 4 }}>
                    <View style={{ flex: 1, flexDirection: 'column', padding: 6 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Text style={{ fontSize: 18 }}> Table No# </Text>
                            <Input style={{ paddingHorizontal: 10, backgroundColor: '#dae0e5' }}
                                onChangeText={(v) => this.setState({tableNumber: v})} 
                                value={this.state.tableNumber}>
                            </Input>
                        </View>

                        <View style={{ flexDirection: 'row', marginVertical: 4, }}>
                            {this.tab(1, 'bars')}
                            {this.tab(2, 'street-view')}
                            {this.tab(3, 'sticky-note')}
                            {this.tab(4, 'clock')}
                            <TouchableOpacity style={{ padding: 8, flex: 1, alignItems: 'center', backgroundColor: arrangeItemsColor }}
                                onPress={() => this.setState({ arrangeItems: !this.state.arrangeItems })}>
                                <FAIcon name='hand-rock' />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{ flex: 1 }}>
                            {this.renderTabContent()}
                        </ScrollView>
                    </View>

                    <View style={{
                        backgroundColor: 'rgba(0,0,0,.03)', borderColor: 'rgba(0,0,0,.125)', borderWidth: 1,
                        padding: 10, flexDirection: 'column'
                    }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, }}>
                                <Text style={{ fontSize: 12, color: '#6c757d' }}> Subtotal: 400$ </Text>
                            </View>
                            <View style={{ flex: 1, }}>
                                <Text style={{ fontSize: 12, color: '#6c757d' }}> Taxes: 50$ </Text>
                            </View>
                        </View>
                        <View>
                            <Text>Total: 350$</Text>
                        </View>
                    </View>

                    <View style={{ margin: 4 }}>
                        <TouchableOpacity style={{ backgroundColor: 'lightgray', padding: 4 }} onPress={() => this.postOrder()}>
                            <Text> Save </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
