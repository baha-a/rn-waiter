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

    static getCustomizes(id){
        return fetch(baseUrl + 'items/customizes/' + id)
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
        alert('network connection error');
    }


    static colorStack = [
        '#546e7a',
        '#6d4c41',
        '#7cb342',
        '#fdd835',
        '#e53935',
    ];
    static nextColorIndex = 0;

    static colorMaps = [];
    static mapCategoryWithColors(id) {
        if (Api.colorMaps.findIndex(x => x.id == id) == -1) {
            Api.colorMaps.push({ id: id, color: Api.colorStack[Api.nextColorIndex++ % Api.colorStack.length] });
        }
        
        return Api.colorMaps.find(x => x.id == id).color;
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