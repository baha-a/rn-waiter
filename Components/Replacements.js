import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import Api from '../api';
import Loader from './Loader';
import ReloadBtn from './ReloadBtn';
import Selectable from './Selectable';
import { Actions } from 'react-native-router-flux';
import FAIcon from './FAIcon';

export default class Replacements extends Component {

    constructor(props) {
        super(props);

        this.state = {
            product: null,
            selectedReplacement: null,
            quantity: 1,

            ready: false,
            error: false,
        };
    }

    componentDidMount() {
        this.fetchDate();
    }

    fetchDate() {
        this.setState({ ready: false, error: false });

        // let {
        //     id,
        //     parent_id,
        // } = this.props;

        this.setState({ product: this.props.item, quantity: this.props.item.quantity, ready: true, error: false });

        // Api.getTasting(category_id)
        //     .then(tasting => {
        //         let product = null
        //         outerLoop: for (const service of tasting.services) {
        //             for (const p of service.products) {
        //                 if (p.id == id) {
        //                     product = p;
        //                     break outerLoop;
        //                 }
        //             }
        //         }

        //         this.setState({ product: product, ready: true, error: false });
        //     })
        //     .catch(err => this.setState({ error: true, ready: true }));
    }

    render() {
        if (!this.state.ready) return <Loader />;
        //if (this.state.error) return <ReloadBtn onReload={() => this.fetchDate()} />;
        else {
            return (
                <ScrollView>
                    <View style={{ padding: 10 }}>
                        <View style={{ paddingVertical: 10, }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{this.state.product.en_name} Customize</Text>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 6 }} />

                        <View>
                            <Text> Quantity</Text>
                            <View style={{ marginHorizontal: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch' }}>
                                <TouchableOpacity
                                    style={{ padding: 10, backgroundColor: '#999' }}
                                    onPress={() => this.setState(state => ({ quantity: state.quantity + 1 }))}
                                >
                                    <FAIcon name='plus' style={{ justifyContent: 'center', alignItems: 'center', color: '#fff' }} />
                                </TouchableOpacity>
                                <Text style={{ justifyContent: 'center', alignItems: 'center' }}>{this.state.quantity}</Text>
                                <TouchableOpacity
                                    style={{ padding: 10, backgroundColor: '#999' }}
                                    onPress={() => this.state.quantity > 0 && this.setState(state => ({ quantity: state.quantity - 1 }))}
                                >
                                    <FAIcon name='minus' style={{ justifyContent: 'center', alignItems: 'center', color: '#fff' }} />
                                </TouchableOpacity>
                            </View>
                        </View>


                        <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 6 }} />

                        <Text>Replacements:</Text>
                        <View style={{ padding: 10 }}>
                            {this.state.product.replacement.map(r =>
                                <Selectable key={r.id}
                                    title={r.en_name}
                                    onSelect={v => {
                                        if (v) {
                                            this.setState({ selectedReplacement: r.id });
                                        }
                                        else {
                                            if (this.state.selectedReplacement == r.id) {
                                                this.setState({ selectedReplacement: null });
                                            }
                                        }
                                    }}
                                    selected={this.state.selectedReplacement == r.id}
                                />)}
                        </View>

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
}
