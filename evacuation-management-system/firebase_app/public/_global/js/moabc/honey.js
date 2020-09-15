var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Honey = (function () {
    function Honey(size, evac, history) {
        if (history === void 0) { history = []; }
        this.id = "honey*" + Utilities.genID(5);
        this.MAX_LENGTH = size;
        this.nectar = [];
        this.conflicts = 0;
        this.trials = 0;
        this.fitness = 0.0;
        this.selectionProbability = 0.0;
        this.evac = evac;
        this.history = history;
        this.initNectar();
    }
    Honey.prototype.compareTo = function (h) {
        return this.conflicts - h.getConflicts();
    };
    Honey.prototype.initNectar = function () {
        var evac_sub_id = this.evac.id || Utilities.genID(5);
        for (var i = 0; i < this.MAX_LENGTH; i++) {
            if (i < this.history.length) {
                var val = __assign({}, this.history[i]);
                this.nectar.push(val);
            }
            else {
                var val = new EvacuationHistory(evac_sub_id);
                val.current_population = HoneyUtilities.randomNumber(0, this.evac.population_capacity);
                this.nectar.push(val);
            }
        }
    };
    Honey.prototype.computeConflicts = function () {
        var carrying_sum = 0;
        for (var i = 0; i < this.MAX_LENGTH; i++) {
            carrying_sum += (this.nectar[i].current_population / this.evac.population_capacity);
        }
        carrying_sum = carrying_sum / this.MAX_LENGTH;
        var density_sum = 0;
        for (var i = 0; i < this.MAX_LENGTH; i++) {
            density_sum += (this.nectar[i].current_population / this.evac.floor_space);
        }
        density_sum = density_sum / this.MAX_LENGTH;
        this.setConflicts(carrying_sum + density_sum);
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
            case EvacuationPropType.floor_space:
                return this.evac.floor_space;
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
var HoneyUtilities = (function () {
    function HoneyUtilities() {
    }
    HoneyUtilities.getMaxValue = function (arr, where) {
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
    };
    HoneyUtilities.getMinValue = function (arr, where) {
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
    };
    HoneyUtilities.randomNumber = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };
    HoneyUtilities.randomNumberMax = function (max) {
        return this.randomNumber(0, max);
    };
    return HoneyUtilities;
}());
//# sourceMappingURL=honey.js.map