var Writer = (function () {
    function Writer() {
        this.list = [];
        this.list = [];
        console.log("constructed writer %o", this.list);
    }
    Writer.prototype.addString = function (line) {
        this.list.push(line);
    };
    Writer.prototype.writeFile = function (filename) {
        console.log("start print ===>");
        this.list.forEach(function (value) {
            console.log(value);
        });
        console.log("end print ===>");
    };
    return Writer;
}());
//# sourceMappingURL=Writer.js.map