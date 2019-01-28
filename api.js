const baseUrl = 'http://damas55.upos.ca/public/api/';

const fetchData = (url, config = null) => {
    return fetch(baseUrl + url, config)
        .then(response => {
            if (response.status >= 200 && response.status < 300)
                return response.json();

            
            console.log(response);

            if (response.status)
                throw new Error('error ' + response.status);

            throw new Error('connection error, ' + JSON.stringify(response));
        }).catch(Api.onError);
};

export default class Api {

    static getAvailableTables() {
        return fetchData('availableTables');
    }

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
        return fetchData('orders', {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
        });
    }
    static moveItemToTable(tableNumber, item) {
        return fetchData('tables/' + tableNumber, {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
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