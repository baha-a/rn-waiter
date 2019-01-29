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
            product_customizes = [],
            discount = 0,
            discountType = '%',
            isBar = false,
            note = '',
            otherNote = '',
            description = '',
        } = props.item;

        let {
            selectedService,
            allClients = [],
            table = 0,
        } = props;

        this.state = {
            isBar: isBar,

            selectedOptions: product_customizes.slice(),
            selectedClient: clients.slice(),
            clients: allClients.slice(),
            options: [],

            discount: discount,
            discountType: discountType,

            description: description,

            selectedService: selectedService,

            otherOptions: [
                'Quickly !',
                'Well cooked',
                'Half cooked',
                'Extral For All',
                'Extra Fried Potatoes',
                'Without Mayonnaise For All',
            ],
            selectedOtherNote: otherNote,
            note: note,

            selectedTab: 'component',

            tables: [],
            table: table,
            newTable: null,

            ready: false,
            error: false,
        };

        this.toggleSelectForOption = this.toggleSelectForOption.bind(this);
        this.isSelectedForOption = this.isSelectedForOption.bind(this);

        this.toggleSelectForClient = this.toggleSelectForClient.bind(this);
        this.isSelectedForClient = this.isSelectedForClient.bind(this);

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount() {
        Api.getCustomizes(this.props.item.id)
            .then(result => {
                if (result) {
                    let selectedOptions = [];
                    if (this.state.selectedOptions && this.state.selectedOptions.length > 0) {
                        this.state.selectedOptions.forEach(x => {
                            if (typeof x === 'string') {
                                let t = result.find(y => y.custom_name == x);
                                if (t) {
                                    selectedOptions.push(t);
                                }
                            }
                            else {
                                selectedOptions.push(x);
                            }
                        });
                    }
                    this.setState({ options: result, selectedOptions: selectedOptions, ready: true, error: false });
                }
            })
            .catch(x => this.setState({ ready: true, error: true }));

        Api.getTableNumbers().then(x => this.setState({ tables: x }));
    }

    toggleSelectForOption(id, value) {
        if (value) {
            if (this.isSelectedForOption(id)) {
                return;
            }
            let options = this.state.selectedOptions.slice();
            options.push(this.state.options.find(x => x.id == id));
            this.setState({ selectedOptions: options });
        }
        else {
            let options = this.state.selectedOptions.filter(x => x.id != id);
            this.setState({ selectedOptions: options });
        }
    }

    isSelectedForOption(id) {
        return this.state.selectedOptions.findIndex(x => x.id == id) != -1;
    }


    cancel() {
        Actions.pop();
    }

    save() {
        if (this.props.onSave) {
            this.props.onSave(this.getFinalResult());
        }
        Actions.pop();
    }

    getFinalResult() {
        return {
            options: this.state.selectedOptions.slice(),
            clients: this.state.selectedClient.slice(),
            discountType: this.state.discountType,
            discount: this.state.discount,

            service: this.state.selectedService,
            note: this.state.note,
            otherNote: this.state.selectedOtherNote,

            newTable: this.state.newTable,

            item: this.props.item,
        };
    }


    toggleSelectForClient(id, value) {
        if (value) {
            if (this.isSelectedForClient(id)) {
                return;
            }
            let clients = this.state.selectedClient.slice();
            clients.push(id);
            this.setState({ selectedClient: clients });
        }
        else {
            let clients = this.state.selectedClient.filter(x => x != id);
            this.setState({ selectedClient: clients });
        }
    }

    isSelectedForClient(id) {
        return this.state.selectedClient.findIndex(x => x == id) != -1;
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
                                this.state.clients.map(x => <Selectable key={x}
                                    title={'#' + x}
                                    onSelect={(value) => this.toggleSelectForClient(x, value)}
                                    selected={this.isSelectedForClient(x)}
                                />)
                            }
                            <TouchableOpacity style={{ padding: 10, margin: 6, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}
                                onPress={() => {
                                    let last = 0, clients = this.state.clients.slice();

                                    if (clients && clients.length > 0)
                                        last = clients[clients.length - 1];
                                    for (let i = 0; i < 10; i++)
                                        clients.push(++last);

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
                            <View style={{ flex: 0.3, flexDirection: 'column', padding: 10, }}>
                                <Picker
                                    selectedValue={this.state.selectedOtherNote}
                                    mode='dropdown'
                                    style={{ backgroundColor: '#ffc107', borderColor: '#eee', borderWidth: 1, margin: 6, borderRadius: 6 }}
                                    onValueChange={(value, index) => this.setState({ selectedOtherNote: value })}>
                                    {this.state.otherOptions.map(x => <Picker.Item key={x} label={x} value={x} />)}
                                </Picker>
                                <TextInput
                                    disableFullscreenUI
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    style={{ backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, margin: 6, borderRadius: 4, padding: 6, textAlignVertical: 'top' }}
                                    multiline
                                    numberOfLines={6}
                                    placeholder='Note'
                                    onChangeText={(text) => this.setState({ note: text })}
                                    value={this.state.note} />
                            </View>
                            <View style={{ width: 1, backgroundColor: '#999' }}>

                            </View>
                            <View style={{ flex: 0.65, padding: 10, }}>
                                <Text style={{ color: '#666666' }}>Basic</Text>
                                <Text style={{ padding: 6, backgroundColor: '#f8f9fa' }}> basics</Text>

                                <Text style={{ color: '#666666', paddingTop: 10, }}>Description</Text>
                                <Text style={{ padding: 6, backgroundColor: '#f8f9fa' }}>{this.state.description}</Text>

                                <Text style={{ color: '#666666', paddingTop: 10, }}>Optionals</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', }}>
                                    {
                                        this.state.options.map(x => <Selectable key={x.id}
                                            title={x.custom_name}
                                            onSelect={(value) => this.toggleSelectForOption(x.id, value)}
                                            selected={this.isSelectedForOption(x.id)}
                                        />)
                                    }
                                </View>
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
