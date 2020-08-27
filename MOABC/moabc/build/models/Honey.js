var Honey = (function () {
    function Honey(size) {
        this.MAX_LENGTH = size;
        this.nectar = [];
        this.conflicts = 0;
        this.trials = 0;
        this.fitness = 0.0;
        this.selectionProbability = 0.0;
        this.initNectar();
    }
    Honey.prototype.compareTo = function (h) {
        return this.conflicts - h.getConflicts();
    };
    Honey.prototype.initNectar = function () {
        for (var i = 0; i < this.MAX_LENGTH; i++) {
            this.nectar[i] = i;
        }
    };
    Honey.prototype.computeConflicts = function () {
        var board = new Board();
        var x = 0;
        var y = 0;
        var tempx = 0;
        var tempy = 0;
        var dx = [-1, 1, -1, 1];
        var dy = [-1, 1, 1, -1];
        var done = false;
        var conflicts = 0;
        board = this.clearBoard(board);
        board = this.plotQueens(board);
        for (var i = 0; i < this.MAX_LENGTH; i++) {
            x = i;
            y = this.nectar[i];
            for (var j = 0; j < 4; j++) {
                tempx = x;
                tempy = y;
                done = false;
                while (!done) {
                    tempx += dx[j];
                    tempy += dy[j];
                    if ((tempx < 0 || tempx >= this.MAX_LENGTH) || (tempy < 0 || tempy >= this.MAX_LENGTH)) {
                        done = true;
                    }
                    else {
                        if (board.get(tempx, tempy) == "Q") {
                            conflicts++;
                        }
                    }
                }
            }
        }
        this.conflicts = conflicts;
    };
    Honey.prototype.plotQueens = function (board) {
        for (var i = 0; i < this.MAX_LENGTH; i++) {
            board.set(i, this.nectar[i], "Q");
        }
        return board;
    };
    Honey.prototype.clearBoard = function (board) {
        for (var i = 0; i < this.MAX_LENGTH; i++) {
            for (var j = 0; j < this.MAX_LENGTH; j++) {
                board.set(i, j, "");
            }
        }
        return board;
    };
    Honey.prototype.getConflicts = function () {
        return this.conflicts;
    };
    Honey.prototype.setConflicts = function (mConflicts) {
        this.conflicts = mConflicts;
    };
    Honey.prototype.getSelectionProbability = function () {
        return this.selectionProbability;
    };
    Honey.prototype.setSelectionProbability = function (mSelectionProbability) {
        this.selectionProbability = mSelectionProbability;
    };
    Honey.prototype.getFitness = function () {
        return this.fitness;
    };
    Honey.prototype.setFitness = function (mFitness) {
        this.fitness = mFitness;
    };
    Honey.prototype.getNectar = function (index) {
        return this.nectar[index];
    };
    Honey.prototype.getIndex = function (value) {
        var k = 0;
        for (; k < this.MAX_LENGTH; k++) {
            if (this.nectar[k] == value) {
                break;
            }
        }
        return k;
    };
    Honey.prototype.setNectar = function (index, value) {
        this.nectar[index] = value;
    };
    Honey.prototype.getTrials = function () {
        return this.trials;
    };
    Honey.prototype.setTrials = function (trials) {
        this.trials = trials;
    };
    Honey.prototype.getMaxLength = function () {
        return this.MAX_LENGTH;
    };
    return Honey;
}());
var Board = (function () {
    function Board() {
        this.value = [];
    }
    Board.prototype.set = function (section, row, value) {
        if (!this.value[section]) {
            this.value[section] = [];
        }
        this.value[section][row] = value;
    };
    Board.prototype.get = function (section, row) {
        return this.value[section][row];
    };
    Board.prototype.push = function (value) {
        this.value.push(value);
    };
    return Board;
}());
Array.prototype.max = function (where) {
    var index = Math.max.apply(Math, this.map(where));
    return {
        value: this[index],
        index: index
    };
};
Array.prototype.min = function (where) {
    var index = Math.min.apply(Math, this.map(where));
    return {
        value: this[index],
        index: index
    };
};
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function randomNumberMax(max) {
    return randomNumber(0, max);
}
//# sourceMappingURL=Honey.js.map