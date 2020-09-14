var Utilities = (function () {
    function Utilities() {
    }
    Utilities.genID = function (count) {
        if (count === void 0) { count = 5; }
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < count; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };
    Utilities.log = function (message) {
        console.log(message);
    };
    return Utilities;
}());
//# sourceMappingURL=utilities.js.map