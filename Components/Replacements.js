import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Api from '../api';
import Loader from './Loader';
import ReloadBtn from './ReloadBtn';

export default class Replacements extends Component {

    constructor(props) {
        super(props);

        this.state = {
            product: null,
            selectedReplacement: null,

            ready: false,
            error: false,
        };
    }

    componentDidMount() {
        this.fetchDate();
    }

    fetchDate() {
        this.setState({ ready: false, error: false });

        let {
            id,
            category_id,

        } = this.props;


        Api.getTasting(category_id)
            .then(tasting => {
                let product = null
                outerLoop: for (const service of tasting.services) {
                    for (const p of service.products) {
                        if (p.id == id) {
                            product = p;
                            break outerLoop;
                        }
                    }
                }

                this.setState({ product: product, ready: true, error: false });
            })
            .catch(err => this.setState({ error: true, ready: true }));
    }

    render() {
        if (!this.state.ready) return <Loader />;
        if (this.state.error) return <ReloadBtn onReload={() => this.fetchDate()} />;
        else {
            return (
                <View>
                    <Text> textInComponent </Text>
                </View>
            )
        }
    }
}
