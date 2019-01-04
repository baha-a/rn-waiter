import React, { Component } from 'react'
import { Switch, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import FAIcon from './FAIcon';
import Selectable from './Selectable';
import { Input, Item, Radio } from 'native-base';
import ItemButton from './ItemButton';

export default class TableMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrangeItems: false,
            selectedTab: 1,

            selectedSubTab: 1,

            invoiceHoldLimitedTime: true,
            invoiceHoldUnlimited: false,

            clientsInMenu: [],
            nextClientInMenu: 1,

            barItems: [{ id: 2, name: 'item2', price: 991, category: 5 },
            { id: 3, name: 'item3', price: 2, category: 1 },
            { id: 23, name: 'itemD', price: 991, category: 2 },
            { id: 43, name: 'item33', price: 2, category: 3 }],

            doneServices: [],

            services: [{
                id: 1,
                items: [{ id: 2, name: 'item2', price: 991, category: 5 },
                { id: 3, name: 'item3', price: 2, category: 1 },
                { id: 23, name: 'itemD', price: 991, category: 2 },
                { id: 43, name: 'item33', price: 2, category: 3 }]
            },
            { id: 2, items: [] },
            {
                id: 3, items: [{ id: 2, name: 'item2', price: 991, category: 5 },
                { id: 3, name: 'item3', price: 2, category: 1 },
                { id: 23, name: 'itemD', price: 991, category: 2 },
                { id: 43, name: 'item33', price: 2, category: 3 }]
            },
            ],

            clients: [{
                id: 1,
                items: [{ id: 2, name: 'item2', price: 991, category: 5 },
                { id: 3, name: 'item3', price: 2, category: 1 },
                { id: 23, name: 'itemD', price: 991, category: 2 },
                { id: 43, name: 'item33', price: 2, category: 3 }]
            },
            {
                id: 2,
                items: [{ id: 2, name: 'item2', price: 991, category: 4 },
                { id: 3, name: 'item3', price: 2, category: 5 }]
            }]
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
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                        this.state.services.map(x =>
                            <View key={x.id} style={{ flexDirection: 'row', flexWrap: 'nowrap' }}>
                                <Switch value={this.state.doneServices.findIndex(y => y == x.id) != -1} trackColor={{ false: '#dee2e6', true: '#08d' }}
                                    onValueChange={(v) => {
                                        let done = null;
                                        if (v) {
                                            done = this.state.doneServices.slice();
                                            done.push(x.id);
                                        }
                                        else {
                                            done = this.state.doneServices.filter(y => y != x.id);
                                        }
                                        this.setState({ doneServices: done });
                                    }
                                    } />
                                <Text>Service #{x.id}</Text>
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
                    this.state.clients.map(client => {
                        return (
                            <View key={client.id}>
                                <Text style={{ fontWeight: 'bold' }}>Client #{client.id}</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                                    {
                                        client.items.map(x => <ItemButton key={x.id} title={x.name} add remove category={x.category} />)
                                    }
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        );
    }

    renderMenuItems() {
        let color1 = 1 == this.state.selectedSubTab ? '#bbb' : '#dae0e5';
        let color2 = 2 == this.state.selectedSubTab ? '#bbb' : '#dae0e5';
        return (
            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
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
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                            {
                                this.state.services.map(s => {
                                    return (
                                        <View key={s.id} style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>

                                            <View style={{ backgroundColor: '#f5f5f5', padding: 8, margin: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', }}>Service #{s.id}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                                                {
                                                    s.items.map(x => <ItemButton key={x.id} title={x.name} add remove category={x.category} />)
                                                }
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        :
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                            {
                                this.state.barItems.map(x => <ItemButton key={x.id} title={x.name} add remove category={x.category} />)
                            }
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

    render() {
        let arrangeItemsColor = this.state.arrangeItems ? '#bbb' : '#dae0e5';
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                <View style={{flex:0.1, flexDirection: 'column', marginTop:1}}>
                    {
                        this.state.clientsInMenu.map(x => <Text key={x} style={{ padding: 2, backgroundColor: '#fff' }} >#{x}</Text>)
                    }
                    <TouchableOpacity style={{ padding: 2, backgroundColor: '#fff' }}
                        onPress={() => {
                            let d = this.state.clientsInMenu.slice();
                            d.push(this.state.nextClientInMenu);
                            this.setState({ clientsInMenu: d, nextClientInMenu: this.state.nextClientInMenu + 1 });
                        }}>
                        <FAIcon name='plus' />
                    </TouchableOpacity>
                </View>
                <View style={{ flex:0.9, flexDirection: 'column', backgroundColor: '#fff', borderColor: '#eee', borderWidth: 1, borderRadius: 4 }}>
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
            </View>
        )
    }
}
