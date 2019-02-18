const baseUrl = 'http://damas55.upos.ca/public/api/';

const fetchData = (url, config = null) => fetch(baseUrl + url, config)
    .then(async response => {
        if (response.ok || (response.status >= 200 && response.status < 300))
            return response.json();

        if (response.status == 422) {
            let errMsg = '';
            try {
                let err = JSON.parse(await response.text()).error;
                for (const key in err) {
                    if (err.hasOwnProperty(key)) {
                        errMsg += err[key].join('\n - ');
                    }
                }
            } catch (ex) { }
            throw errMsg != '' ? errMsg : `error ${response.status}, ${response.statusText}`;
        }

        throw `error ${response.status}, ${response.statusText}`;
    });

const postData = (url, data, method = 'POST') => fetchData(url,
    { method, headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(data), });

const cacheConfig = {
    cache: 'force-cache',
    headers: {
        'Cache-Control': 'force-cache, public, max-age=3600',
        'Expires': 3600,
    }
}
export default class Api {

    static getTableNumbers() {
        return fetchData('orders')
            .then(x => !x ? [] : x.map(y => ({ id: y.id, table_number: y.table_number, })));
    }

    static editOrder(orderId, data) {
        return postData(`orders/${orderId}`, data, 'PUT');
    }

    static getCategories() {
        return fetchData('categories', cacheConfig);
    }

    static getOrder(id) {
        return fetchData('orders/' + id);
    }

    static getOrders() {
        return fetchData('orders');
    }

    static getCustomizes(id) {
        return fetchData('items/customizes/' + id, cacheConfig);
    }

    static getTasting(id = '') {
        return fetchData('tasting/' + id, cacheConfig);
    }

    static postOrder(order) {
        return postData('orders', order);
    }

    static callService(order_id, service_number, isTasting = false) {
        return postData('order/switch', { order_id, service_number, isTasting });
    }

    static moveItemToTable(data) {
        return postDate('order/transfer', data);
    }
    static hold(data) {
        return postData('order/changeStatus', data);
    }

    static guid(separator = '-') {
        const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        return (S4() + S4() + separator + S4() + separator + S4() + separator + S4() + separator + S4() + S4() + S4());
    }
}