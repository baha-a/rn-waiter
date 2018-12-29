
export default class Api {

    static apiKey = 'qkRpDcdtuuBSF6a6kzQkLdnsQD80csluSDGuAPrOklYVXZCAptZBijBcRCwESVOl8qqnIfRtBKyejPyYQuXov0MV2Lf8zxur0wM6idWjTTRafpo8McY8ykEpwNpqGgeN7Xc8S7BChtauQ6MgoUymASlTiYIQqvPsOhT6ACjhjQGSplM0shssbx15fIwSOvLx5Q5sBg0UvKms3GyAt75tSXOvUBpGVTGGMQmqGVYHCMIpdp1GKTs2zV7dWjIoAiTj';
    static apiUrlBase = 'https://www.digitalnet-syria.com/index.php?route=';
    static apiImageBase = 'https://www.digitalnet-syria.com/image/';

    static unEscapeHtmlChar(str) {
        return str.replace(/\//g,'/')
        .replace(/&apos;/g,"'")
        .replace(/&quot;/g,'"')
        .replace(/&lt;/g,'<')
        .replace(/&gt;/g,'>')
        .replace(/&amp;/g,'&');
    }
    static unEscapeHtmlCharForTitle(str) {
        return str.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&apos;/g,"'");
    }

    static convertPrice(price) {
        // to do later: converty 'price' to local price (ex. $ to SP)
        return parseFloat(price).toFixed(2);
    }
    static mapProductValues(products, categoryTitle){
        return products.map((p)=>
        ({
            id: p.product_id,
            title: Api.unEscapeHtmlCharForTitle(p.name),
            description: p.description,
            image: Api.apiImageBase + p.image,
            images: [
            Api.apiImageBase + p.image,
            'https://dummyimage.com/250/38a06f',
            ],
            price: Api.convertPrice(p.price),
            category: categoryTitle,
        }));
    }
    
    static postToApi(urlRoute, body) {
        return fetch(Api.apiUrlBase + urlRoute, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key: Api.apiKey, ...body }),
        })
        .then((response) => response.json())
        .catch((error) => { console.error(error); });
    }

    static getBrands() {
        return Api.postToApi('api/manufacturer/getBrands')
        .then((responseJson) => responseJson.brands.sort((a, b) => parseInt(a.sort_order) - parseInt(b.sort_order)));
    }
    static getSubCategories(parentid) {
        return Api.postToApi('api/category/getSubCategories', { parentid })
        .then((responseJson) => responseJson.categories
            .sort((a, b) => parseInt(a.sort_order == 0? 999 :a.sort_order) - parseInt(b.sort_order == 0? 999 : b.sort_order))
            );
    }
    static getCategoriesByBrand(mbid) {
        return Api.postToApi('api/category/getCategoriesByBrand', { mbid });
    }
    static getNewProducts(limit) {
        return Api.postToApi('api/product/getNewProducts', { limit });
    }
    static getOffers() {
        return Api.postToApi('api/product/getOffers');
    }
    static getProduct(productid) {
        
        return fetch('https://www.bakehost.net/ocapi/getproduct.php')
        .then((response) => response.json())
        .then((responseJson) => responseJson.products)
        .catch((error) => { console.error(error); });
        
        //return Api.postToApi('api/product/getProduct', { productid });
    }
    static getProductsByCategory(catid) {
        return fetch('https://www.bakehost.net/ocapi/getnewproducts.php')
        .then((response) => response.json())
        .then((responseJson) => Object.keys(responseJson.products).map(key => responseJson.products[key]))
        .catch((error) => { console.error(error); });

        // return Api.postToApi('api/product/getProductsByCategory', { catid })
        // .then((responseJson) => responseJson.products);
    }   
    
    static search(quary) {
        return fetch('https://www.bakehost.net/ocapi/getnewproducts.php')
        .then((response) => response.json())
        .then((responseJson) => Object.keys(responseJson.products).map(key => responseJson.products[key]))
        .catch((error) => { console.error(error); });

        // return Api.postToApi('api/product/search', { quary })
        // .then((responseJson) => responseJson.products);
    }   

    static login() {
        return Api.postToApi('api/login');
    }
    static register(firstname,lastname,password,email) {
        return Api.postToApi('api/register/addcustomer', { firstname, lastname, password, email });
    }
}