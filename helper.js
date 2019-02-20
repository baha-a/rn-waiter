
export default class helper {

    static getQuantityOfItemMinusReplacement = (item) => {
        if (!item.replacements || item.replacements.length == 0) {
            return item.quantity;
        }

        let sum = 0;
        for (const r of item.replacements) {
            sum += r.quantity || 0;
        }
        return item.quantity - sum;
    }

    static groupBy = (list, key) => list.reduce(function (rv, x) {
        let v = key instanceof Function ? key(x) : x[key];
        let el = rv.find((r) => r && r.key === v);
        if (el) el.values.push(x);
        else rv.push({ key: v, values: [x] });
        return rv;
    }, []);

    static nestedListExtractor(list, extractor) {
        let res = [];
        if (list) {
            list.forEach(x => x.forEach(y => res.push(extractor(y))));
        }
        return res;
    }

    static getTime(date) {
        try {
            let d = date.split(' ')[1];
            return d.split(':')[0] + ':' + de.split(':')[1]
        } catch(ex){
            return date;
        }
    }
}