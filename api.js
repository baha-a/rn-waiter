const baseUrl = 'http://damas55.upos.ca/public/api/';

const fetchData = (url, config = null) => {
    return fetch(baseUrl + url, config)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else throw new Error('server returned bad response.');
        }).catch(Api.onError);
};

export default class Api {


    static getCategories() {
        return fetchData('categories');
    }

    static getOrder(id) {
        return fetchData('orders/' + id);
    }

    static getOrders() {
        return fetchData('orders');
    }

    static getCustomizes(id) {
        return fetchData('items/customizes/' + id);
    }

    static getTasting() {
        return fetchData('tasting');
    }

    static postOrder(order) {
        return fetchData(
            'orders',
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
        console.log(e);
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