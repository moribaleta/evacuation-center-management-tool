var ArtificialBeeColony = (function () {
    function ArtificialBeeColony(n) {
        this.MAX_LENGTH = n;
        this.NP = 40;
        this.FOOD_NUMBER = this.NP / 2;
        this.LIMIT = 50;
        this.MAX_EPOCH = 1000;
        this.MIN_SHUFFLE = 8;
        this.MAX_SHUFFLE = 20;
        this.gBest = null;
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
                if (this.gBest != null && this.gBest.getConflicts() == 0) {
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
            if (h.getConflicts() == 0) {
                console.log("SOLUTION");
                _this.solutions.push(h);
                _this.printSolution(h);
                console.log("conflicts:" + h.getConflicts());
            }
        });
        return done;
    };
    ArtificialBeeColony.prototype.sendEmployedBees = function () {
        var neighborBeeIndex = 0;
        var currentBee = null;
        var neighborBee = null;
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
        var currentBee = null;
        var neighborBee = null;
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
        tempValue = currentBee.getNectar(parameterToChange);
        newValue = (tempValue + (tempValue - neighborBee.getNectar(parameterToChange)) * (Math.random() - 0.5) * 2);
        if (newValue < 0) {
            newValue = 0;
        }
        if (newValue > this.MAX_LENGTH - 1) {
            newValue = this.MAX_LENGTH - 1;
        }
        tempIndex = currentBee.getIndex(newValue);
        currentBee.setNectar(parameterToChange, newValue);
        currentBee.setNectar(tempIndex, tempValue);
        currentBee.computeConflicts();
        currConflicts = currentBee.getConflicts();
        if (prevConflicts < currConflicts) {
            currentBee.setNectar(parameterToChange, tempValue);
            currentBee.setNectar(tempIndex, newValue);
            currentBee.computeConflicts();
            currentBee.setTrials(currentBee.getTrials() + 1);
        }
        else {
            currentBee.setTrials(0);
        }
    };
    ArtificialBeeColony.prototype.sendScoutBees = function () {
        var currentBee = null;
        var shuffles = 0;
        for (var i = 0; i < this.FOOD_NUMBER; i++) {
            currentBee = this.foodSources[i];
            if (currentBee.getTrials() >= this.LIMIT) {
                shuffles = this.getRandomNumber(this.MIN_SHUFFLE, this.MAX_SHUFFLE);
                for (var j = 0; j < shuffles; j++) {
                    this.randomlyArrange(i);
                }
                currentBee.computeConflicts();
                currentBee.setTrials(0);
            }
        }
    };
    ArtificialBeeColony.prototype.getFitness = function () {
        var thisFood = null;
        var bestScore = 0.0;
        var worstScore = 0.0;
        console.log("curr gen: %o foodsource: %o", this.epoch, this.foodSources);
        var worst = getMaxValue(this.foodSources, (function (val) { return val.getConflicts(); }));
        console.log("worst fitness: %o", worst);
        worstScore = worst.value.getConflicts();
        var minScore = getMinValue(this.foodSources, (function (val) { return val.getConflicts(); })).value.getConflicts();
        bestScore = worstScore - minScore;
        for (var i = 0; i < this.FOOD_NUMBER; i++) {
            thisFood = this.foodSources[i];
            thisFood.setFitness((worstScore - thisFood.getConflicts()) * 100.0 / bestScore);
        }
    };
    ArtificialBeeColony.prototype.calculateProbabilities = function () {
        console.log("curr gen: %o foodsource: %o", this.epoch, this.foodSources);
        var currFitness = this.foodSources[this.epoch].getFitness();
        var maxFoodSource = getMaxValue(this.foodSources, (function (val) {
            return val.getFitness();
        })).value;
        console.log("max foodsource: %o", maxFoodSource);
        var maxFit = maxFoodSource.getFitness();
        console.log("currFitness: %o maxfit: %o", currFitness, maxFit);
        var fitness_value = currFitness / maxFit;
        var probability = 0.9 * fitness_value + 0.1;
        this.foodSources[this.epoch].setSelectionProbability(probability);
    };
    ArtificialBeeColony.prototype.initialize = function () {
        var newFoodIndex = 0;
        var shuffles = 0;
        for (var i = 0; i < this.FOOD_NUMBER; i++) {
            var newHoney = new Honey(this.MAX_LENGTH);
            this.foodSources.push(newHoney);
            newFoodIndex = this.foodSources.length - 1;
            shuffles = this.getRandomNumber(this.MIN_SHUFFLE, this.MAX_SHUFFLE);
            for (var j = 0; j < shuffles; j++) {
                this.randomlyArrange(newFoodIndex);
            }
            this.foodSources[newFoodIndex].computeConflicts();
        }
    };
    ArtificialBeeColony.prototype.getRandomNumber = function (low, high) {
        return Math.round((high - low) * Math.random() + low);
    };
    ArtificialBeeColony.prototype.getExclusiveRandomNumber = function (high, except) {
        var done = false;
        var getRand = 0;
        while (!done) {
            getRand = randomNumberMax(high);
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
        var temp = thisHoney.getNectar(positionA);
        thisHoney.setNectar(positionA, thisHoney.getNectar(positionB));
        thisHoney.setNectar(positionB, temp);
    };
    ArtificialBeeColony.prototype.memorizeBestFoodSource = function () {
        this.gBest = getMinValue(this.foodSources, (function (val) {
            return val.getConflicts();
        })).value;
    };
    ArtificialBeeColony.prototype.printSolution = function (solution) {
        var board = new Board();
        for (var x = 0; x < this.MAX_LENGTH; x++) {
            for (var y = 0; y < this.MAX_LENGTH; y++) {
                board.set(x, y, "");
            }
        }
        for (var x = 0; x < this.MAX_LENGTH; x++) {
            board.set(x, solution.getNectar(x), "Q");
        }
        console.log("Board:");
        for (var y = 0; y < this.MAX_LENGTH; y++) {
            var string = "";
            for (var x = 0; x < this.MAX_LENGTH; x++) {
                if (board.get(x, y) == "Q") {
                    string += "Q ";
                }
                else {
                    string += ". ";
                }
                console.log(string);
            }
            console.log(string);
        }
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
//# sourceMappingURL=ArtificialBeeColony.js.map