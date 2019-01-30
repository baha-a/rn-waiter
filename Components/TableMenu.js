import React, { Component } from 'react'
import { Switch, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import FAIcon from './FAIcon';
import Selectable from './Selectable';
import { Input, Item, Radio, Tab } from 'native-base';
import ItemButton from './ItemButton';
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

            hold: false,

            tableNumber: 0,

            barItems: [],

            doneServices: [],
            selectedService: 1,

            services: [],

            selectedItemsForArrange: [],

            note: '',
        };

        this.postOrder = this.postOrder.bind(this);
        this.customizeItem = this.customizeItem.bind(this);
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

    // static lastDishNumberAdded = null;
    componentDidMount() {
        // if (!this.props.id)
        //     return;

        TableMenu.postOrderEvt = () => { return this.postOrder(); };

        TableMenu.addItemEvt = (item) => {
            let x = { ...item };
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
                    s.products.forEach(pr => {
                        let p = { ...pr };
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
                // TableMenu.lastDishNumberAdded = x.dish_number;
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
                    disableFullscreenUI multiline numberOfLines={5} placeholder='Other Notes'
                    onChangeText={value => this.setState({ note: value })}
                    value={this.state.note}
                />
            </View>
        );
    }

    randerSchedule() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', paddingVertical: 10 }}>
                <Selectable title='Hold The Order' selected={this.state.hold} onSelect={(v) => this.toggleHoldOrder(v)} />
                <View style={{ backgroundColor: '#dee2e6', height: 1, margin: 10 }} />


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
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                    {client.products.map(x => this.renderProduct(x, 'client'))}
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        );
    }

    holdOrder() {
        if (this.props.id) {
            Api.hold({ order_id: this.props.id, status: "hold" })
                .then(x => this.setState({ hold: true }));
        } else {
            this.setState({ hold: true });
        }
    }

    unHoldOrder() {
        if (this.props.id) {
            Api.hold({ order_id: this.props.id, status: "active" })
                .then(x => this.setState({ hold: false }));
        } else {
            this.setState({ hold: false });
        }
    }

    toggleHoldOrder() {
        if (this.state.hold) {
            this.unHoldOrder();
        } else {
            this.holdOrder();
        }
    }

    customizeItem(item, type) {
        let { dish_number } = item.item;

        if (item.newTable) {
            if (this.props.id && item.item.unique_id) {
                Api.moveItemToTable({
                    product_unique_id: item.item.unique_id,
                    new_order_id: item.newTable.id
                }).then(x => {
                    type = (type == 'service' || type == 'client') ? 'service' : 'bar';
                    this.deleteItem(dish_number, type);
                    alert('move item to table #' + item.newTable.table_number);
                });
                return;
            } else {
                alert('save order before moving items to another table');
            }
        }

        if (type == 'bar') {
            let bar = this.state.barItems.slice();
            let oldItem = bar.find(x => x.dish_number == dish_number);

            this.fillNewItemProperty(oldItem, item);
            this.setState({ barItems: bar });
        }
        else if (type == 'service' || type == 'client') {
            let services = this.state.services.slice();
            let oldItem = null;
            let oldService = null;

            for (const s of services) {
                oldItem = s.products.find(x => x.dish_number == dish_number);
                if (oldItem) {
                    oldService = s;
                    break;
                }
            }

            if (oldItem) {
                this.fillNewItemProperty(oldItem, item);
                this.moveItemToSerivce(oldItem, item.service, oldService, services);
                this.setState({ services: services });
            }
        }
    }
    moveItemToSerivce(oldItem, newServiceNumber, oldService, servicesList) {
        if (oldService.service_number != newServiceNumber) {
            oldService.products = oldService.products.filter(x => x.dish_number != oldItem.dish_number);
            servicesList.find(x => x.service_number == newServiceNumber).products.push(oldItem);
        }
    }

    fillNewItemProperty(oldItem, newItem) {
        let { product_customizes, clients, discount, discountType, note } = newItem;
        oldItem.clients = !clients ? [] : clients.slice();
        oldItem.discount = discount;
        oldItem.discountType = discountType;
        oldItem.note = note;

        if (product_customizes) {
            oldItem.product_customizes = {};
            
            if (product_customizes.cookWays){
                oldItem.product_customizes.cookWays = product_customizes.cookWays;
            }

            if (product_customizes.customize){
                oldItem.product_customizes.customize = product_customizes.customize.slice();
            }
            if (product_customizes.optional){
                oldItem.product_customizes.optional = product_customizes.optional.slice();
            }

            // if (product_customizes.customize_groups){
            //     oldItem.product_customizes.customize_groups = product_customizes.customize_groups.slice();
            // }
        }
    }

    renderProduct(x, type) {
        let details = [];
        if (x.discount && x.discount > 0)
            details.push(x.discountType + '' + x.discount + ' off');
        
        if (x.product_customizes) {
            if (x.product_customizes.cookWays && x.product_customizes.cookWays.custom_name)
                details.push(x.product_customizes.cookWays.custom_name);

            if (x.product_customizes.customize)
                x.product_customizes.customize.forEach(y => details.push(y.custom_name));

            if (x.product_customizes.optional)
                x.product_customizes.optional.forEach(y => details.push(y.option_name));

            // if (x.product_customizes.customize_groups)
            //     x.product_customizes.customize_groups.forEach(y => details.push(y.group_name));
        }

        if (x.note)
            details.push(x.note);

        if (x.isTasting) {
            return <ItemButton
                key={x.dish_number}
                title={x.tasting_name}
                quantity={x.quantity}
                color={x.color || x.category_color}
            />;
        }

        // let onlayout = null;
        // if (TableMenu.lastDishNumberAdded && x.dish_number == TableMenu.lastDishNumberAdded) {
        //     onlayout = this._onLayout;
        // }

        let isFound = type == 'service' && this.isItemSelected(x.dish_number);

        return <ItemButton
            key={x.dish_number}
            // _onLayout={onlayout}
            title={x.en_name}
            details={details}
            clients={x.clients}
            addAndRemove
            onAddOrRemove={(v) => this.changeItemQuantity(x.dish_number, v)}
            quantity={x.quantity}
            color={x.color || x.category_color}
            onDelete={() => this.deleteItem(x.dish_number, 'bar')}
            isSelected={isFound}
            onPressMid={() => {
                if (type == 'service' && this.state.arrangeItems == true) {
                    if (isFound) { this.unselectItem(x.dish_number); } else { this.selectItem(x.dish_number); }
                } else {
                    Actions.customize({
                        item: { ...x },
                        services: this.state.services.map(x => x.service_number),
                        selectedService: this.getServiceNumberOfProduct(x.dish_number),
                        table: this.state.tableNumber,
                        onSave: (item) => this.customizeItem(item, type)
                    });
                }
            }}
        />;
    }

    unselectItem(dish_number) {
        this.setState({ selectedItemsForArrange: this.state.selectedItemsForArrange.filter(x => x != dish_number) });
    }

    selectItem(dish_number) {
        this.setState({ selectedItemsForArrange: [...this.state.selectedItemsForArrange, dish_number] });
    }

    isItemSelected(dish_number) {
        return this.state.selectedItemsForArrange.findIndex(x => x == dish_number) > -1;
    }

    moveSelectedItemToSerivce(sn) {
        let
            items = [],
            itemsNumbers = this.state.selectedItemsForArrange.slice(),
            services = this.state.services.slice();

        let selectedServices = services.find(x => x.service_number == sn);

        services.forEach(service => {
            let selectedItems = service.products.filter(p => itemsNumbers.findIndex(x => x == p.dish_number) != -1);
            if (selectedItems && selectedItems.length > 0) {
                items = [...items, ...selectedItems];
                service.products = service.products.filter(p => itemsNumbers.findIndex(x => x == p.dish_number) == -1);
            }
        });
        selectedServices.products = [...selectedServices.products, ...items];

        this.setState({ selectedItemsForArrange: [], arrangeItems: false, services: services });
    }

    toggleSelectionForItemOfService(sn) {
        let items = this.state.selectedItemsForArrange.slice();

        this.state.services.find(x => x.service_number == sn).products.forEach(p => {
            items = this.isItemSelected(p.dish_number) ? items.filter(x => x != p.dish_number) : [...items, p.dish_number];
        });

        this.setState({ selectedItemsForArrange: items });
    }

    changeItemQuantity(dish_number, value) {
        let bar = this.state.barItems.slice();
        let p = bar.find(x => x.dish_number == dish_number);
        if (p) {
            p.quantity = value;
            this.setState({ barItems: bar });
            return;
        }

        let services = this.state.services.slice();
        services.forEach(s => {
            let p = s.products.find(x => x.dish_number == dish_number);
            if (p) {
                p.quantity = value;
            }
        });
        this.setState({ services });
    }


    // static timeout = null;
    // _onLayout({ nativeEvent: { layout: { x, y, width, height } } }) {
    //     clearTimeout(TableMenu.timeout);
    //     TableMenu.timeout = setTimeout(() => {
    //         this.serviceView.scrollTo({ x: 0, y: y + height, animated: true });
    //     }, 200);
    //     TableMenu.lastDishNumberAdded = null;
    // }


    getServiceNumberOfProduct(dish_number) {
        let serv = this.state.services.find(s => s.products.findIndex(y => y.dish_number == dish_number) != -1);
        if (!serv)
            return null;
        return serv.service_number;
    }

    deleteItem(dish_number, from = 'service') {
        if (from == 'service') {
            let services = this.state.services.slice();
            services.forEach(s => {
                s.products = s.products.filter(x => x.dish_number != dish_number);
            });
            this.setState({ services });
        }
        else if (from == 'bar') {
            this.setState({ barItems: this.state.barItems.filter(x => x.dish_number != dish_number) });
        }
    }
    renderMenuItems() {
        let color1 = 1 == this.state.selectedSubTab ? '#bbb' : '#dae0e5';
        let color2 = 2 == this.state.selectedSubTab ? '#bbb' : '#dae0e5';

        let arrangeItemsEnable = this.state.arrangeItems == true;
        let dashedBorderStyle = arrangeItemsEnable ? { borderStyle: 'dashed', borderColor: '#eee', borderWidth: 3, margin: 4 } : {};

        return (
            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
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
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
                            {
                                this.state.services.map(s => {
                                    return (
                                        <View key={s.service_number} style={{ ...dashedBorderStyle, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>

                                            <View style={{ margin: 6 }}>
                                                <TouchableOpacity style={{ backgroundColor: '#f5f5f5', padding: 8, justifyContent: 'center', alignItems: 'center' }}
                                                    onPress={() => {
                                                        if (arrangeItemsEnable) {
                                                            this.moveSelectedItemToSerivce(s.service_number);
                                                        } else {
                                                            this.setState({ selectedService: s.service_number })
                                                        }
                                                    }}>
                                                    <Text style={{ fontWeight: 'bold', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>Service #{s.service_number}</Text>
                                                </TouchableOpacity>

                                                {
                                                    arrangeItemsEnable &&
                                                    <TouchableOpacity style={{ backgroundColor: '#ddd', padding: 6, justifyContent: 'center', alignItems: 'center' }}
                                                        onPress={() => this.toggleSelectionForItemOfService(s.service_number)}>
                                                        <Text style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center', fontSize: 12 }}>Select All</Text>
                                                    </TouchableOpacity>
                                                }
                                            </View>

                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}
                                            // ref={ref => this.serviceView = ref}
                                            >
                                                {s.products.map(x => this.renderProduct(x, 'service'))}
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        :
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                            {this.state.barItems.map(x => this.renderProduct(x, 'bar'))}
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
        if (this.props.id) {
            return new Promise(() => { throw 'edit order not supported yet' });
        }
        if (!this.state.tableNumber) {
            return new Promise(() => { throw 'choose table number first' });
        }

        let status = this.state.hold ? 'hold' : 'active';

        let order = {
            table_number: this.state.tableNumber,
            status: status,
            type: 'postpaid',
            note: this.state.note,
            bar: this.state.barItems.slice(),

            services: this.state.services
                .map(x => ({
                    service_number: x.service_number,
                    service_status: 'ToBeCall',
                    products: this.buildProducts(x.products /* .filter(y => !y.isTasting) */)
                }))
                .filter(x => x.products && x.products.length > 0),
        };


        // let tastingOrder = {
        //     table_number: this.state.tableNumber,
        //     status: status,
        //     type: 'tasting',
        //     note: this.state.note,
        //     services: this.state.services
        //         .map(x => ({
        //             service_number: x.service_number,
        //             service_status: 'ToBeCall',
        //             products: this.buildProducts(x.products.filter(y => y.isTasting))
        //         }))
        //         .filter(x => x.products && x.products.length > 0),
        // }

        if (this.props.id) {
            order.id = this.props.id;
            //tastingOrder.id = this.props.id;
        }

        let promises = [];
        // if (tastingOrder.services && tastingOrder.services.length > 0) {
        //     promises.push(tastingOrder);
        // }
        if (order.services && order.services.length > 0) {
            promises.push(Api.postOrder(order));
        }

        console.log('---------------- order --')
        console.log(order);
        // console.log('---------------- tasting order --')
        // console.log(tastingOrder);
        console.log('------------------')
        //        return new Promise(() => { throw 'mock api' });

        if (promises.length == 0) {
            return new Promise(() => { throw 'add items to the order first' });
        }

        //       return new Promise(() => { throw 'mock api' });

        return Promise.all(promises).then(x => alert('order successfully saved'));
    }

    buildProducts(products) {
        let result = [];

        let dish_number = 1;
        products.forEach(p => {
            if (p.clients && p.clients.length > 0) {
                p.clients.forEach(c => {
                    let count = p.quantity || 1;
                    while (count > 0) {
                        count--;
                        result.push(this.buildProductDataToSend(p, c, dish_number++));
                    }
                });
            } else {
                result.push(this.buildProductDataToSend(p, null, dish_number++));
            }
        });

        return result;
    }

    buildProductDataToSend(product, client, dish_number) {
        return {
            product_id: product.id,
            client_number: client,
            dish_number: dish_number,
            note: product.note || '',
            //cookingNote: product.otherNote || '',
            discount: product.discount || 0,
            product_customizes: product.product_customizes || {},
        };
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
                            this.setState(state => ({
                                services: [...state.services, { service_number: state.services.length + 1, products: [] }],
                                selectedService: state.services.length + 1,
                            }));
                        }}>
                        <FAIcon name='plus' />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 0.9, flexDirection: 'column', backgroundColor: '#fff', borderColor: '#eee', borderWidth: 1, borderRadius: 4 }}>
                    <View style={{ flex: 1, flexDirection: 'column', padding: 6 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Text style={{ fontSize: 18 }}> Table No# </Text>
                            <TextInput
                                keyboardType='numeric'
                                style={{ backgroundColor: '#dae0e5' }}
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
                subtotal += (parseInt(p.price) * parseInt(p.quantity > 0 ? p.quantity : 1));
            });
        });
        this.state.barItems.forEach(p => {
            subtotal += (parseInt(p.price) * parseInt(p.quantity > 0 ? p.quantity : 1));
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
