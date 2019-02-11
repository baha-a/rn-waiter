
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
}