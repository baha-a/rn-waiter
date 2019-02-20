import React, { Component } from 'react'
import { Switch, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import FAIcon from './FAIcon';
import Selectable from './Selectable';
import { Input, Radio } from 'native-base';
import ItemButton from './ItemButton';
import Api from '../api';
import Loader from './Loader';
import { Actions } from 'react-native-router-flux';
import helper from '../helper';
import ReloadBtn from './ReloadBtn';

export default class TableMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            error: false,

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

            tasting_header: [],
            deletedTastingHeader: [],

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

        TableMenu.postOrderEvt = () => this.postOrder();

        TableMenu.addItemEvt = (itemToAdd) => {
            let item = { ...itemToAdd };
            if (item.isTasting) {
                this.handleAddTastingItem(item);
            }
            else {
                this.handleAddNormalItem(item);
            }
        };

        if (this.props.id) {
            this.fetchData();
        }
        else {
            this.setState({
                ready: true,
                error: false,
                tableNumber: '',
            });
        }
    }

    removeTastingItem(item) {
        let services = this.state.services.slice();
        item.services.forEach(s => {
            let service = services.find(y => y.service_number == s.service_number);
            if (service) {
                s.products.forEach(p => {
                    let found = service.products.find(x => x.isTasting && x.product_id == p.product_id);
                    if (found) {
                        if (helper.getQuantityOfItemMinusReplacement(found) <= 0) {
                            found.replacements.find(x => x.quantity > 0).quantity--;
                        }
                        if (found.quantity > 1) {
                            found.quantity--;
                            // found.client_number = found.client_number.filter(x => x == this.selectedClient);
                        } else {
                            service.products = service.products.filter(x => x.product_id != p.product_id);
                        }
                    }
                });
            }
        });


        let deletedTastingHeader = [...this.state.deletedTastingHeader];
        let tasting_header = [...this.state.tasting_header];
        let tast = tasting_header.find(t => t.id == item.id);
        if (tast) {
            if (tast.quantity > 1) {
                tast.quantity--;
            }
            else {
                if (tast.oldQuantity > 0) {
                    deletedTastingHeader = [...deletedTastingHeader, { ...tast }];
                }
                tasting_header = tasting_header.filter(t => t.id != item.id);
            }
        }

        this.setState({
            services: services,
            selectedTab: 1,
            selectedSubTab: 1,
            tasting_header: tasting_header,
            deletedTastingHeader: deletedTastingHeader
        });
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
                    found.client_number = [...found.client_number, this.props.selectedClient];
                }
                else {
                    p.isTasting = true;
                    p.color = item.color;
                    p.quantity = 1;
                    p.dish_number = TableMenu.dish_number++;
                    p.tastingCategoryName = item.tasting_name;
                    p.client_number = [this.props.selectedClient];

                    service.products = [p, ...service.products];
                }
            });
        });


        let tasting_header = [...this.state.tasting_header];
        let tast = tasting_header.find(t => t.id == item.id);
        if (tast) {
            tast.quantity++;
        }
        else {
            tasting_header = [...tasting_header, { ...item, quantity: 1, oldQuantity: 0 }];
        }

        this.setState({
            services: services,
            selectedTab: 1,
            selectedSubTab: 1,
            tasting_header: tasting_header
        });
    }

    handleAddNormalItem(item) {
        item.dish_number = Api.guid();
        item.client_number = [this.props.selectedClient];
        item.quantity = 1;

        if (item.isBar) {
            this.setState({ barItems: [...this.state.barItems, item], selectedTab: 1, selectedSubTab: 2 });
        }
        else {
            let services = this.state.services.slice();
            if (!services || services.length == 0)
                services = [{ service_number: 1, products: [item] }];
            else
                services.find(y => y.service_number == this.state.selectedService).products.push(item);

            this.setState({ services: services, selectedTab: 1, selectedSubTab: 1 });
        }
    }

    fetchData() {
        this.setState({ ready: false, error: false });

        Api.getOrder(this.props.id)
            .then(async x => {
                if (!x.services) {
                    x.services = [];
                }

                x.services.forEach(s => s.products = this.fixListProducts(s.products));

                let tasting_header = [];
                if (x.tastings_services || x.tastings_header) {
                    let tastingItemsServices = await Api.getTasting();
                    if (x.tastings_services) {
                        for (const ts of this.addMissingPropertiesToTastingItem(tastingItemsServices, x.tastings_services)) {
                            let service = x.services.find(s => s.service_number == ts.service_number);
                            if (!service) {
                                service = { service_number: ts.service_number, products: [] };
                                x.services.push(service);
                            }
                            service.products = [...service.products, ...this.fixListProducts(ts.products, true)];
                        }
                    }

                    tasting_header = x.tastings_header.map(x => {
                        let item = tastingItemsServices.find(y => y.id == x.tasting_id);
                        return {
                            ...item,
                            quantity: x.tasting_count || 1,
                            oldQuantity: x.tasting_count || 1,
                        }
                    });
                }

                this.setState({
                    ready: true,
                    error: false,
                    tableNumber: x.table_number,
                    note: x.note,
                    services: x.services,
                    barItems: this.fixListProducts(x.bar),
                    tasting_header: tasting_header,
                });
            }).catch(error => {
                alert('Order\n' + error.message);
                this.setState({ ready: true, error: true });
            });
    }

    addMissingPropertiesToTastingItem(rawTastingServicesFromApi, servicesWithtastingItemsFromOrder) {
        let services = [...servicesWithtastingItemsFromOrder];
        for (const t of rawTastingServicesFromApi) {
            for (const s of t.services) {
                let service = services.find(x => x.service_number == s.service_number)
                if (!service)
                    continue;
                for (const p of s.products) {
                    let product = service.products.find(x => x.id == p.product_id);
                    if (product) {
                        product.product_id = product.id;
                        product.color = product.category_color;
                        product.product_name = product.tasting_name;
                        product.unique_id = p.unique_id,
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
            let product_optionals = [];
            p.product_optionals.forEach(x => x.forEach(y => product_optionals.push({ ...y })));
            p.product_optionals = product_optionals;
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
        (p1, p2) => p1.client_number && p2.client_number && (
            p1.client_number.length != p2.client_number.length ||
            p1.client_number.findIndex(c => p2.client_number.findIndex(x => x == c) == -1) != -1
        ),
        (p1, p2) => !((p1.product_optionals && p2.product_optionals) || (!p1.product_optionals && !p2.product_optionals)),
        (p1, p2) => p1.product_optionals && p2.product_optionals && (
            p1.product_optionals.length != p2.product_optionals.length ||
            p1.product_optionals.findIndex(c => p2.product_optionals.findIndex(x => x.id == c.id) == -1) != -1
        ),

        (p1, p2) => !((p1.product_customizes && p2.product_customizes) || (!p1.product_customizes && !p2.product_customizes)),
        (p1, p2) => p1.product_customizes && p2.product_customizes && (
            p1.product_customizes.length != p2.product_customizes.length ||
            p1.product_customizes.findIndex(c => p2.product_customizes.findIndex(x => x.id == c.id) == -1) != -1
        ),
    ];

    isSameProducts(p1, p2) {
        for (const rule of TableMenu.unsimilarityRules) {
            if (rule(p1, p2)) {
                return false;
            }
        }
        return true;
    }

    fillMissingDateForProducts(p, products) {
        let pt = products.find(x => x.unique_id != p.unique_id && this.isSameProducts(x, p));
        if (pt) {
            pt.quantity++;
            pt.uniques = [...pt.uniques, p.unique_id];
        }
        else {
            products.push({
                ...p,
                dish_number: Api.guid(),
                quantity: 1,
                uniques: [p.unique_id],
            });
        }
    }

    extractClient(services) {
        let clients = [];
        services.forEach(s => {
            s.products.forEach(p => {
                if (p.client_number) {
                    p.client_number.forEach(c => {
                        let f = clients.find(x => x.client_number == c);
                        if (f != null) {
                            f.products.push({ ...p });
                        } else {
                            clients.push({ client_number: c, products: [{ ...p }] });
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
        let { product_customizes, product_optionals, client_number, discount, discountType, note } = newItem;
        oldItem.client_number = [...client_number];
        oldItem.discount = discount;
        oldItem.discountType = discountType;
        oldItem.note = note;
        oldItem.product_customizes = [...product_customizes];
        oldItem.product_optionals = [...product_optionals];
    }

    renderProduct(x, type, serviceNumber) {
        if (x.isTasting) {
            return this.renderTastingItemWithReplacements(x, serviceNumber);
        }

        let details = [];
        if (x.discount && x.discount > 0)
            details.push(x.discountType + '' + x.discount + ' off');
        if (x.product_customizes) {
            details = [...details, ...x.product_customizes.map(c => c.custom_name)];
        }
        if (x.product_optionals) {
            x.product_optionals.forEach(x => details.push(x.option_name));
        }

        if (x.note)
            details.push(x.note);

        let isFound = type == 'service' && this.isItemSelected(x.dish_number);

        let isServed = x.isServed != 0;
        let served_date = isServed == false || x.served_date == null ? '' : ' - ' + helper.getTime(x.served_date);

        return <ItemButton
            key={x.dish_number}
            ref={ref => this.lastProductAdd = ref}
            onLayout={event => this.onProductLayout(event, type == 'service' ? serviceNumber : null)}
            title={x.en_name + served_date}
            details={details}
            clients={x.client_number || []}
            onAddOrRemove={isServed ? null : v => this.changeItemQuantity(x.dish_number, v)}

            onRecall={isServed ? this.onRecallItemPress.bind(this, x, type, serviceNumber) : null}

            quantity={x.quantity}
            color={x.color || x.category_color}
            onDelete={() => this.deleteItem(x.dish_number)}
            isSelected={isFound || isServed}
            onPressMid={this.onItemPressMid.bind(this, x, isFound, type)}
        />;
    }
    onItemPressMid(x, isFound, type) {
        if (x.isServed && x.isServed != 0)
            return;

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
    }
    onRecallItemPress(item, type, serviceNumber) {
        let newItem = {
            ...item,
            dish_number: Api.guid(),
            isServed: 0,
            served_date: null,
        };

        if (type == 'service') {
            let services = [...this.state.services];
            let service = services.find(x => x.service_number == serviceNumber);
            service.products.push(newItem);
            this.setState({ services });
        }
        else if (type == 'bar') {
            this.setState({ barItems: [...this.state.barItems, newItem] });
        }
    }

    renderTastingItemWithReplacements(x, serviceNumber) {
        let tastingItems = [];

        let xquantity = helper.getQuantityOfItemMinusReplacement(x);
        if (xquantity > 0) {
            tastingItems = [
                <View key={x.dish_number} style={{ width: '30%' }}>
                    <ItemButton
                        title={x.product_name || x.tasting_name}
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
                            title={r.product_name || r.tasting_name}
                            quantity={r.quantity}
                            showCount
                            color={'#66c4ff'}
                            onPressMid={() => this.handelTastingItemPress(x, serviceNumber)}
                            isSelected
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
                tastingItems: [...this.state.tasting_header],
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
    }

    getServiceNumberOfProduct(dish_number) {
        let serv = this.state.services.find(s => s.products.findIndex(y => y.dish_number == dish_number) != -1);
        if (!serv)
            return null;
        return serv.service_number;
    }

    deleteItem(dish_number) {
        let item = this.getProductByDishNumber(dish_number);
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
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                {
                                    this.state.tasting_header.map(t => <ItemButton key={t.id}
                                        quantity={t.quantity}
                                        showCount
                                        onAddOrRemove={(v, factor) => {
                                            if (factor == +1) {
                                                this.handleAddTastingItem(t);
                                            }
                                            else {
                                                this.removeTastingItem(t);
                                            }
                                        }}
                                        title={t.tasting_name}
                                        color={t.color}
                                    />
                                    )
                                }
                            </View>
                            {this.renderServices(this.state.services)}
                        </View>
                        :
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                            {this.state.barItems.map(x => this.renderProduct(x, 'bar'))}
                        </View>
                }
            </View>
        );
    }

    changeServiceCallStatusToCalled(service_number) {
        let services = [...this.state.services];
        let service = services.find(x => x.service_number == service_number);


        service.service_status = 'Called';
        service.call_date = 'dd-mm-yyyy ' + new Date(Date.now()).toTimeString();

        this.setState({ services });
    }
    changeServiceCallStatusToCalledForAll(service_number) {
        let services = [...this.state.services];
        for (const service of services) {
            if (service.service_number > service_number || service.service_status == 'Called') {
                continue;
            }
            service.service_status = 'Called';
            service.call_date = 'dd-mm-yyyy ' + new Date(Date.now()).toTimeString();
            if (service.service_number == service_number) {
                break
            }
        }
        this.setState({ services });
    }
    callServiceClicked(service_number) {
        Api.callService(this.props.id, service_number)
            .then(ok => this.changeServiceCallStatusToCalled(service_number))
            .catch(error => alert(error.message))
    }
    mergeServiceClicked(service_number) {
        Api.callService(this.props.id, service_number)
            .then(ok => this.changeServiceCallStatusToCalledForAll(service_number))
            .catch(error => alert(error.message))
    }

    renderServices(services) {
        let arrangeItemsEnable = this.state.arrangeItems == true;
        let dashedBorderStyle = arrangeItemsEnable ? { borderStyle: 'dashed', borderColor: '#eee', borderWidth: 3, margin: 4 } : {};

        return services.map(s => {
            return (
                <View style={{ ...dashedBorderStyle, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}
                    key={s.service_number} onLayout={event => this.handelServiceLayout(s.service_number, event)}
                >

                    <View style={{ margin: 6 }}>
                        <View style={{ backgroundColor: '#f5f5f5', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            {
                                s.service_status == 'ToBeCall' &&
                                <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}
                                    onPress={this.mergeServiceClicked.bind(this, s.service_number)}>
                                    <FAIcon name='plus' style={{ color: '#eea236' }} />
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={{ flex: 2, justifyContent: 'center', alignItems: 'center', padding: 10 }}
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
                                s.service_status == 'ToBeCall' &&
                                <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 10 }}
                                    onPress={this.callServiceClicked.bind(this, s.service_number)}>
                                    <FAIcon name='concierge-bell' style={{ color: '#28a745' }} />
                                </TouchableOpacity>
                            }
                            {
                                s.service_status == 'Called' &&
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 10 }}>
                                    <Text style={{ color: '#28a745' }}>
                                        {s.call_date ? helper.getTime(s.call_date) : 'Called'}
                                    </Text>
                                </View>
                            }
                        </View>
                        {
                            arrangeItemsEnable &&
                            <TouchableOpacity style={{ backgroundColor: '#ddd', padding: 6, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => this.toggleSelectionForItemOfService(s.service_number)}>
                                <Text style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center', fontSize: 12 }}>Select All</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                            {s.products.filter(x => x.isTasting).map(x => this.renderProduct(x, 'service', s.service_number))}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                        {s.products.filter(x => !x.isTasting).map(x => this.renderProduct(x, 'service', s.service_number))}
                    </View>
                </View>
            )
        })
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
        if (!this.state.tableNumber) {
            return new Promise(() => { throw 'choose table number first' });
        }

        let status = this.state.hold ? 'hold' : 'active';

        this.deleted_items = [];
        let order = {
            table_number: this.state.tableNumber,
            status: status,
            type: 'postpaid',
            note: this.state.note,

            bar: this.buildProducts(this.state.barItems),

            services: this.state.services
                //.filter(x => x.products && x.products.length > 0 && x.products.filter(y => !y.isTasting).length > 0)
                .map(x => ({
                    service_number: x.service_number,
                    products: this.buildProducts(x.products.filter(y => !y.isTasting)),
                    isNew: x.isNew == true,
                })),

            tastings: this.buildTastingProduct(),
        }
        this.deleted_items = [...this.deleted_items, ...this.state.deleted_items];
        console.log('---------------- order --')
        console.log({ deleted_items: [...this.deleted_items], order });
        console.log('------------------');

        //return new Promise(() => { throw 'mock api' });

        if ((order.services && order.services.length > 0) ||
            (order.bar && order.bar.length > 0) ||
            (order.tastings && order.tastings.length > 0)) {

            if (this.props.id)
                return Api.editOrder(this.props.id, { deleted_items: [...this.deleted_items], ...order })
                    .then(x => alert('order successfully saved'));
            else
                return Api.postOrder(order).then(x => alert('order successfully saved'));
        }
        else {
            return new Promise(() => { throw 'add items to the order first' });
        }
    }

    buildTastingProduct() {
        let res = [];
        this.state.deletedTastingHeader.forEach(x => {
            for (let i = 0; i < x.oldQuantity; i++) {
                res.push({
                    tasting_id: x.id,
                    isDeleted: true,
                });
            }
        });

        this.state.tasting_header.forEach(x => {
            if (x.oldQuantity == x.quantity) {
                for (let i = 0; i < x.quantity; i++) {
                    res.push({
                        tasting_id: x.id,
                        replacements: this.buildReplacementOfTastingProduct(x),
                    });
                }
            } else if (x.oldQuantity < x.quantity) {
                for (let i = 0; i < x.oldQuantity; i++) {
                    res.push({
                        tasting_id: x.id,
                        replacements: this.buildReplacementOfTastingProduct(x),
                    });
                }
                for (let i = 0; i < (x.quantity - x.oldQuantity); i++) {
                    res.push({
                        tasting_id: x.id,
                        isNew: true,
                        replacements: this.buildReplacementOfTastingProduct(x),
                    });
                }
            }
            else if (x.oldQuantity > x.quantity) {
                for (let i = 0; i < x.quantity; i++) {
                    res.push({
                        tasting_id: x.id,
                        replacements: this.buildReplacementOfTastingProduct(x),
                    });
                }
                for (let i = 0; i < (x.oldQuantity - x.quantity); i++) {
                    res.push({
                        tasting_id: x.id,
                        isDeleted: true,
                    });
                }
            }
        });

        return res;
    }

    buildReplacementOfTastingProduct(item) {
        let replacements = [];
        item.services.forEach(s => {
            let service = this.state.services.find(x => x.service_number == s.service_number);
            s.products.forEach(p => {
                let product = service.products.find(x => x.isTasting == true && x.product_id == p.product_id);
                let choosenReplacements = product.replacements.filter(x => x.quantity > 0) || [];
                choosenReplacements.forEach(r => {
                    for (let i = 1; i <= r.quantity; i++) {
                        replacements.push(JSON.parse('{"' + p.unique_id + '":' + r.id + '}'));
                    }
                });
            });
        });
        return replacements;
    }

    deleted_items = [];
    buildProducts(products) {
        let result = [];

        products.forEach(p => {
            let uniqueStack = this.handelQuantityForProduct(p, result, [...(p.uniques || [])]);

            if (uniqueStack && uniqueStack.length > 0) {
                this.deleted_items = [...this.deleted_items, ...uniqueStack];
            }
        });

        return result;
    }

    handelQuantityForProduct(product, resultList, uniqueStack) {
        let count = product.quantity || 1;
        while (count > 0) {
            resultList.push(this.buildProductDataToSend(product, uniqueStack.shift() || null));
            count--;
        }
        return uniqueStack;
    }

    buildProductDataToSend(product, unique_id = null) {
        let product_customizes = [];
        if (product.product_customizes) {
            product.product_customizes.forEach(c => product_customizes.push(c.id));
        }

        let product_optionals = [];
        if (product.product_optionals) {
            product.product_optionals.forEach(c => product_optionals.push(c.id));
        }

        let obj = {
            product_id: product.id,
            client_number: [...product.client_number],
            note: product.note || '',
            // discount: product.discount || 0,
            // isTasting: product.isTasting || false,
            product_customizes: product_customizes,
            product_optionals: product_optionals,
        };

        if (unique_id && unique_id > 0) {
            obj.unique_id = unique_id;
        }

        return obj;
    }

    render() {

        if (this.state.ready == false) {
            return <Loader />;
        }

        if (this.state.error == true) {
            return <ReloadBtn onReload={() => this.fetchData()} />;
        }

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

            let nextServiceNo = 1;
            if (state.services.length > 0) {
                nextServiceNo = state.services[state.services.length - 1].service_number + 1;
            }

            return {
                services: [
                    ...state.services,
                    {
                        service_number: nextServiceNo,
                        products: [],
                        isNew: true,
                    }],
                selectedService: nextServiceNo,
            }
        });
    }

    renderTotal() {
        let subtotal = 0,
            taxes = 0,
            total = 0;

        this.state.services.forEach(s => {
            s.products.forEach(p => {
                if (!p.isTasting) {
                    subtotal += (parseInt(p.price || 0) * parseInt(p.quantity > 0 ? p.quantity : 1));
                }
            });
        });
        this.state.barItems.forEach(p => {
            subtotal += (parseInt(p.price || 0) * parseInt(p.quantity > 0 ? p.quantity : 1));
        });

        this.state.tasting_header.forEach(p => {
            subtotal += (parseInt(p.price || 0) * parseInt(p.quantity > 0 ? p.quantity : 1));
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
