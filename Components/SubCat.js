import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import FAIcon from './FAIcon';


export default class SubCat extends Component {
    constructor(props) {
        super(props);

        let {
            cat = [],
        } = this.props;

        this.state = {
            cat: cat,
            selectedCat: [],
        };
    }


    push(id) {
        this.setState({ selectedCat: [...this.state.selectedCat, id] });
    }

    pop() {
        this.setState({ selectedCat: this.state.selectedCat.slice(0, this.state.selectedCat.length - 1) });
    }

    productsOfSelectedCat() {
        let cat = null, cats = this.state.cat.slice();

        this.state.selectedCat.forEach(c => {
            cat = cats.find(x => x.id == c);
            cats = cat.sub_categories;
        });

        return {
            products: cat == null ? [] : cat.products,
            cats: cats,
        };
    }

    render() {
        let selectedCat = this.productsOfSelectedCat();
        return (
            <View style={{ padding: 4, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                {
                    this.state.selectedCat.length > 0 &&
                    <TouchableOpacity style={{ width: '90%', margin: 4, padding: 10, backgroundColor: '#ddd', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}
                        onPress={() => this.pop()}>
                        <Text style={{ color: '#000' }}>
                            <FAIcon name='arrow-left' /> back
                        </Text>
                    </TouchableOpacity>
                }

                {
                    selectedCat && selectedCat.cats &&
                    selectedCat.cats.map(x =>
                        <TouchableOpacity
                            key={x.id}
                            style={{ width: '44%', margin: 4, padding: 10, backgroundColor: x.category_color }}
                            onPress={() => this.push(x.id)}
                        >
                            <Text style={{ color: '#fff' }}>{x.category_name}</Text>
                        </TouchableOpacity>)
                }

                {selectedCat && selectedCat.products && this.props.renderItems(selectedCat.products)}
            </View>);
    }
}
