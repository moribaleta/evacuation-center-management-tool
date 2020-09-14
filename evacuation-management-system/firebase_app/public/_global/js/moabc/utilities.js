"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utilities = void 0;
class Utilities {
    /** returns a unique id from count provided */
    static genID(count = 5) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < count; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    } //genID
    static log(message) {
        console.log(message);
    }
}
exports.Utilities = Utilities;
//# sourceMappingURL=utilities.js.map