import React, { Component } from 'react'
import { Switch, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import FAIcon from './FAIcon';
import Selectable from './Selectable';
import { Input, Item, Radio, Tab } from 'native-base';
import ItemButton from './ItemButton';
import Api from '../api';
import Loader from './Loader';
import { Actions } from 'react-native-router-flux';
import helper from '../helper';

const groupBy = (list, key) => list.reduce(function (rv, x) {
    let v = key instanceof Function ? key(x) : x[key];
    let el = rv.find((r) => r && r.key === v);
    if (el) el.values.push(x);
    else rv.push({ key: v, values: [x] });
    return rv;
}, []);

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

            tastingItems: [],
            services: [
                { service_number: 1, isNew: true, products: [] },
                { service_number: 2, isNew: true, products: [] },
                { service_number: 3, isNew: true, products: [] },
                { service_number: 4, isNew: true, products: [] },
                { service_number: 5, isNew: true, products: [] },
            ],

            selectedItemsForArrange: [],

            note: '',

            deleted_items: [],
        };

        this.postOrder = this.postOrder.bind(this);
        this.customizeItem = this.customizeItem.bind(this);
        this.replacementTastingItem = this.replacementTastingItem.bind(this);
        this.onProductLayout = this.onProductLayout.bind(this);
        this.handelServiceLayout = this.handelServiceLayout.bind(this);
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

        TableMenu.postOrderEvt = () => { return this.postOrder(); };

        TableMenu.addItemEvt = (item) => {
            let x = { ...item };
            if (x.isTasting) {
                this.handleAddTastingItem(x);
                return;
            }

            x.dish_number = Api.guid();
            x.clients = [this.props.selectedClient];
            x.quantity = 1;

            if (x.isBar) {
                this.setState({ barItems: [...this.state.barItems, x], selectedTab: 1, selectedSubTab: 2 });
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

        if (this.props.id) {
            this.fetchData();
        }
        else {
            this.setState({
                ready: true,
                tableNumber: '',
            });
        }
    }

    handleAddTastingItem(item) {
        let services = this.state.services.slice();
        if (!services || services.length == 0)
            services = [];

        item.services.forEach(s => {
            let service = services.find(y => y.service_number == s.service_number);
            if (!service) {
                service = { service_number: s.service_number, products: [] };
                services.push(service);
            }
            s.products.forEach(pr => {
                let p = { ...pr };

                let found = service.products.find(x => x.isTasting && x.product_id == p.product_id);
                if (found) {
                    found.quantity++;
                    found.clients = [...found.clients, this.props.selectedClient];
                }
                else {
                    p.isTasting = true;
                    p.color = item.color;
                    p.quantity = 1;
                    p.dish_number = TableMenu.dish_number++;
                    p.tastingCategoryName = item.tasting_name;
                    p.clients = [this.props.selectedClient];

                    service.products = [p, ...service.products];
                }
            });
        });


        let tastingItems = [...this.state.tastingItems];
        let tast = tastingItems.find(t => t.id == item.id);
        if (tast) { tast.quantity++; }
        else {
            tastingItems = [...tastingItems, { ...item, quantity: 1, }];
        }

        this.setState({
            services: services,
            selectedTab: 1,
            selectedSubTab: 1,
            tastingItems: tastingItems
        });
    }

    fetchData() {
        Api.getOrder(this.props.id)
            .then(async x => {
                if (!x.services) x.services = [];

                x.services.forEach(s => s.products = this.fixListProducts(s.products));

                if (x.tastings_services) {
                    let tastingItemsServices = await Api.getTasting();
                    for (const ts of this.addMissingPropertiesToTastingItem(tastingItemsServices, x.tastings_services)) {
                        let service = x.services.find(s => s.service_number == ts.service_number);
                        if (!service) {
                            service = { service_number: ts.service_number, products: [] };
                            x.services.push(service)
                        }
                        service.products = this.fixListProducts(ts.products, true);
                    }
                }

                let tastingItems = x.tastings_header.map(x => ({
                    id: x.tasting_id,
                    tasting_name: x.tasting_name,
                    quantity: x.tasting_count || 1,
                }));

                this.setState({
                    ready: true,
                    tableNumber: x.table_number,
                    note: x.note,
                    services: x.services,
                    barItems: this.fixListProducts(x.bar),
                    tastingItems: tastingItems,
                });
            }).catch(error => alert('Order\n' + error.message));
    }

    addMissingPropertiesToTastingItem(rawTastingServicesFromApi, servicesWithtastingItemsFromOrder) {
        let services = [...servicesWithtastingItemsFromOrder];
        for (const t of rawTastingServicesFromApi) {
            for (const s of t.services) {
                let service = services.find(x => x.service_number == s.service_number)
                if (!service)
                    continue;
                for (const p of s.products) {
                    let product = service.products.find(x => x.product_id == p.product_id);
                    if (product) {
                        product.replacements = [...p.replacements];
                    }
                }
            }
        }
        return services;
    }

    fixListProducts(list, isTasting = false) {
        if (!list || list.length == 0)
            return [];
        let products = [];
        list.forEach(p => {
            p.isTasting = isTasting;
            this.fillMissingDateForProducts(p, products);
        });
        return products;
    }

    static unsimilarityRules = [
        (p1, p2) => p1.id != p2.id,
        (p1, p2) => p1.product_id != p2.product_id,
        (p1, p2) => p1.note != p2.note,
        (p1, p2) => p1.discount != p2.discount,
        (p1, p2) => p1.isTasting != p2.isTasting,
        (p1, p2) => p1.isBar != p2.isBar,
        (p1, p2) => !((p1.product_customizes && p2.product_customizes) || (!p1.product_customizes && !p2.product_customizes)),
        (p1, p2) => !((p1.product_optionals && p2.product_optionals) || (!p1.product_optionals && !p2.product_optionals)),
        (p1, p2) => p1.product_customizes && p2.product_customizes &&
            (p1.product_customizes.length != p2.product_customizes.length || p1.product_customizes.findIndex(c => p2.product_customizes.findIndex(x => x == c) == -1) != -1),
        (p1, p2) => p1.product_optionals && p2.product_optionals &&
            (p1.product_optionals.length != p2.product_optionals.length || p1.product_optionals.findIndex(c => p2.product_optionals.findIndex(x => x == c) == -1) != -1),
    ];

    isSameProducts(p1, p2) {
        return TableMenu.unsimilarityRules.findIndex(rule => rule(p1, p2)) == -1;
    }

    fillMissingDateForProducts(p, products) {
        let pt = products.find(x => this.isSameProducts(x, p));
        if (pt) {
            if (pt.clients.findIndex(x => x == p.client_number) == -1) {
                pt.clients.push(p.client_number);
            } else {
                pt.quantity++;
            }
            pt.uniques = [...pt.uniques, p.unique_id];
        }
        else {
            products.push({ ...p, dish_number: Api.guid(), clients: [p.client_number], quantity: 1, uniques: [p.unique_id] });
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
                <Selectable title='Quickly !' style={{ margin: 0 }} />
                <Selectable title='Well cooked' style={{ margin: 0 }} />
                <Selectable title='Half cooked' style={{ margin: 0 }} />
                <Selectable title='Extral For All' style={{ margin: 0 }} />
                <Selectable title='Extra Fried Potatoes' style={{ margin: 0 }} />
                <Selectable title='Without Mayonnaise For All' style={{ margin: 0 }} />

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
                                <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
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
                .then(x => this.setState({ hold: true }))
                .catch(x => { alert('Holde\n' + x.message); });
        } else {
            this.setState({ hold: true });
        }
    }

    unHoldOrder() {
        if (this.props.id) {
            Api.hold({ order_id: this.props.id, status: "active" })
                .then(x => this.setState({ hold: false }))
                .catch(x => { alert('Unhold\n' + x.message); });
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

    replacementTastingItem(item) {
        let services = this.state.services.slice();

        for (const ns of item.services) {
            let os = services.find(x => x.service_number == ns.service_number);
            for (const p of ns.products) {
                let oldP = os.products.find(x => x.product_id == p.product_id);
                oldP.quantity = p.quantity;
                oldP.replacements = [...p.replacements];
            }
        }

        this.setState({ services: services });

        // for (const s of services) {
        //     let old = s.products.find(p => p.dish_number == item.item.dish_number);
        //     if (old) {
        //         if (item.newReplace) {
        //             let rep = item.item.replacement.find(x => x.id == item.newReplace);
        //             old.id = rep.id;
        //             old.en_name = rep.en_name;
        //             old.tasting_name = rep.tasting_name;
        //             old.price = rep.price;
        //         }

        //         if (item.quantity && item.quantity != 0) {
        //             old.quantity = item.quantity;
        //         }
        //         else if (item.quantity == 0) {
        //             this.deleteItem(item.item.dish_number);
        //             return;
        //         }

        //         this.setState({ services: services });
        //         break;
        //     }
        // }
    }

    customizeItem(item, type) {
        let { dish_number } = item.item;

        if (item.newTable) {
            if (this.props.id && item.item.unique_id) {
                Api.moveItemToTable({
                    product_unique_id: item.item.unique_id,
                    new_order_id: item.newTable.id
                }).then(x => {
                    this.deleteItemFromFrontEndOnly(dish_number);
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

            if (product_customizes.cookWays) {
                oldItem.product_customizes.cookWays = product_customizes.cookWays;
            }

            if (product_customizes.customizes) {
                oldItem.product_customizes.customizes = product_customizes.customizes.slice();
            }
            if (product_customizes.optional) {
                oldItem.product_customizes.optional = product_customizes.optional.slice();
            }
        }
    }

    renderProduct(x, type, serviceNumber) {
        if (x.isTasting) {
            return this.renderTastingItemWithReplacements(x, serviceNumber);
        }

        let details = [];
        if (x.discount && x.discount > 0)
            details.push(x.discountType + '' + x.discount + ' off');

        if (x.product_customizes) {
            let beforeCount = details.length;
            if (x.product_customizes.cookWays && x.product_customizes.cookWays.custom_name)
                details.push(x.product_customizes.cookWays.custom_name);

            if (x.product_customizes.customizes)
                x.product_customizes.customizes.forEach(y => details.push(y.custom_name));

            if (x.product_customizes.optional)
                x.product_customizes.optional.forEach(y => details.push(y.option_name));

            if (beforeCount == details.length) {
                try {
                    x.product_customizes.forEach(x => details.push(x));
                } catch (e) { }
            }
        }

        if (x.product_optionals) {
            try {
                x.product_customizes.forEach(x => details.push(x));
            } catch (e) { }
        }


        if (x.note)
            details.push(x.note);

        let isFound = type == 'service' && this.isItemSelected(x.dish_number);

        return <ItemButton
            key={x.dish_number}
            ref={ref => this.lastProductAdd = ref}
            onLayout={event => this.onProductLayout(event, type == 'service' ? serviceNumber : null)}
            title={x.en_name}
            details={details}
            clients={x.clients}
            addAndRemove
            onAddOrRemove={(v) => this.changeItemQuantity(x.dish_number, v)}
            quantity={x.quantity}
            color={x.color || x.category_color}
            onDelete={() => this.deleteItem(x.dish_number)}
            isSelected={isFound}
            onPressMid={() => {
                if (type == 'service' && this.state.arrangeItems == true) {
                    if (isFound) {
                        this.unselectItem(x.dish_number);
                    } else {
                        this.selectItem(x.dish_number);
                    }
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

    renderTastingItemWithReplacements(x, serviceNumber) {
        let tastingItems = [];

        let xquantity = helper.getQuantityOfItemMinusReplacement(x);
        if (xquantity > 0) {
            tastingItems = [
                <View key={x.dish_number} style={{ width: '30%' }}>
                    <ItemButton
                        title={x.product_name}
                        quantity={xquantity}
                        showCount
                        color={x.color || x.category_color}
                        onPressMid={() => this.handelTastingItemPress(x, serviceNumber)}
                    />
                </View>
            ];
        }

        if (x.replacements) {
            for (const r of x.replacements.filter(y => y.quantity && y.quantity > 0)) {
                tastingItems.push(
                    <View key={x.dish_number + '-' + r.id} style={{ width: '30%' }}>
                        <ItemButton
                            title={r.product_name}
                            quantity={r.quantity}
                            showCount
                            color={x.color || x.category_color}
                            isSelected
                            onPressMid={() => this.handelTastingItemPress(x, serviceNumber)}
                        />
                    </View>)
            }
        }

        return tastingItems;
    }

    handelTastingItemPress(x, serviceNumber) {
        if (!this.state.arrangeItems) {
            Actions.replacements({
                item: { ...x },
                tastingItems: [...this.state.tastingItems],
                tastingServices: this.state.services.map(s => ({ service_number: s.service_number, products: s.products.filter(x => x.isTasting) })),
                selectedService: serviceNumber,
                selectedItem: x,
                onSave: item => this.replacementTastingItem(item),
            });
        }
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

        this.state.services.find(x => x.service_number == sn)
            .products
            .filter(x => !x.isTasting)
            .forEach(p => {
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


    timeout = null;
    onProductLayout({ nativeEvent: { layout: { x, y, width, height } } }, service_number) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            if (this.contentScrollView) {
                let offest = y + height;
                if (service_number) {
                    let service = this.serviceScrollViewLayout.find(z => z.service_number == service_number);
                    if (service) {
                        offest += service.offest;
                    }
                }
                this.contentScrollView.scrollTo({ y: offest, animated: true });
            }
        }, 400);
    }
    serviceScrollViewLayout = [];
    handelServiceLayout(service_number, { nativeEvent: { layout: { x, y, width, height } } }) {
        let service = this.serviceScrollViewLayout.find(z => z.service_number == service_number);
        if (service) {
            service.offest = y;
        } else {
            this.serviceScrollViewLayout.push({ service_number, offest: y })
        }
        // console.log('______________')
        // console.log(this.serviceScrollViewLayout);
    }

    getServiceNumberOfProduct(dish_number) {
        let serv = this.state.services.find(s => s.products.findIndex(y => y.dish_number == dish_number) != -1);
        if (!serv)
            return null;
        return serv.service_number;
    }

    deleteItem(dish_number) {
        let item = this.getProductByDishNumber(dish_number);
        console.log(item);
        if (this.props.id && item.uniques) {
            this.setState({ deleted_items: [...this.state.deleted_items, ...item.uniques] });
        }

        this.deleteItemFromFrontEndOnly(dish_number);
    }
    getProductByDishNumber(dish_number) {
        let item = this.state.barItems.find(x => x.dish_number == dish_number);
        if (!item) {
            for (const s of this.state.services) {
                item = s.products.find(x => x.dish_number == dish_number);
                if (item)
                    break;
            }
        }
        return item;
    }

    deleteItemFromFrontEndOnly(dish_number) {
        if (this.state.barItems.findIndex(x => x.dish_number == dish_number) != -1) {
            this.setState({ barItems: this.state.barItems.filter(x => x.dish_number != dish_number) });
        }
        else {
            let services = this.state.services.slice();
            services.forEach(s => s.products = s.products.filter(x => x.dish_number != dish_number));
            this.setState({ services });
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
                        onPress={() => {
                            this.setState({ selectedSubTab: 1 });
                        }}>
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
                                        <View style={{ ...dashedBorderStyle, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}
                                            key={s.service_number} onLayout={event => this.handelServiceLayout(s.service_number, event)}
                                        >

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
                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                                {
                                                    this.state.tastingItems.filter(t => t.services.findIndex(i => i.service_number == s.service_number) != -1)
                                                        .map(t =>
                                                            <Text key={t.id} style={{ paddingHorizontal: 3 }}><Text style={{ fontWeight: 'bold' }}>{t.quantity}</Text>{' ' + t.tasting_name},</Text>
                                                        )
                                                }
                                            </View>
                                            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                                {
                                                    // groupBy(s.products.filter(x => x.isTasting), x => x.tastingCategoryName)
                                                    //     .map(t =>
                                                    //         <View key={t.key} style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                                        {/*t.values*/s.products.filter(x => x.isTasting).map(x => this.renderProduct(x, 'service', s.service_number))}
                                                    </View>
                                                    //     </View>
                                                    // )
                                                }
                                            </View>
                                            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                                {s.products.filter(x => !x.isTasting).map(x => this.renderProduct(x, 'service', s.service_number))}
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        :
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
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
        // if (this.props.id) {
        //     return new Promise(() => { throw 'edit order not supported yet' });
        // }
        if (!this.state.tableNumber) {
            return new Promise(() => { throw 'choose table number first' });
        }

        let status = this.state.hold ? 'hold' : 'active';

        let serivcecounter = 0;
        let order = {
            table_number: this.state.tableNumber,
            status: status,
            type: 'postpaid',
            note: this.state.note,

            bar: this.buildProducts(this.state.barItems),

            services: this.state.services
                .filter(x => x.products && x.products.length > 0 && x.products.filter(y => !y.isTasting).length > 0)
                .map(x => ({
                    service_number: ++serivcecounter, //x.service_number,
                    products: this.buildProducts(x.products.filter(y => !y.isTasting)),
                    isNew: x.isNew == true,
                })),

            tasting: this.buildTastingProduct(this.state.tastingItems),
            // this.state.services
            //     .filter(x => x.products && x.products.length > 0 && x.products.filter(y => y.isTasting).length > 0)
            //     .map(x => ({
            //         service_number: ++serivcecounter, //x.service_number,
            //         products: this.buildProducts(x.products.filter(y => y.isTasting)),
            //         isNew: x.isNew == true,
            //     }))
        }

        console.log('---------------- order --')
        console.log({ order, deleted_items: [...this.state.deleted_items] });
        console.log('------------------')

        //return new Promise(() => { throw 'mock api' });

        if ((order.services && order.services.length > 0) ||
            (order.bar && order.bar.length > 0) ||
            (order.tasting && order.tasting.length > 0)) {

            if (this.props.id)
                return Api.editOrder(this.props.id, { ...order, deleted_items: [...this.state.deleted_items] })
                    .then(x => alert('order successfully saved'));
            else
                return Api.postOrder(order).then(x => alert('order successfully saved'));
        }
        else {
            return new Promise(() => { throw 'add items to the order first' });
        }
    }

    buildTastingProduct(tastings) {
        return tastings.map(x => ({
            tasting_id: x.id,
            tastings_count: x.quantity,
            replacements: [], //    	replacements : [{7 : 42},{8 : 45},{15 : 27}]
        }));
    }

    buildProducts(products) {
        let result = [];

        products.forEach(p => {
            if (p.clients && p.clients.length > 0) {
                p.clients.forEach(c => this.handelQuantityForProduct(p, c, result));
            } else {
                this.handelQuantityForProduct(p, null, result);
            }


            if (p.uniques && p.uniques.length > 0) {
                this.setState({ deleted_items: [...this.state.deleted_items, ...p.uniques] });
            }
        });

        return result;
    }

    handelQuantityForProduct(product, client, resultList) {
        let count = product.quantity || 1,
            unique_id = null;

        while (count > 0) {
            if (product.uniques) {
                unique_id = product.uniques.pop();
            } else {
                unique_id = null;
            }
            resultList.push(this.buildProductDataToSend(product, client, unique_id));
            count--;
        }
    }

    buildProductDataToSend(product, client, unique_id = null) {
        let cstm = [];
        let optnl = [];

        if (product.product_customizes) {
            if (product.product_customizes.customizes) {
                cstm = product.product_customizes.customizes.map(x => x.id);
            }
            if (product.product_customizes.cookWays) {
                cstm.push(product.product_customizes.cookWays.id);
            }
            if (product.product_customizes.optional) {
                optnl = product.product_customizes.optional.map(x => x.id);
            }
        }

        return {
            product_id: product.id,
            client_number: client,
            note: product.note || '',
            discount: product.discount || 0,
            isTasting: product.isTasting || false,
            product_customizes: cstm,
            product_optionals: optnl,

            ...(!unique_id ? {} : { unique_id })
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
                        onPress={() => this.addNewService()}>
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
                        <ScrollView style={{ flex: 1 }} ref={r => this.contentScrollView = r}>
                            {this.renderTabContent()}
                        </ScrollView>
                    </View>
                    {this.renderTotal()}
                </View>
            </View>
        )
    }

    addNewService() {
        this.setState(state => {
            return {
                services: [
                    ...state.services,
                    {
                        service_number: state.services.length + 1,
                        products: [],
                        isNew: true,
                    }],
                selectedService: state.services.length + 1,
            }
        });
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
