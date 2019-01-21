import React, { Component } from 'react'
import { Switch, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import FAIcon from './FAIcon';
import Selectable from './Selectable';
import { Input, Item, Radio, Tab } from 'native-base';
import ItemButton from './ItemButton';
import Order from '../Pages/Order';
import Api from '../api';
import Loader from './Loader';
import { Actions } from 'react-native-router-flux';

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
            selectedService: 1,

            services: [/*{ service_number: 1, products: [{ id: 2, name: 'item2', price: 991, category: 5 }] }*/],
        };

        this.postOrder = this.postOrder.bind(this);
    }

    static addItemEvt = null;
    static dish_number = 1;
    static addItem(x) {
        if (TableMenu.addItemEvt)
            TableMenu.addItemEvt(x);
    }

    static postOrderEvt = null;
    static PostTheOrder() {
        if (TableMenu.postOrderEvt) {
            return TableMenu.postOrderEvt();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        for (const key in this.props)
            if (key != 'selectedClient' && nextProps[key] != this.props[key])
                return true;

        for (const key in this.state)
            if (nextState[key] != this.state[key])
                return true;
        return false;
    }

    componentWillUnmount() {
        TableMenu.addItemEvt = null;
        TableMenu.postOrderEvt = null;
    }

    componentDidMount() {
        // if (!this.props.id)
        //     return;

        TableMenu.postOrderEvt = () => { return this.postOrder(); };

        TableMenu.addItemEvt = (item) => {
            let x = {...item};
            if (x.isTasting) {
                let services = this.state.services.slice();
                if (!services || services.length == 0)
                services = [];

                x.services.forEach(s => {
                    let service = services.find(y => y.service_number == s.service_number);
                    if (!service) {
                        service = { service_number: s.service_number, products: [] };
                        services.push(service);
                    }
                    s.products.forEach(prodcut => {
                        let p = {...prodcut};
                        p.isTasting = true;
                        p.color = x.color;
                        p.dish_number = TableMenu.dish_number++;
                        p.clients = [this.props.selectedClient];
                        service.products.push(p);
                    });
                });

                this.setState({ services: services, selectedTab: 1, selectedSubTab: 1 });

                return;
            }

            x.dish_number = TableMenu.dish_number++;
            x.clients = [this.props.selectedClient];
            if (x.isBar) {
                let bar = this.state.barItems.slice();
                bar.push(x);
                this.setState({ barItems: bar, selectedTab: 1, selectedSubTab: 2 });
            }
            else {
                let services = this.state.services.slice();
                if (!services || services.length == 0)
                    services = [{ service_number: 1, products: [x] }];
                else
                    services.find(y => y.service_number == this.state.selectedService).products.push(x);

                this.setState({ services: services, selectedTab: 1, selectedSubTab: 1 });
            }
        };

        if (this.props.id && this.props.id != 0) {
            Api.getOrder(this.props.id)
                .then(x => {
                    //let clients = this.extractClient(x.services);

                    this.setState({
                        ready: true,
                        tableNumber: x.table_number,
                        services: x.services,
                        //clients: clients
                    });
                });
        }
        else {
            this.setState({
                ready: true,
                tableNumber: '',
                services: [],
                //clients: []
            });
        }
    }

    extractClient(services) {
        let clients = [];
        services.forEach(s => {
            s.products.forEach(p => {
                if (p.clients) {
                    p.clients.forEach(c => {
                        let f = clients.find(x => x.client_number == c);
                        if (f != null) {
                            f.products.push(p);
                        } else {
                            clients.push({ client_number: c, products: [p] });
                        }
                    });
                }
            });
        });
        return clients;
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
                    this.extractClient(this.state.services).map(client => {
                        return (
                            <View key={client.client_number}>
                                <Text style={{ fontWeight: 'bold' }}>Client #{client.client_number}</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems:'flex-start', alignContent: 'flex-start' }}>
                                    {
                                        client.products.map(x => this.renderProduct(x, 'client'))
                                    }
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        );
    }

    customizeItem(item, type) {
        let { dish_number } = item.item;

        if (type == 'bar') {
            let bar = this.state.barItems.slice();
            let newItem = bar.find(x => x.dish_number == dish_number);

            this.fillNewItemProperty(newItem, item);
            this.setState({ barItems: bar });
        }
        else if (type == 'service' || type == 'client') {
            let services = this.state.services.slice();
            let newItem = null;
            services.forEach(s => {
                newItem = s.products.find(x => x.dish_number == dish_number);
                if (newItem) {
                    return;
                }
            });

            if (newItem) {
                this.fillNewItemProperty(newItem, item);
                this.setState({ services: services });
            }
        }
    }

    fillNewItemProperty(newItem, oldItem) {
        let { options, clients, discount, discountType } = oldItem;
        newItem.clients = !clients ? [] : clients.slice();
        newItem.product_customizes = !options ? [] : options.slice();
        newItem.discount = discount;
        newItem.discountType = discountType;
    }

    renderProduct(x, type) {
        let details = [];
        if (x.discount && x.discount > 0) {
            details.push(x.discountType + '' + x.discount + ' off');
        }
        if (x.product_customizes) {
            x.product_customizes.forEach(x => {
                details.push(x.custom_name);
            });
        }

        if (x.isTasting) {
            return <ItemButton
                key={x.dish_number}
                title={x.tasting_name}
                color={x.color}
            />;
        }

        return <ItemButton
            key={x.dish_number}
            title={x.en_name}
            details={details}
            clients={x.clients}
            addAndRemove
            color={Api.mapCategoryWithColors(x.category_id)}
            onDelete={() => alert('item will remove')}
            onPressMid={() => Actions.customize({ item: x, onSave: (item) => this.customizeItem(item, type) })}
        />;
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

                                            <TouchableOpacity style={{ backgroundColor: '#f5f5f5', padding: 8, margin: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                                                onPress={() => this.setState({ selectedService: s.service_number })}>
                                                <Text style={{ fontWeight: 'bold', }}>Service #{s.service_number}</Text>
                                            </TouchableOpacity>

                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems:'flex-start', alignContent: 'flex-start' }}>
                                                {
                                                    s.products.map(x => this.renderProduct(x, 'service'))
                                                }
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        :
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                            {
                                this.state.barItems.map(x => this.renderProduct(x, 'bar'))
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
        return Api.postOrder({
            table_number: this.state.tableNumber,
            status: 'active',

            services: this.state.services.map(x => ({
                service_number: x.service_number,
                service_status: 'ToBeCall',
                service_type: 'prepaid',
                products: this.buildProducts(x.products)
            })),

            //bar: this.state.barItems.slice(),
        })
            .then(x => alert('order successfully saved'));
    }
    buildProducts(products) {
        let result = [];

        let dish_number = 1;
        products.forEach(p => {
            if (p.clients) {
                p.clients.forEach(c => {
                    result.push({
                        product_id: p.id,
                        client_number: c,
                        dish_number: dish_number++,
                        product_customizes: p.product_customizes && p.product_customizes.map(x => x.id),
                    });
                });
            } else {
                result.push({
                    product_id: p.id,
                    dish_number: dish_number++,
                    product_customizes: p.product_customizes && p.product_customizes.map(x => x.id),
                });
            }
        });

        return result;
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
                            onPress={() => this.setState({ selectedService: x.service_number })}
                            style={{
                                padding: 2,
                                backgroundColor: x.service_number == this.state.selectedService ? '#ddd' : '#fff'
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
                            <TextInput keyboardType='numeric' style={{ backgroundColor: '#dae0e5' }}
                                onChangeText={(v) => this.setState({ tableNumber: v })}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                disableFullscreenUI
                                value={this.state.tableNumber + ''}>
                            </TextInput>
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
                    {this.renderTotal()}
                </View>
            </View>
        )
    }

    renderTotal() {
        let subtotal = 0,
            taxes = 0,
            total = 0;

        this.state.services.forEach(s => {
            s.products.forEach(p => {
                subtotal += parseInt(p.price);
            });
        });
        this.state.barItems.forEach(p => {
            subtotal += parseInt(p.price);
        });

        return (<View style={{
            backgroundColor: 'rgba(0,0,0,.03)', borderColor: 'rgba(0,0,0,.125)', borderWidth: 1,
            padding: 10, flexDirection: 'column'
        }}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, }}>
                    <Text style={{ fontSize: 12, color: '#6c757d' }}> Subtotal: {subtotal}$ </Text>
                </View>
                <View style={{ flex: 1, }}>
                    <Text style={{ fontSize: 12, color: '#6c757d' }}> Taxes: {taxes}$ </Text>
                </View>
            </View>
            <View>
                <Text>Total: {subtotal + taxes}$</Text>
            </View>
        </View>
        );
    }
}
