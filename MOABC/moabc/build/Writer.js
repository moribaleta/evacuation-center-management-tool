var Writer = (function () {
    function Writer() {
        this.list = [];
        this.list = [];
        console.log("constructed writer %o", this.list);
    }
    Writer.prototype.addString = function (line) {
        this.list.push(line);
    };
    Writer.prototype.addObject = function (h) {
        var n = h.getMaxLength();
        var board = new Board();
        this.clearBoard(board, n);
        for (var x = 0; x < n; x++) {
            board.set(x, h.getNectar(x), "Q");
        }
        this.printBoard(board, n);
    };
    Writer.prototype.clearBoard = function (board, n) {
        for (var x = 0; x < n; x++) {
            for (var y = 0; y < n; y++) {
                board.set(x, y, "");
            }
        }
    };
    Writer.prototype.printBoard = function (board, n) {
        for (var y = 0; y < n; y++) {
            var temp = "";
            for (var x = 0; x < n; x++) {
                if (board.get(x, y) == "Q") {
                    temp += "Q ";
                }
                else {
                    temp += ". ";
                }
            }
            board.push([temp]);
        }
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