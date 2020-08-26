var Main = (function () {
    function Main() {
        this.message = "Hello world";
    }
    Main.prototype.start = function () {
        var value = {
            name: "Mori",
            value: 0
        };
        console.log("message " + this.message + ": %o", value);
    };
    return Main;
}());
var main = new Main();
//# sourceMappingURL=helloworlds.js.map