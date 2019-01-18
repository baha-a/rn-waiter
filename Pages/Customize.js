import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import Api from '../api';
import Selectable from '../Components/Selectable';
import DiscountInput from '../Components/DiscountInput';
import { Actions } from 'react-native-router-flux';

export default class Customize extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOptions: [],
            selectedClient: [3, 7],
            clients: [1, 2, 3, 4, 5, 6, 7, 8],
            options: []
        };

        this.toggleSelectForOption = this.toggleSelectForOption.bind(this);
        this.isSelectedForOption = this.isSelectedForOption.bind(this);

        this.toggleSelectForClient = this.toggleSelectForClient.bind(this);
        this.isSelectedForClient = this.isSelectedForClient.bind(this);

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount() {
        Api.getCustomizes(this.props.id)
            .then(x => {
                if (x)
                    this.setState({ options: x });
            });
    }

    toggleSelectForOption(id, value) {
        if (value) {
            if (this.isSelectedForOption(id)) {
                return;
            }
            let options = this.state.selectedOptions.slice();
            options.push(id);
            this.setState({ selectedOptions: options });
        }
        else {
            let options = this.state.selectedOptions.filter(x => x != id);
            this.setState({ selectedOptions: options });
        }
    }

    isSelectedForOption(id) {
        return this.state.selectedOptions.findIndex(x => x == id) != -1;
    }


    cancel(){
        Actions.pop();
    }
    save(){

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
                                initialSelected={this.isSelectedForOption(x.id)}
                            />)
                        }
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', padding: 10, }}>
                        <Text> discount </Text>
                        <DiscountInput placeholder='discount value' />

                        <Text> clients </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            {
                                this.state.clients.map(x => <Selectable key={x}
                                    title={'client #' + x}
                                    onSelect={(value) => this.toggleSelectForClient(x, value)}
                                    initialSelected={this.isSelectedForClient(x)}
                                />)
                            }
                        </View>

                    </View>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding:10, margin:10 }}>
                    <TouchableOpacity style={{ backgroundColor: 'green', flex:1, justifyContent:'center', alignItems:'center', padding: 10, }} onPress={this.save}>
                        <Text style={{color:'#fff' }}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: 'red', flex:1, justifyContent:'center', alignItems:'center', padding: 10, }} onPress={this.cancel}>
                        <Text style={{color:'#fff'}}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}