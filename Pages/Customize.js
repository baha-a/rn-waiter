import React, { Component } from 'react'
import { Text, View, TextInput, ScrollView, TouchableOpacity, Picker } from 'react-native'
import Api from '../api';
import Selectable from '../Components/Selectable';
import DiscountInput from '../Components/DiscountInput';
import { Actions } from 'react-native-router-flux';
import Loader from '../Components/Loader';
import ReloadBtn from '../Components/ReloadBtn';
import DiscountWeightBtns from '../Components/DiscountWeightBtns';

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
        } = props.item;

        let {
            selectedService,
            allClients = []
        } = props;

        this.state = {
            isBar: isBar,

            selectedOptions: product_customizes.slice(),
            selectedClient: clients.slice(),
            clients: allClients.slice(),
            options: [],

            discount: discount,
            discountType: discountType,
            weight: 0,

            selectedService: selectedService,

            otherOptions: [
                'Quickly !',
                'Well cooked',
                'Half cooked',
                'Extral For All',
                'Extra Fried Potatoes',
                'Without Mayonnaise For All',
            ],
            selectedOtherOption: '',
            note: note,

            selectedTab: 'component',


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
                    if (this.state.selectedOptions && this.state.selectedOptions.length > 0) {
                        let ops = [];
                        this.state.selectedOptions.forEach(x => {
                            if (typeof x === 'string') {
                                let t = result.find(y => y.custom_name == x);
                                if (t) ops.push(t.id);
                            }
                        });
                        this.setState({ selectedOptions: ops });
                    }

                    this.setState({ options: result, ready: true, error: false });
                }
            })
            .catch(x => this.setState({ ready: true, error: true }));
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
            this.props.onSave({
                options: this.state.selectedOptions.slice(),
                clients: this.state.selectedClient.slice(),
                discountType: this.state.discountType,
                discount: this.state.discount,

                service: this.state.selectedService,
                note: this.state.note,

                item: this.props.item,
            });
        }
        Actions.pop();
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
        return (<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', margin: 2, padding: 4, }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{this.props.item.en_name} Customize</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start', }}>
                {
                    (this.state.isBar == false && this.props.services && this.props.services.length > 0) &&
                    <Picker
                        selectedValue={this.state.selectedService}
                        mode='dropdown'
                        style={{ width: 130, backgroundColor: '#6c757d', borderRadius: 6, }}
                        onValueChange={(value, index) => this.setState({ selectedService: value })}>
                        {this.props.services.map(x => <Picker.Item key={x} label={'Service #' + x} value={x} />)}
                    </Picker>
                }
                <TouchableOpacity style={{ backgroundColor: '#3e3e3e', padding: 14, margin: 4 }}
                    onPress={() => this.setState({ selectedTab: 'clients' })}>
                    <Text style={{ color: '#fff' }}>Clients</Text>
                </TouchableOpacity>
            </View>
        </View>);
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                    {this.renderTitleBar()}
                    {this.renderContent()}
                </View>
                {this.renderSaveAndCancel()}
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

    renderContent() {
        let content = null;
        switch (this.state.selectedTab) {
            case 'clients':
                content = (
                <View>
                    <Text style={{ color:'#6c757d'}}>Click On Clients To Share Item Between Them</Text>
                    <View style={{ padding:10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {
                            this.state.clients.map(x => <Selectable key={x}
                                title={'#' + x}
                                onSelect={(value) => this.toggleSelectForClient(x, value)}
                                selected={this.isSelectedForClient(x)}
                            />)
                        }
                    </View>
                </View>);
                break;
            case 'discount':
                content = <DiscountWeightBtns
                    unit='%'
                    options={[100, 50, 25, 10, 5]}
                    validateValue={v => v <= 100}
                    onValueChange={v => this.setState({ discount: v })}
                    value={this.state.discount}
                />;
                break;
            case 'weight':
                content = <DiscountWeightBtns
                    unit='kg'
                    options={[2, 1, 0.5, 0.25, 0.2]}
                    onValueChange={v => this.setState({ weight: v })}
                    value={this.state.weight}
                />;
                break;
            case 'component':
                if (this.state.ready == false) {
                    content = <Loader />
                } else if (this.state.error) {
                    content = <ReloadBtn onReload={() => { this.setState({ ready: false, error: false }); this.fetchData(); }} />
                } else {
                    content = (<View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 10, }}>
                        <View style={{ flex: 0.3, flexDirection: 'column', padding: 10, }}>
                            <Picker
                                selectedValue={this.state.selectedOtherOption}
                                mode='dropdown'
                                style={{ width: 130, backgroundColor: '#ffc107', borderColor: '#eee', borderWidth: 1, margin: 6, borderRadius: 6 }}
                                onValueChange={(value, index) => this.setState({ selectedOtherOption: value })}>
                                {this.state.otherOptions.map(x => <Picker.Item key={x} label={x} value={x} />)}
                            </Picker>
                            <TextInput
                                disableFullscreenUI
                                underlineColorAndroid='rgba(0,0,0,0)'
                                style={{ backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, margin: 6, borderRadius: 4, padding: 6, textAlignVertical: 'top' }}
                                multiline
                                numberOfLines={6}
                                placeholder='Notes'
                                onChangeText={(text) => this.setState({ note: text })}
                                value={this.state.note} />
                        </View>
                        <View style={{ width: 1, backgroundColor: '#999' }}>

                        </View>
                        <View style={{ flex: 0.65, padding: 10, }}>
                            <Text> Optional </Text>
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
                {this.tabBtn('weight')}
                {this.tabBtn('discount')}
            </View>
            <ScrollView contentContainerStyle={{ padding: 10, }}>
                {content}
            </ScrollView>
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
