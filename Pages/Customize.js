import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
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

        this.state = {
            selectedOptions: product_customizes.slice(),
            selectedClient: clients.slice(),
            clients: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            options: [],

            discount: discount,
            discountType: discountType,
        };

        this.toggleSelectForOption = this.toggleSelectForOption.bind(this);
        this.isSelectedForOption = this.isSelectedForOption.bind(this);

        this.toggleSelectForClient = this.toggleSelectForClient.bind(this);
        this.isSelectedForClient = this.isSelectedForClient.bind(this);

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount() {
        Api.getCustomizes(this.props.item.id).then(result => { if (result) this.setState({ options: result });});
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
            <ScrollView>
                <View style={{ margin: 10, padding: 10, }}>
                    <Text>{this.props.item.en_name}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', padding: 10, }}>
                        <Text> Customization </Text>
                        {
                            this.state.options.map(x => <Selectable key={x.id}
                                title={x.custom_name}
                                onSelect={(value) => this.toggleSelectForOption(x.id, value)}
                                selected={this.isSelectedForOption(x.id)}
                            />)
                        }
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

                        <Text> clients </Text>
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
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, margin: 10 }}>
                    <TouchableOpacity style={{ backgroundColor: 'red', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, }} onPress={this.cancel}>
                        <Text style={{ color: '#fff' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: 'green', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, }} onPress={this.save}>
                        <Text style={{ color: '#fff' }}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}