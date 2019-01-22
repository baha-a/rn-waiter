import React, { Component } from 'react'
import { Text, View, TextInput, ScrollView, TouchableOpacity, Picker } from 'react-native'
import Api from '../api';
import Selectable from '../Components/Selectable';
import DiscountInput from '../Components/DiscountInput';
import { Actions } from 'react-native-router-flux';

export default class Customize extends Component {
    constructor(props) {
        super(props);

        let {
            clients = [],
            product_customizes = [],
            discount = 0,
            discountType = '$',
        } = props.item;

        let {
            selectedService
        } = props;

        this.state = {
            selectedOptions: product_customizes.slice(),
            selectedClient: clients.slice(),
            clients: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            options: [],

            discount: discount,
            discountType: discountType,

            selectedService: selectedService,

            otherOptions: ['option 1', 'option 2', 'option 3', 'option 4', 'option 5', 'option 6', 'option 7',],
            selectedOtherOption: 'option 1',
            notes: '',
        };

        this.toggleSelectForOption = this.toggleSelectForOption.bind(this);
        this.isSelectedForOption = this.isSelectedForOption.bind(this);

        this.toggleSelectForClient = this.toggleSelectForClient.bind(this);
        this.isSelectedForClient = this.isSelectedForClient.bind(this);

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount() {
        Api.getCustomizes(this.props.item.id).then(result => { if (result) this.setState({ options: result }); });
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

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
                <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', margin: 2, padding: 4, }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{this.props.item.en_name} Customize</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start', }}>
                        <Picker
                            selectedValue={this.state.selectedService}
                            mode='dropdown'
                            style={{ width: 130, backgroundColor: '#6c757d', }}
                            onValueChange={(value, index) => this.setState({ selectedService: value })}>
                            {this.props.services.map(x => <Picker.Item key={x} label={'Service #' + x} value={x} />)}
                        </Picker>

                        <TouchableOpacity style={{ backgroundColor: '#3e3e3e', padding: 6, margin: 4 }}>
                            <Text style={{ color: '#fff' }}>Clients</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 10, }}>
                        <View style={{ flex: 0.3, flexDirection: 'column', padding: 10, }}>
                            <Picker
                                selectedValue={this.state.selectedOtherOption}
                                mode='dropdown'
                                style={{ width: 130, backgroundColor: '#ffc107', borderColor: '#6c757d', borderWidth: 1, }}
                                onValueChange={(value, index) => this.setState({ selectedOtherOption: value })}>
                                {this.state.otherOptions.map(x => <Picker.Item key={x} label={x} value={x} />)}
                            </Picker>
                            <TextInput
                                disableFullscreenUI
                                underlineColorAndroid='rgba(0,0,0,0)'
                                style={{ backgroundColor:'#fff', borderColor: '#999', borderWidth: 1, margin: 6, borderRadius:4, padding:6,textAlignVertical:'top'}}
                                multiline
                                numberOfLines={6}
                                placeholder='Notes'
                                onChangeText={(text) => this.setState({ notes: text })}
                                value={this.state.notes} />
                            <Text> clients </Text>
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
                    </View>

                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', padding: 10, }}>
                        <Text> discount </Text>
                        <DiscountInput
                            placeholder='discount value'
                            value={this.state.discount}
                            type={this.state.discountType}
                            onTypeChange={(type) => this.setState({ discountType: type })}
                            onValueChange={(value) => this.setState({ discount: value })}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            {
                                this.state.clients.map(x => <Selectable key={x}
                                    title={'client #' + x}
                                    onSelect={(value) => this.toggleSelectForClient(x, value)}
                                    selected={this.isSelectedForClient(x)}
                                />)
                            }
                        </View>

                    </View>
                </ScrollView>
                <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                    <TouchableOpacity style={{ backgroundColor: 'red', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, }} onPress={this.cancel}>
                        <Text style={{ color: '#fff' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: 'green', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, }} onPress={this.save}>
                        <Text style={{ color: '#fff' }}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}