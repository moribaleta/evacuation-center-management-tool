var ArtificialBeeColony = (function () {
    function ArtificialBeeColony(max_length, max_val, population_size, trial_limit, max_epoch, min_shuffle, max_shuffle, evacuation_centers) {
        if (max_length === void 0) { max_length = 10; }
        if (max_val === void 0) { max_val = 200; }
        if (population_size === void 0) { population_size = 20; }
        if (trial_limit === void 0) { trial_limit = 50; }
        if (max_epoch === void 0) { max_epoch = 1000; }
        if (min_shuffle === void 0) { min_shuffle = 8; }
        if (max_shuffle === void 0) { max_shuffle = 20; }
        if (evacuation_centers === void 0) { evacuation_centers = []; }
        this.foodSources = [];
        this.solutions = [];
        this.evacuation_centers = [];
        this.MAX_VAL = max_val;
        this.MAX_LENGTH = max_length;
        this.NP = population_size;
        this.FOOD_NUMBER = population_size;
        this.LIMIT = trial_limit;
        this.MAX_EPOCH = max_epoch;
        this.MIN_SHUFFLE = min_shuffle;
        this.MAX_SHUFFLE = max_shuffle;
        this.evacuation_centers = evacuation_centers;
        this.gBest = undefined;
        this.epoch = 0;
    }
    ArtificialBeeColony.prototype.algorithm = function () {
        var _this = this;
        this.foodSources = [];
        this.solutions = [];
        var done = false;
        var epoch = 0;
        this.initialize();
        this.memorizeBestFoodSource();
        while (!done) {
            console.log("iteration current %o, max: %o", epoch, this.MAX_EPOCH);
            if (epoch < this.MAX_EPOCH) {
                console.log("im the best %o", this.gBest);
                if (this.gBest != null && this.gBest.getConflicts() < 0.5) {
                    done = true;
                }
                console.log("employed bees");
                this.sendEmployedBees();
                console.log("update fitness bees");
                this.getFitness();
                console.log("probability");
                this.calculateProbabilities();
                console.log("onlooker bee");
                this.sendOnlookerBees();
                console.log("update food source");
                this.memorizeBestFoodSource();
                console.log("scout bee");
                this.sendScoutBees();
                epoch++;
                console.log("Epoch: " + epoch);
            }
            else {
                done = true;
            }
        }
        if (epoch == this.MAX_EPOCH) {
            console.log("No Solution found");
            done = false;
        }
        console.log("done.");
        console.log("Completed " + epoch + " epochs.");
        this.foodSources.forEach(function (h) {
            if (h.getConflicts() < 0.5) {
                console.log("SOLUTION");
                _this.solutions.push(h);
                _this.printSolution(h);
                console.log("conflicts:" + h.getConflicts());
            }
        });
        console.log("the best of all %o", this.gBest);
        return done;
    };
    ArtificialBeeColony.prototype.initialize = function () {
        var newFoodIndex = 0;
        var shuffles = 0;
        for (var i = 0; i < this.FOOD_NUMBER; i++) {
            var newHoney = new Honey(this.MAX_LENGTH, this.evacuation_centers[i]);
            this.foodSources.push(newHoney);
            newFoodIndex = this.foodSources.length - 1;
            this.foodSources[newFoodIndex].computeConflicts();
        }
    };
    ArtificialBeeColony.prototype.sendEmployedBees = function () {
        var neighborBeeIndex = 0;
        var currentBee;
        var neighborBee;
        for (var i = 0; i < this.FOOD_NUMBER; i++) {
            neighborBeeIndex = this.getExclusiveRandomNumber(this.FOOD_NUMBER - 1, i);
            currentBee = this.foodSources[i];
            neighborBee = this.foodSources[neighborBeeIndex];
            this.sendToWork(currentBee, neighborBee);
        }
    };
    ArtificialBeeColony.prototype.sendOnlookerBees = function () {
        var i = 0;
        var t = 0;
        var neighborBeeIndex = 0;
        var currentBee;
        var neighborBee;
        while (t < this.FOOD_NUMBER) {
            currentBee = this.foodSources[i];
            console.log("searching onlooker bee %o", currentBee);
            if (Math.random() < currentBee.getSelectionProbability()) {
                t++;
                neighborBeeIndex = this.getExclusiveRandomNumber(this.FOOD_NUMBER - 1, i);
                neighborBee = this.foodSources[neighborBeeIndex];
                this.sendToWork(currentBee, neighborBee);
            }
            i++;
            if (i == this.FOOD_NUMBER) {
                i = 0;
            }
        }
    };
    ArtificialBeeColony.prototype.sendToWork = function (currentBee, neighborBee) {
        var newValue = 0;
        var tempValue = 0;
        var tempIndex = 0;
        var prevConflicts = 0;
        var currConflicts = 0;
        var parameterToChange = 0;
        prevConflicts = currentBee.getConflicts();
        parameterToChange = this.getRandomNumber(0, this.MAX_LENGTH - 1);
        var phi = -1 + (1 - (1)) * Math.random();
        tempValue = currentBee.getNectar(parameterToChange, EvacuationPropType.current_population);
        newValue = (tempValue + (tempValue - neighborBee.getNectar(parameterToChange, EvacuationPropType.current_population)) * phi);
        if (newValue < 0) {
            newValue = 0;
        }
        if (newValue > this.MAX_VAL) {
            newValue = this.MAX_VAL;
        }
        currentBee.setNectar(parameterToChange, newValue, EvacuationPropType.current_population);
        currentBee.computeConflicts();
        currConflicts = currentBee.getConflicts();
        if (prevConflicts < currConflicts) {
            currentBee.setNectar(parameterToChange, tempValue, EvacuationPropType.current_population);
            currentBee.setNectar(tempIndex, newValue, EvacuationPropType.current_population);
            currentBee.computeConflicts();
            currentBee.setTrials(currentBee.getTrials() + 1);
        }
        else {
            currentBee.setTrials(0);
        }
    };
    ArtificialBeeColony.prototype.sendScoutBees = function () {
        var currentBee;
        var shuffles = 0;
        for (var i = 0; i < this.FOOD_NUMBER; i++) {
            currentBee = this.foodSources[i];
            if (currentBee.getTrials() >= this.LIMIT) {
                currentBee.computeConflicts();
                currentBee.setTrials(0);
            }
        }
    };
    ArtificialBeeColony.prototype.getFitness = function () {
        var _a, _b;
        var thisFood;
        var bestScore = 0.0;
        var worstScore = 0.0;
        console.log("curr gen: %o foodsource: %o", this.epoch, this.foodSources);
        var worst = HoneyUtilities.getMaxValue(this.foodSources, (function (val) {
            return val.getConflicts();
        }));
        console.log("worst fitness: %o", worst);
        worstScore = ((_a = worst.value) === null || _a === void 0 ? void 0 : _a.getConflicts()) || Infinity;
        var minScore = ((_b = HoneyUtilities.getMinValue(this.foodSources, (function (val) {
            return val.getConflicts();
        })).value) === null || _b === void 0 ? void 0 : _b.getConflicts()) || 0;
        bestScore = worstScore - minScore;
        for (var i = 0; i < this.FOOD_NUMBER; i++) {
            thisFood = this.foodSources[i];
            thisFood.setFitness((worstScore - thisFood.getConflicts()) * 100.0 / bestScore);
        }
    };
    ArtificialBeeColony.prototype.calculateProbabilities = function () {
        console.log("curr gen: %o foodsource: %o", this.epoch, this.foodSources);
        var currFitness = this.foodSources[this.epoch].getFitness();
        var maxFoodSource = HoneyUtilities.getMaxValue(this.foodSources, (function (val) {
            return val.getFitness();
        })).value;
        console.log("max foodsource: %o", maxFoodSource);
        var maxFit = (maxFoodSource === null || maxFoodSource === void 0 ? void 0 : maxFoodSource.getFitness()) || 0;
        console.log("currFitness: %o maxfit: %o", currFitness, maxFit);
        var fitness_value = currFitness / maxFit;
        var probability = 0.9 * fitness_value + 0.1;
        this.foodSources[this.epoch].setSelectionProbability(probability);
    };
    ArtificialBeeColony.prototype.getRandomNumber = function (low, high) {
        return Math.round((high - low) * Math.random() + low);
    };
    ArtificialBeeColony.prototype.getExclusiveRandomNumber = function (high, except) {
        var done = false;
        var getRand = 0;
        while (!done) {
            getRand = HoneyUtilities.randomNumberMax(high);
            if (getRand != except) {
                done = true;
            }
        }
        return getRand;
    };
    ArtificialBeeColony.prototype.randomlyArrange = function (index) {
        var positionA = this.getRandomNumber(0, this.MAX_LENGTH - 1);
        var positionB = this.getExclusiveRandomNumber(this.MAX_LENGTH - 1, positionA);
        var thisHoney = this.foodSources[index];
        var temp = thisHoney.getNectar(positionA, EvacuationPropType.current_population);
        thisHoney.setNectar(positionA, thisHoney.getNectar(positionB, EvacuationPropType.current_population), EvacuationPropType.current_population);
        thisHoney.setNectar(positionB, temp, EvacuationPropType.current_population);
    };
    ArtificialBeeColony.prototype.memorizeBestFoodSource = function () {
        this.gBest = HoneyUtilities.getMinValue(this.foodSources, (function (val) {
            return val.getConflicts();
        })).value || undefined;
    };
    ArtificialBeeColony.prototype.printSolution = function (solution) {
        console.log("given solution: %o", solution);
    };
    ArtificialBeeColony.prototype.getSolutions = function () {
        return this.solutions;
    };
    ArtificialBeeColony.prototype.getEpoch = function () {
        return this.epoch;
    };
    ArtificialBeeColony.prototype.setMaxEpoch = function (newMaxEpoch) {
        this.MAX_EPOCH = newMaxEpoch;
    };
    ArtificialBeeColony.prototype.getPopSize = function () {
        return this.foodSources.length;
    };
    ArtificialBeeColony.prototype.getStartSize = function () {
        return this.NP;
    };
    ArtificialBeeColony.prototype.getFoodNum = function () {
        return this.FOOD_NUMBER;
    };
    ArtificialBeeColony.prototype.getLimit = function () {
        return this.LIMIT;
    };
    ArtificialBeeColony.prototype.setLimit = function (newLimit) {
        this.LIMIT = newLimit;
    };
    ArtificialBeeColony.prototype.getMaxEpoch = function () {
        return this.MAX_EPOCH;
    };
    ArtificialBeeColony.prototype.getShuffleMin = function () {
        return this.MIN_SHUFFLE;
    };
    ArtificialBeeColony.prototype.getShuffleMax = function () {
        return this.MAX_SHUFFLE;
    };
    return ArtificialBeeColony;
}());
//# sourceMappingURL=moabc.js.map