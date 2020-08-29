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
            log("im here");
            this.nectar[i] = new EvacuationCenter();
            this.nectar[i].current_population = randomNumber(0, 30);
        }
    };
    Honey.prototype.computeConflicts = function () {
        var sum = 0;
        for (var i = 0; i < this.MAX_LENGTH; i++) {
            sum += (this.nectar[i].current_population / this.nectar[i].population_capacity);
        }
        this.setConflicts(sum);
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
    Honey.prototype.getNectar = function (index, type) {
        switch (type) {
            case EvacuationPropType.current_population:
                return this.nectar[index].current_population;
            case EvacuationPropType.current_inventory:
                return this.nectar[index].current_inventory;
            default:
                return 0;
        }
    };
    Honey.prototype.getIndex = function (value, type) {
        var k = 0;
        for (; k < this.MAX_LENGTH; k++) {
            if (this.nectar[k].current_population == value) {
                return k;
            }
        }
        return null;
    };
    Honey.prototype.setNectar = function (index, value, type) {
        console.log("honeybee nectar %o", this.nectar);
        console.log("set value index: %o, value: %o, type: %o", index, value, type);
        if (index == null) {
            console.log("fatalError()");
            console.trace();
        }
        switch (type) {
            case EvacuationPropType.current_population:
                return this.nectar[index].current_population = value;
            case EvacuationPropType.current_inventory:
                return this.nectar[index].current_inventory = value;
            default:
                return 0;
        }
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
function getMaxValue(arr, where) {
    var maxHoney = {
        value: null,
        index: undefined
    };
    var max = -100000;
    arr.forEach(function (value, index) {
        var curr_value = where(value);
        if (curr_value > max) {
            max = curr_value;
            maxHoney = {
                value: value,
                index: index
            };
        }
        console.log("max compare curr_value: %o, max: %o", curr_value, max);
    });
    return maxHoney;
}
function getMinValue(arr, where) {
    var minHoney = {
        value: null,
        index: undefined
    };
    var min = Infinity;
    arr.forEach(function (value, index) {
        var curr_value = where(value);
        if (curr_value < min) {
            min = curr_value;
            minHoney = {
                value: value,
                index: index
            };
        }
    });
    return minHoney;
}
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function randomNumberMax(max) {
    return randomNumber(0, max);
}
//# sourceMappingURL=Honey.js.map