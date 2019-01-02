import React, { Component } from 'react'
import { Switch, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import FAIcon from './FAIcon';
import Selectable from './Selectable';
import { Input, Item, Radio } from 'native-base';




export default class TableMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrangeItems: false,
            selectedTab: 1,

            invoiceHoldLimitedTime: true,
            invoiceHoldUnlimited: false,

            service1: false,
            service2: false,
            service3: false,
            service4: false,
        };
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
                <View style={{ flexDirection: 'row' }}>
                    <Switch value={this.state.service1} trackColor={{ false: '#dee2e6', true: '#08d' }}
                        onValueChange={(v) => this.setState({ service1: v })} />
                    <Text>Service #1</Text>
                    <Switch value={this.state.service2} trackColor={{ false: '#dee2e6', true: '#08d' }}
                        onValueChange={(v) => this.setState({ service2: v })} />
                    <Text>Service #2</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Switch value={this.state.service3}
                        onValueChange={(v) => this.setState({ service3: v })} />
                    <Text>Service #3</Text>
                    <Switch value={this.state.service4}
                        onValueChange={(v) => this.setState({ service4: v })} />
                    <Text>Service #4</Text>
                </View>

                <View style={{ backgroundColor: '#dee2e6', height: 1, margin: 10 }} />

                <View style={{ flexDirection: 'row', justifyContent:'flex-start',alignItems:'center' }}>
                    <Radio color='#eee' selectedColor='#08d'
                     selected={this.state.invoiceHoldLimitedTime}
                        onPress={(e) => this.setState({
                            invoiceHoldLimitedTime: !this.state.invoiceHoldLimitedTime,
                            invoiceHoldUnlimited: this.state.invoiceHoldLimitedTime,
                        })} />
                    <Text style={{ fontSize: 10, margin:6  }}>
                        Hold All Invoice For Limited Time
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent:'flex-start',alignItems:'center' }}>
                    <Radio color='#eee' selectedColor='#08d'
                     selected={this.state.invoiceHoldUnlimited}
                        onPress={(e) => this.setState({
                            invoiceHoldLimitedTime: this.state.invoiceHoldUnlimited,
                            invoiceHoldUnlimited: !this.state.invoiceHoldUnlimited,
                        })} />
                    <Text style={{ fontSize: 10, margin:6 }}>Hold to Un Hold</Text>
                </View>

                {
                    this.state.invoiceHoldLimitedTime &&
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent:'flex-start', alignItems:'center' }}>
                            <Text style={{ fontSize: 10 }}>Hold For:</Text>
                            <Input placeholder='30 min' disableFullscreenUI style={{ height:30, borderRadius:2, margin:6, fontSize:10, borderWidth:1, borderColor:'#bbb'}} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent:'flex-start', alignItems:'center' }}>
                            <Text style={{ fontSize: 10 }}>Notify Me During:</Text>
                            <Input placeholder='5 min' disableFullscreenUI style={{ height:30, borderRadius:2, margin:6, fontSize:10, borderWidth:1, borderColor:'#bbb'}} />
                        </View>
                    </View>
                }
            </View>
        );
    }

    renderTabContent() {
        switch (this.state.selectedTab) {
            case 1:
                return <Text> 1 </Text>;
            case 2:
                return <Text> 2 </Text>;
            case 3:
                return this.renderNote();
            case 4:
                return this.randerSchedule();
        }
    }

    render() {
        let arrangeItemsColor = this.state.arrangeItems ? '#bbb' : '#dae0e5';
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff', borderColor: '#eee', borderWidth: 1, borderRadius: 4 }}>
                <View style={{ flex: 1, flexDirection: 'column', padding: 6 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontSize: 18 }}> Table No#  </Text>
                        <TouchableOpacity style={{ paddingHorizontal: 10, backgroundColor: '#dae0e5' }}>
                            <Text> - - </Text>
                        </TouchableOpacity>
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

                <View style={{
                    backgroundColor: 'rgba(0,0,0,.03)', borderColor: 'rgba(0,0,0,.125)', borderWidth: 1,
                    padding: 10, flexDirection: 'column'
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, }}>
                            <Text style={{ fontSize: 12, color: '#6c757d' }}> Subtotal: 400$ </Text>
                        </View>
                        <View style={{ flex: 1, }}>
                            <Text style={{ fontSize: 12, color: '#6c757d' }}> Taxes: 50$ </Text>
                        </View>
                    </View>
                    <View>
                        <Text>Total: 350$</Text>
                    </View>
                </View>
            </View>
        )
    }
}
