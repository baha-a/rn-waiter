import React, { Component } from 'react'
import { Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Api from '../api';
import Selectable from '../Components/Selectable';
import { Actions } from 'react-native-router-flux';
import Loader from '../Components/Loader';
import ReloadBtn from '../Components/ReloadBtn';
import OptionPad from '../Components/OptionPad';
import FAIcon from '../Components/FAIcon';
import { Picker } from 'native-base';

export default class Customize extends Component {
    constructor(props) {
        super(props);

        let {
            clients = [],
            product_customizes,
            discount = 0,
            discountType = '%',
            isBar = false,
            note = '',
            description = '',
        } = props.item;

        if (props.item.product_customizes) {
            console.log('----=-=-=-=-=-=-=-')
            console.log(props.item.product_customizes);

            product_customizes.customizes = props.item.product_customizes.customizes ? [...props.item.product_customizes.customizes] : [];
            product_customizes.optional = props.item.product_customizes.optional ? [...props.item.product_customizes.optional] : [];
            product_customizes.cookWays = props.item.product_customizes.cookWays ? props.item.product_customizes.cookWays.id : null;
        }
        else {
            product_customizes = {
                customizes: [],
                optional: [],
                cookWays: null,
            };
        }

        let {
            selectedService,
            table = 0,
        } = props;

        let allClients = [];
        if (clients && clients.length > 1) {
            let max = clients[clients.length - 1];
            for (let i = 1; i <= max; i++) {
                allClients.push(i);
            }
        } else {
            for (let i = 1; i <= 10; i++) {
                allClients.push(i);
            }
        }

        this.state = {
            isBar: isBar,

            selectedOptional: product_customizes.optional || [],
            selectedCustomize: product_customizes.customizes || [],
            selectedCookWays: product_customizes.cookWays,

            selectedClient: clients.map(x => ({ id: x })),
            clients: allClients.map(x => ({ id: x })),
            options: [],

            discount: discount,
            discountType: discountType,

            description: description,

            selectedService: selectedService,

            note: note,

            selectedTab: 'component',

            tables: [],
            table: table,
            newTable: null,

            ready: false,
            error: false,
        };

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);

        this.isSelectedForClient = this.isSelectedForClient.bind(this);
        this.isSelectedForCustomize = this.isSelectedForCustomize.bind(this);
        this.isSelectedForOptional = this.isSelectedForOptional.bind(this);
        //this.isSelectedForCG = this.isSelectedForCG.bind(this);
        this.isSelectedFor = this.isSelectedFor.bind(this);
        this.toggleSelectForClient = this.toggleSelectForClient.bind(this);
        this.toggleSelectForCustomize = this.toggleSelectForCustomize.bind(this);
        this.toggleSelectForOptional = this.toggleSelectForOptional.bind(this);
        //this.toggleSelectForCG = this.toggleSelectForCG.bind(this);
        this.toggleSelectFor = this.toggleSelectFor.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        Api.getCustomizes(this.props.item.id)
            .then(result => {
                if (result) {
                    let selectedCustomize = [];
                    if (this.state.selectedCustomize && this.state.selectedCustomize.length > 0) {
                        this.state.selectedCustomize.forEach(x => {
                            if (typeof x === 'string') {
                                let t = result.find(y => y.custom_name == x);
                                if (t) {
                                    selectedCustomize.push(t);
                                }
                            }
                            else {
                                selectedCustomize.push(x);
                            }
                        });
                    }

                    console.log('-------------');
                    console.log(selectedCustomize);

                    console.log('-------------');
                    console.log(this.state.selectedCustomize);

                    this.setState({
                        options: result,
                        selectedCustomize: selectedCustomize,
                        ready: true,
                        error: false
                    });
                }
            })
            .catch(x => this.setState({ ready: true, error: true }));

        Api.getTableNumbers().then(x => this.setState({ tables: x }));
    }



    isSelectedForClient(x) {
        return this.isSelectedFor(x, 'Client')
    }
    isSelectedForCustomize(x) {
        return this.isSelectedFor(x, 'Customize')
    }
    isSelectedForOptional(x) {
        return this.isSelectedFor(x, 'Optional')
    }
    // isSelectedForCG(x) {
    //     return this.isSelectedFor(x, 'CG')
    // }
    isSelectedFor(x, type) {
        return this.state['selected' + type].findIndex(y => y.id == x.id) != -1;
    }

    toggleSelectForClient(x, value) {
        this.setState({ selectedClient: this.toggleSelectFor(x, value, 'Client') })
    }
    toggleSelectForCustomize(x, value) {
        this.setState({ selectedCustomize: this.toggleSelectFor(x, value, 'Customize') })
    }
    toggleSelectForOptional(x, value) {
        this.setState({ selectedOptional: this.toggleSelectFor(x, value, 'Optional') })
    }
    // toggleSelectForCG(x, value) {
    //     this.setState({ selectedCG: this.toggleSelectFor(x, value, 'CG') })
    // }
    toggleSelectFor(x, value, type) {
        let list = this.state['selected' + type].slice();
        if (value) {
            if (this['isSelectedFor' + type](x))
                return;
            list.push(x);
        }
        else {
            list = list.filter(y => y.id != x.id);
        }

        return list;
    }


    cancel() {
        Actions.pop();
    }

    getSelectedCookWakObject() {
        if (this.state.options.cookWays) {
            let obj = null;
            for (const i of this.state.options.cookWays) {
                obj = i.items.find(x => x.id == this.state.selectedCookWays);
                if (obj) {
                    return obj;
                }
            }
        }
        return null;
    }

    save() {
        if (this.props.onSave) {
            this.props.onSave(this.getFinalResult());
        }
        Actions.pop();
    }

    getFinalResult() {
        return {
            clients: this.state.selectedClient.map(x => x.id),

            discountType: this.state.discountType,
            discount: this.state.discount,

            service: this.state.selectedService,
            note: this.state.note,
            newTable: this.state.newTable,
            product_customizes: {
                optional: this.state.selectedOptional.slice() || [],
                customizes: this.state.selectedCustomize.slice() || [],
                cookWays: this.getSelectedCookWakObject(),
            },

            item: this.props.item,
        };
    }

    renderTitleBar() {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', margin: 2, padding: 4, }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{this.props.item.en_name} Customize</Text>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'stretch', }}>
                    <View style={{ flex: 1, margin: 4 }}>
                        <TouchableOpacity style={{ flex: 1, backgroundColor: '#dae0e5', padding: 6, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}
                            onPress={() => this.setState({ selectedTab: 'tables' })}>
                            <Text>Table #{(this.state.newTable && this.state.newTable.table_number) || this.state.table}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, margin: 4 }}>
                        {
                            (this.state.isBar == false && this.props.services && this.props.services.length > 0) &&
                            <Picker
                                mode='dropdown'
                                style={{ flex: 1, backgroundColor: '#6c757d', padding: 6, }}
                                selectedValue={this.state.selectedService}
                                onValueChange={(value, index) => this.setState({ selectedService: value })}>
                                {this.props.services.map(x => <Picker.Item key={x} label={'Service #' + x} value={x} />)}
                            </Picker>
                        }
                    </View>
                    <View style={{ flex: 1, margin: 4 }}>
                        <TouchableOpacity style={{ flex: 1, backgroundColor: '#3e3e3e', padding: 6, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}
                            onPress={() => this.setState({ selectedTab: 'clients' })}>
                            <Text style={{ color: '#fff' }}>Clients</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>);
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#fff' }}>
                <ScrollView>
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                        {this.renderTitleBar()}
                        {this.renderContent()}
                    </View>
                    {this.renderSaveAndCancel()}
                </ScrollView>
            </View >
        )
    }

    renderSaveAndCancel() {
        return (<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#eee' }}>
            <TouchableOpacity style={{ backgroundColor: 'red', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, }} onPress={this.cancel}>
                <Text style={{ color: '#fff' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: 'green', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, }} onPress={this.save}>
                <Text style={{ color: '#fff' }}>Save</Text>
            </TouchableOpacity>
        </View>);
    }

    isSelectedTableNumber(table_number) {
        if (this.state.newTable)
            return this.state.newTable.table_number == table_number;
        return this.state.table == table_number;
    }

    renderContent() {
        let content = null;
        switch (this.state.selectedTab) {
            case 'tables':
                content = (
                    <View>
                        <Text style={{ color: '#6c757d' }}>Choose Table To Move Item To Another Table</Text>
                        <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            {
                                this.state.tables.map(x =>
                                    <TouchableOpacity key={x.id}
                                        style={{
                                            margin: 4, padding: 10,
                                            backgroundColor: this.isSelectedTableNumber(x.table_number) ? '#48f' : 'rgba(0, 0, 0, .125)'
                                        }}
                                        onPress={() => this.setState({ newTable: x })}
                                    >
                                        <Text>{'#' + x.table_number}</Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>);
                break;
            case 'clients':
                content = (
                    <View>
                        <Text style={{ color: '#6c757d' }}>Click On Clients To Share Item Between Them</Text>
                        <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            {
                                this.state.clients.map(x => <Selectable key={x.id}
                                    title={'#' + x.id}
                                    onSelect={(value) => this.toggleSelectForClient(x, value)}
                                    selected={this.isSelectedForClient(x)}
                                />)
                            }
                            <TouchableOpacity style={{ padding: 10, margin: 6, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}
                                onPress={() => {
                                    let last = 0, clients = this.state.clients.slice();
                                    if (clients && clients.length > 0)
                                        last = clients[clients.length - 1].id;
                                    for (let i = 0; i < 10; i++)
                                        clients.push({ id: ++last });

                                    this.setState({ clients: clients });
                                }}>
                                <FAIcon name='plus' />
                            </TouchableOpacity>
                        </View>
                    </View>);
                break;
            case 'discount':
                content = <OptionPad
                    key={1}
                    unit='%'
                    options={[100, 50, 25, 10, 5]}
                    validateValue={v => v <= 100}
                    onValueChange={v => this.setState({ discount: v })}
                    value={this.state.discount}
                />;
                break;
            case 'component':
                if (this.state.ready == false) {
                    content = <Loader />
                } else if (this.state.error) {
                    content = <ReloadBtn onReload={() => { this.setState({ ready: false, error: false }); this.fetchData(); }} />
                } else {
                    content = (
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 10, }}>
                            <View style={{ flex: 0.3, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', padding: 10, }}>
                                <View>
                                    <Picker
                                        selectedValue={this.state.selectedCookWays}
                                        mode='dropdown'
                                        style={{ backgroundColor: '#ffc107', borderColor: '#eee', borderWidth: 1, margin: 6, borderRadius: 6 }}
                                        onValueChange={(value, index) => this.setState({ selectedCookWays: value })}>
                                        <Picker.Item key={-1} label='select cook way' value={null} />
                                        {
                                            this.state.options.cookWays.map(y =>
                                                y.items.map(x => <Picker.Item key={x.id} label={x.custom_name} value={x.id} />)
                                            )
                                        }
                                    </Picker>
                                </View>
                                <View>
                                    <TextInput
                                        style={{ backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, margin: 6, borderRadius: 4, padding: 6, textAlignVertical: 'top' }}
                                        disableFullscreenUI
                                        underlineColorAndroid='rgba(0,0,0,0)'
                                        multiline
                                        numberOfLines={6}
                                        placeholder='Note'
                                        onChangeText={(text) => this.setState({ note: text })}
                                        value={this.state.note}
                                    />
                                </View>
                            </View>
                            <View style={{ width: 1, backgroundColor: '#999' }}>

                            </View>
                            <View style={{ flex: 0.65, padding: 10, }}>
                                <Text style={{ color: '#666666' }}>Basic</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', }}>
                                    {
                                        this.state.options.basic.map(b => <Text key={b.id}
                                            style={{ margin: 6, padding: 12, backgroundColor: '#f8f9fa' }}>
                                            {b.basic_name}
                                        </Text>)
                                    }
                                </View>

                                <Text style={{ color: '#666666', paddingTop: 10, }}>Optionals</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', }}>
                                    {
                                        this.state.options.optional.map(x => <Selectable key={x.id}
                                            title={x.option_name}
                                            onSelect={(value) => this.toggleSelectForOptional(x, value)}
                                            selected={this.isSelectedForOptional(x)}
                                        />)
                                    }
                                </View>

                                <Text style={{ color: '#666666', paddingTop: 10, }}>Customize</Text>
                                {
                                    this.state.options.customizes &&
                                    this.state.options.customizes.map(y =>
                                        <View key={y.id} style={{ backgroundColor: '#eee', margin: 6 }}>
                                            <Text>{y.group_name}</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', }}>
                                                {
                                                    y.items.map(x => <Selectable key={x.id}
                                                        title={x.custom_name}
                                                        onSelect={(value) => this.toggleSelectForCustomize(x, value)}
                                                        selected={this.isSelectedForCustomize(x)}
                                                    />)
                                                }
                                            </View>
                                        </View>
                                    )
                                }

                                <Text style={{ color: '#666666', paddingTop: 10, }}>Description</Text>
                                <Text style={{ padding: 6, backgroundColor: '#f8f9fa' }}>{this.state.description}</Text>
                            </View>
                        </View>);
                }
                break;
        }
        return (<View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', borderBottomColor: '#eee', borderBottomWidth: 1, paddingHorizontal: 10 }}>
                {this.tabBtn('component')}
                {this.tabBtn('discount')}
            </View>
            <View style={{ padding: 10, }}>
                {content}
            </View>
        </View>)
    }

    tabBtn(name) {
        let style = {};
        if (this.state.selectedTab == name) {
            style = {
                borderWidth: 1,
                borderColor: '#eee',
                backgroundColor: '#eee',
                borderBottomWidth: 0,
            };
        }
        return (
            <TouchableOpacity style={[{
                padding: 10,
                paddingHorizontal: 16,
            }, style]}
                onPress={() => this.setState({ selectedTab: name })}>
                <Text>{name}</Text>
            </TouchableOpacity>);
    }
}
