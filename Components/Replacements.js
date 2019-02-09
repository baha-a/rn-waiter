import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import Api from '../api';
import Loader from './Loader';
import { Actions } from 'react-native-router-flux';
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

        Api.getTasting()
            .then(tastings => {

                let services = [...this.props.tastingServices];
                for (const t of tastings) {
                    for (const s of t.services) {
                        for (const p of s.products) {
                            let product = services.find(x => x.service_number == s.service_number)
                                .products.find(x => x.product_id == p.product_id);
                            product.replacements = [...p.replacements];
                        }
                    }
                }

                this.setState({
                    product: this.props.item,
                    quantity: this.props.item.quantity,
                    services: services,
                    tastingItems: this.props.tastingItems,
                    selectedService: this.props.selectedService,
                    ready: true,
                    error: false
                });
            }).catch(x => this.setState({ ready: true, error: true, }));
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
                            let style = !this.state.selectedItem || this.state.selectedItem.product_id != p.product_id ? {} : {
                                borderColor: '#66c4ff',
                                borderRadius: 1,
                                borderWidth: 2,
                                borderStyle: 'dotted',
                            };

                            return <View style={style} key={p.product_id}>
                                <ItemButton
                                    color={p.color}
                                    title={p.product_name}
                                    quantity={this.getQuantityOfItemMinusReplacement(p)}
                                    showCount
                                    onPressMid={() => {
                                        if (this.state.selectedItem && this.state.selectedItem.product_id == p.product_id) {
                                            this.setState({ selectedItem: null });
                                        } else {
                                            this.setState({ selectedItem: p });
                                        }
                                    }}
                                />
                            </View>;
                        })
                    )
                }
            </View>

            <View style={{ height: 1, backgroundColor: '#ddd', margin: 6 }} />

            {
                this.getSelectedItemReplacements().length > 0 &&
                <View>
                    <Text>Replacments:</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {
                            this.getSelectedItemReplacements().map(r => <ItemButton
                                key={r.id}
                                color='#66c4ff'
                                title={r.tasting_name}
                                addAndRemove
                                onAddOrRemove={(value) => {
                                    this.handleChangeQuantityOfReplacment(value, r, this.state.selectedItem, this.state.selectedService)
                                }}
                                showCount
                                quantity={r.quantity}
                            />)
                        }
                    </View>
                </View>
            }
        </View>);
    }

    handleChangeQuantityOfReplacment(value, replacement, itemX, selectedService) {
        let services = [...this.state.services];

        let item = services.find(i => i.service_number == selectedService).products.find(x => x.product_id == itemX.product_id);
        if (!item.selectedReplacement) {
            item.selectedReplacement = [];
        }

        console.log(item.selectedReplacement);
        let quantityLimit = this.getQuantityOfItemMinusReplacement(item);
        console.log(quantityLimit);
        value = value % (quantityLimit + 1);
        if (value < 0) {
            value = quantityLimit;
        }
        console.log(value);

        let rep = item.selectedReplacement.find(x => x.id == replacement.Id);
        if (!rep) {
            rep = { ...replacement, quantity: value };
            item.selectedReplacement.push(rep);
        } else {
            rep.quantity = value;
        }
        console.log(item.selectedReplacement);

        this.setState({ services: services });
    }

    getQuantityOfItemMinusReplacement(item) {
        if (!item.selectedReplacement) {
            return item.quantity;
        }

        let sum = 0;
        for (const r of item.selectedReplacement) {
            sum += r.quantity || 0;
        }
        return item.quantity - sum;
    }

    getSelectedTastingItems() {
        return this.state.tastingItems.filter(t => t.services.findIndex(i => i.service_number == this.state.selectedService) != -1);
    }
    getSelectedService() {
        return this.state.services.filter(s => s.service_number == this.state.selectedService);
    }
    getSelectedItemReplacements() {
        if (this.state.selectedItem == null)
            return [];
        return this.state.selectedItem.replacements;
        // return [{
        //     id: 45,
        //     en_name: "S-Humus",
        //     tasting_name: "SHS",
        //     price: "1",
        // }, {
        //     id: 4,
        //     en_name: "S-Humus",
        //     tasting_name: "SH2",
        //     price: "2",
        // }, {
        //     id: 454,
        //     en_name: "S-Humus",
        //     tasting_name: "SH3",
        //     price: "3",
        // }, {
        //     id: 455,
        //     en_name: "S-Humus",
        //     tasting_name: "SS",
        //     price: "4",
        // }, {
        //     id: 43,
        //     en_name: "S-Humus",
        //     tasting_name: "Sv",
        //     price: "70",
        // }];
        for (const t of this.getSelectedTastingItems()) {
            for (const s of t.services) {
                let pr = s.products.find(p => p.id == this.state.selectedItem.product_id);
                if (pr) {
                    return pr.replacement;
                }
            }
        }
        return [];
        // let res = this.getSelectedService();
        // if (res) {
        //     let item = res[0].products.find(p => p.dish_number == this.state.selectedItem);
        //     if (item) {
        //         //this.state.tastingItems.find()
        //         return [{
        //             id: 45,
        //             branch_id: 3,    //             en_name: "S-Humus",
        //             tasting_name: "SHS",

        //             price: "7",

        //         }];
        //         return item.replacement;
        //     }
        // }
        // return [];
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
