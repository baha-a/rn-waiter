import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import Api from '../api';
import Loader from './Loader';
import ReloadBtn from './ReloadBtn';
import Selectable from './Selectable';
import { Actions } from 'react-native-router-flux';
import FAIcon from './FAIcon';
import ItemButton from './ItemButton';

export default class Replacements extends Component {
    constructor(props) {
        super(props);

        this.state = {
            product: null,
            selectedReplacement: null,
            quantity: 1,

            ready: false,
            error: false,

            services: [],
            selectedService: null,
            selectedItem: null,

            tastingItems: [],
        };
    }

    componentDidMount() {
        this.fetchDate();
    }

    fetchDate() {
        this.setState({ ready: false, error: false });

        this.setState({
            product: this.props.item,
            quantity: this.props.item.quantity,
            services: this.props.tastingServices,
            tastingItems: this.props.tastingItems,
            selectedService: this.props.selectedService,
            ready: true,
            error: false
        });
    }

    render() {
        if (!this.state.ready) return <Loader />;
        else {
            return (
                <ScrollView>
                    <View style={{ padding: 10, backgroundColor: '#fff' }}>
                        <View style={{ paddingVertical: 10, }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Replace Items</Text>
                        </View>

                        {this.renderTabRow()}
                        {this.renderContent()}
                        {this.renderSaveAndCancel()}
                    </View>
                </ScrollView>
            )
        }
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
            newReplace: this.state.selectedReplacement,
            quantity: this.props.item.quantity == this.state.quantity ? null : this.state.quantity,
            item: this.props.item,
        };
    }
    renderSaveAndCancel() {
        return (<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#eee' }}>
            <TouchableOpacity style={{ backgroundColor: 'red', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, }}
                onPress={this.cancel.bind(this)}>
                <Text style={{ color: '#fff' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: 'green', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, }}
                onPress={this.save.bind(this)}>
                <Text style={{ color: '#fff' }}>Save</Text>
            </TouchableOpacity>
        </View>);
    }

    renderContent() {
        return (<View style={{ padding: 10, }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                {
                    this.getSelectedTastingItems().map(t => <Text key={t.id} style={{ paddingHorizontal: 3 }}>
                        <Text style={{ fontWeight: 'bold' }}>{t.quantity}</Text>{' ' + t.tasting_name},</Text>)
                }
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {
                    this.getSelectedService().map(s =>
                        s.products.map(p => {
                            let style = p.dish_number != this.state.selectedItem ? {} : {
                                borderColor: 'cyan',
                                borderRadius: 4,
                                borderWidth: 1,
                                borderStyle: 'dotted',
                                margin: 2,
                                padding: 2,
                            };

                            return <View style={style}>
                                <ItemButton
                                    key={p.dish_number}
                                    color={p.color}
                                    title={p.tasting_name}
                                    quantity={p.quantity}
                                    showCount
                                    onPressMid={() => this.setState({ selectedItem: p.dish_number })}
                                />
                            </View>;
                        })
                    )
                }
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {
                    this.getSelectedItemReplacements().map(r => <ItemButton
                        key={r.id}
                        color={r.color}
                        title={r.tasting_name}
                        onPressMid={() => this.replaceSelectedItem(r)}
                    />)
                }
            </View>
        </View>);
    }

    replaceSelectedItem(r) {
        alert(r.tasting_name);
    }

    getSelectedTastingItems() {
        return this.state.tastingItems.filter(t => t.services.findIndex(i => i.service_number == this.state.selectedService) != -1);
    }
    getSelectedService() {
        return this.state.services.filter(s => s.service_number == this.state.selectedService);
    }
    getSelectedItemReplacements() {
        let res = this.getSelectedService();
        console.log('1');
        if (res) {
            console.log('2');
            let item = res[0].products.find(p => p.dish_number == this.state.selectedItem);
            if (item) {
                console.log('3');
                return item.replacement;
            }
        }
        return [];
    }
    renderTabRow() {
        return (<ScrollView
            horizontal
            alwaysBounceHorizontal
            showsHorizontalScrollIndicator={false}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                borderBottomColor: '#ddd',
                borderBottomWidth: 1,
                paddingHorizontal: 10
            }}>
                {this.state.services.map(s => this.tabBtn(s.service_number))}
            </View>
        </ScrollView>);
    }

    tabBtn(number) {
        let style = {};
        if (this.state.selectedService == number) {
            style = {
                borderWidth: 1,
                borderColor: '#eee',
                backgroundColor: '#eee',
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
                borderBottomWidth: 0,
            };
        }
        return (
            <TouchableOpacity key={number} style={[{
                padding: 10,
                paddingHorizontal: 16,
            }, style]}
                onPress={() => this.setState({ selectedService: number })}>
                <Text>SRV #{number}</Text>
            </TouchableOpacity>);
    }
}
