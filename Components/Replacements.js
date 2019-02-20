import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import Loader from './Loader';
import { Actions } from 'react-native-router-flux';
import ItemButton from './ItemButton';
import helper from '../helper';

export default class Replacements extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            error: false,

            services: [],
            tastingItems: [],

            selectedService: null,
            selectedItem: null,
        };
    }

    componentDidMount() {
        this.fetchDate();
    }

    fetchDate() {
        this.setState({ ready: false, error: false });

        let selectedItem = null;
        if (this.props.selectedItem && this.props.selectedService) {
            try {
                selectedItem = this.props.tastingServices
                    .find(x => x.service_number == this.props.selectedService)
                    .products
                    .find(p => p.product_id == this.props.selectedItem.product_id);
            } catch (ex) {

            }
        }

        this.setState({
            services: this.props.tastingServices,
            tastingItems: this.props.tastingItems,
            selectedService: this.props.selectedService,
            selectedItem: selectedItem,
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
            this.props.onSave({
                services: [...this.state.services]
            });
        }
        Actions.pop();
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
                            let isSelected = s.service_number == this.state.selectedService &&
                                this.state.selectedItem && this.state.selectedItem.product_id == p.product_id;

                            let style = isSelected ? {
                                borderColor: '#66c4ff',
                                borderRadius: 1,
                                borderWidth: 2,
                                borderStyle: 'dotted',
                            } : {};

                            let choosenReplacements = p.replacements.filter(r => r.quantity && r.quantity > 0)
                                .map(r => <ItemButton
                                    key={p.product_id + '-' + r.id}
                                    color={'#66c4ff'}
                                    title={r.product_name}
                                    quantity={r.quantity}
                                    showCount
                                    isSelected
                                />);

                            return [<View style={style} key={p.product_id}>
                                <ItemButton
                                    color={p.color}
                                    title={p.product_name}
                                    quantity={helper.getQuantityOfItemMinusReplacement(p)}
                                    showCount
                                    onPressMid={() => {
                                        if (this.state.selectedItem && this.state.selectedItem.product_id == p.product_id) {
                                            this.setState({ selectedItem: null });
                                        } else {
                                            this.setState({ selectedItem: p });
                                        }
                                    }}
                                />
                            </View>,
                            ...choosenReplacements
                            ];
                        })
                    )
                }
            </View>

            <View style={{ height: 1, backgroundColor: '#ddd', margin: 6 }} />

            {
                this.state.selectedItem && this.state.selectedItem.replacements &&
                this.state.selectedItem.replacements.length > 0 &&
                <View>
                    <Text>Replacments:</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {
                            this.state.selectedItem && this.state.selectedItem.replacements &&
                            this.state.selectedItem.replacements.length > 0 &&
                            this.state.selectedItem.replacements.map(r => <ItemButton
                                key={r.id}
                                color='#66c4ff'
                                title={r.product_name}
                                onAddOrRemove={(value, factor) => {
                                    this.handleChangeQuantityOfReplacment(r, value, factor)
                                }}
                                showCount
                                quantity={r.quantity || 0}
                            />)
                        }
                    </View>
                </View>
            }
        </View>);
    }

    handleChangeQuantityOfReplacment(replacement, value, factor = 1) {
        let
            itemX = this.state.selectedItem,
            selectedService = this.state.selectedService;

        let services = [...this.state.services];
        let item = services.find(i => i.service_number == selectedService).products.find(x => x.product_id == itemX.product_id);

        let quantityLimit = helper.getQuantityOfItemMinusReplacement(item);
        if (value < 0) {
            value = quantityLimit + replacement.quantity;
        }
        else if (quantityLimit == 0 && factor != -1) {
            value = 0;
        }

        let rep = item.replacements.find(x => x.id == replacement.id);
        if (rep) {
            rep.quantity = value;
        }

        this.setState({ services: services });
    }

    getSelectedTastingItems() {
        return this.state.tastingItems.filter(t => t.services.findIndex(i => i.service_number == this.state.selectedService) != -1);
    }
    getSelectedService() {
        return this.state.services.filter(s => s.service_number == this.state.selectedService);
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
                onPress={() => this.setState({ selectedService: number, selectedItem: null })}>
                <Text>SRV #{number}</Text>
            </TouchableOpacity>);
    }
}
