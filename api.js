const baseUrl = 'http://damas55.upos.ca/public/api/';

export default class Api {

    static getCategories() {
        return fetch(baseUrl + 'categories')
            .then(r => r.json())
            .catch(Api.onError);
    }

    static getOrder(id) {
        return fetch(baseUrl + 'orders/' + id)
            .then(r => r.json())
            .catch(Api.onError);
    }

    static getOrders() {
        return fetch(baseUrl + 'orders')
            .then(r => r.json())
            .catch(Api.onError);
    }

    static getCustomizes(id) {
        return fetch(baseUrl + 'items/customizes/' + id)
            .then(r => r.json())
            .catch(Api.onError);
    }

    static getTasting() {
        return fetch(baseUrl + 'tasting')
            .then(r => r.json())
            .catch(Api.onError);
    }

    static postOrder(order) {
        return fetch(
            baseUrl + 'orders',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            })
            .then(r => r.json())
            .catch(Api.onError);
    }

    static onError(e) {
        console.log('network connection error');
    }

    static guid(separator) {
        /// <summary>
        ///    Creates a unique id for identification purposes.
        /// </summary>
        /// <param name="separator" type="String" optional="true">
        /// The optional separator for grouping the generated segmants: default "-".    
        /// </param>

        var delim = separator || "-";

        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
    };
}