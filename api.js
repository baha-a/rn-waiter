const baseUrl = 'http://damas55.upos.ca/public/api/';

const fetchData = (url, config = null) => fetch(baseUrl + url, config)
    .then(response => {
        if (response.ok || (response.status >= 200 && response.status < 300))
            return response.json();

        console.log(response);

        throw `error ${response.status}, ${response.statusText}`;
    })
//.catch(error => { throw error.message; });

const postData = (url, data, method = 'POST') => fetchData(url, {
    method: method,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
});

const deleteData = (url, data) => postData(url, data, 'delete');


export default class Api {
    static getTableNumbers() {
        return fetchData('orders')
            .then(x => {
                if (x)
                    return x.map(y => ({ id: y.id, table_number: y.table_number, }));
                return [];
            });
    }

    static deleteProducts(orderId, uniqueIdArray) {
        return deleteData(`order/${orderId}/delete/details`, { deleted_details: uniqueIdArray });
    }
    static addProducts(orderId, service_number, products) {
        return postData(`order/${orderId}/addDetails`, { service_number:service_number, products:products });
    }
    static editNoteOrTableNumber(orderId, data) {
        return postData(`order/${orderId}`, data , 'PUT');
    }
    static editClientOptionsCustomizes(uniqueId, data) {
        return postData(`orderDetails/${uniqueId}`, data , 'PUT');
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

    static getTasting(id = '') {
        return fetchData('tasting/' + id);
    }

    static postOrder(order) {
        return postData('orders', order);
    }

    static moveItemToTable(data) {
        return fetchData('order/transfer', data);
    }

    static hold(data) {
        return fetchData('order/changeStatus', {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
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