
var logfile = ""
var logCount = 1

var ArtificialBeeColony = (function () {
    function ArtificialBeeColony(max_length, max_val, population_size, trial_limit, max_epoch, min_shuffle, max_shuffle, evacuation_centers, evacuation_history) {
        if (max_length === void 0) { max_length = 10; }
        if (max_val === void 0) { max_val = 200; }
        if (population_size === void 0) { population_size = 20; }
        if (trial_limit === void 0) { trial_limit = 50; }
        if (max_epoch === void 0) { max_epoch = 1000; }
        if (min_shuffle === void 0) { min_shuffle = 8; }
        if (max_shuffle === void 0) { max_shuffle = 20; }
        if (evacuation_centers === void 0) { evacuation_centers = []; }
        if (evacuation_history === void 0) { evacuation_history = []; }
        this.foodSources = [];
        this.solutions = [];
        this.iterations = []
        this.evacuation_centers = [];
        this.evacuation_history = [];
        var capacity = evacuation_centers.map(function (evac) {
            return evac.population_capacity;
        });
        this.MAX_VAL = Math.max.apply(Math, capacity);
        this.MAX_LENGTH = max_length;
        var size = population_size > evacuation_centers.length ? evacuation_centers.length : population_size;
        this.NP = size;
        this.FOOD_NUMBER = size;
        this.LIMIT = trial_limit;
        this.MAX_EPOCH = max_epoch;
        this.MIN_SHUFFLE = min_shuffle;
        this.MAX_SHUFFLE = max_shuffle;
        this.evacuation_centers = evacuation_centers;
        this.evacuation_history = evacuation_history;
        this.gBest = undefined;
        this.epoch = 0;
    }
    ArtificialBeeColony.prototype.algorithm = function () {
        var _this = this;
        this.foodSources = [];
        this.solutions = [];
        var done = false;
        var epoch = 0;

        if (this.FOOD_NUMBER <= 2) {
            throw "FOOD NUMBER IS EMPTY"
        }



        this.initialize();
        this.memorizeBestFoodSource();
        while (!done) {
            this.addLog(`iteration current ${epoch}, max: ${this.MAX_EPOCH}`);
            if (epoch < this.MAX_EPOCH) {

                if (this.gBest != null && this.gBest.getConflicts() < 0.01) {
                    done = true;
                }

                this.sendEmployedBees();

                this.getFitness();

                this.calculateProbabilities();

                this.sendOnlookerBees();

                this.memorizeBestFoodSource();

                this.sendScoutBees();

                this.iterations.push({
                    epoch,
                    objective: this.gBest.getConflicts(),
                    fitness: this.gBest.getFitness()
                })

                epoch++;

            }
            else {
                done = true;
            }
        }
        if (epoch == this.MAX_EPOCH) {

            done = false;
        }


        this.foodSources.forEach(function (h) {
            if (h.getConflicts() < 0.05) {

                _this.solutions.push(h);
                _this.printSolution(h);

            }
        });

        return done;
    };
    ArtificialBeeColony.prototype.initialize = function () {
        var newFoodIndex = 0;
        
        for (var i = 0; i < this.FOOD_NUMBER; i++) {

            let evacuation_history = this.evacuation_history.filter((history) => {
                return history.evac_id == this.evacuation_centers[i].id 
            })

            var newHoney = new Honey(this.MAX_LENGTH, this.evacuation_centers[i], evacuation_history);
            this.foodSources.push(newHoney);
            newFoodIndex = this.foodSources.length - 1;
            this.foodSources[newFoodIndex].computeConflicts();
        }
    };

    ArtificialBeeColony.prototype.addLog = function (log) {
        logfile +=  ( logCount +`. ` + log + `\n`)
        logCount++
    }


    ArtificialBeeColony.prototype.sendEmployedBees = function () {
        var neighborBeeIndex = 0;
        var currentBee;
        var neighborBee;

        this.addLog(`(sendEmployedBees)`)
        
        for (var i = 0; i < this.FOOD_NUMBER; i++) {
            neighborBeeIndex = this.getExclusiveRandomNumber(this.FOOD_NUMBER - 1, i);
            currentBee = this.foodSources[i];
            neighborBee = this.foodSources[neighborBeeIndex];
            this.addLog(`(sendEmployedBees) current bee index ${neighborBeeIndex}, neighbor bee index ${i}`)
            this.sendToWork(currentBee, neighborBee);
        }
    };
    ArtificialBeeColony.prototype.sendOnlookerBees = function () {
        var i = 0;
        var t = 0;
        var neighborBeeIndex = 0;
        var currentBee;
        var neighborBee;
        
        this.addLog(`(sendOnlookerBees) selectively search from the current foodSources`)

        while (t < this.FOOD_NUMBER) {
            currentBee = this.foodSources[i];
            
            this.addLog(`(sendOnlookerBees) current bee ${i}`)
            this.addLog(`(sendOnlookerBees) search index ${t}`)
            let randomMath  = Math.random()
            let selection   = currentBee.getSelectionProbability()
            this.addLog(`(sendOnlookerBees) generate random value between 0,1 = ${randomMath}`)
            this.addLog(`(sendOnlookerBee) compare if the currentBee's probability (${selection}) > random value (${randomMath})`)
            if (randomMath < selection) {
                t++;
                this.addLog(`(sendOnlookerBee) increment search ${t}`)
                neighborBeeIndex = this.getExclusiveRandomNumber(this.FOOD_NUMBER - 1, i);
                this.addLog(`(sendOnlookerBee) get random index for neighborBee ${neighborBeeIndex}`)
                neighborBee = this.foodSources[neighborBeeIndex];
                this.sendToWork(currentBee, neighborBee);
            }

            this.addLog(`(sendOnlookerBee) increment food source index`, i)
            i++;

            this.addLog(`(sendOnlookerBee) if food source index is max number of foodsources set the value of index to 0`)
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
        var phi = Math.random() * (1 - (-1)) + -1 //-1 + (1 - (1)) * Math.random();

        this.addLog(`(sendToWork) phi - generate random value between -1 and 1  value: ${phi}`)

        tempValue = currentBee.getNectar(parameterToChange, EvacuationPropType.current_population);

        this.addLog(`(sendToWork) tempValue: ${tempValue}`)

        newValue = (tempValue + (tempValue - neighborBee.getNectar(parameterToChange, EvacuationPropType.current_population)) * phi);

        this.addLog(`(sendToWork) newValue: ${newValue}`)

        this.addLog(`(sendToWork) check if newValue: ${newValue} is between lower 0 and highest ${this.MAX_VAL}`)
        if (newValue < 0) {
            newValue = 0;
        }
        if (newValue > this.MAX_VAL) {
            newValue = this.MAX_VAL;
        }
        this.addLog(`(sendToWork) set the nectar of current be to the newValue: ${newValue}`)
        currentBee.setNectar(parameterToChange, newValue, EvacuationPropType.current_population);
        this.addLog(`(sendToWork) compute conflict of the current bee`)
        currentBee.computeConflicts();
        currConflicts = currentBee.getConflicts();

        this.addLog(`(sendToWork) compare conflict of the current bee with the newValue and the tempValue`)
        this.addLog(`(sendToWork) compare conflict of the current bee with the prevConflict ${prevConflicts}, currConflict ${currConflicts}`)
        
        if (prevConflicts < currConflicts) {
            this.addLog(`(sendToWork) if the currConflict is higher than prevConflict set the trial set the nectar back of the current bee with the tempvalue`)
            this.addLog(`(sendToWork) increment to 1`)
            currentBee.setNectar(parameterToChange, tempValue, EvacuationPropType.current_population);
            currentBee.setNectar(tempIndex, newValue, EvacuationPropType.current_population);
            currentBee.computeConflicts();
            currentBee.setTrials(currentBee.getTrials() + 1);
        }
        else {
            this.addLog(`(sendToWork) if the currConflict is lower than prevConflict set the trial to 0`)
            currentBee.setTrials(0);
        }
    };
    ArtificialBeeColony.prototype.sendScoutBees = function () {
        var currentBee;
        
        this.addLog(`(sendScoutBees) for each food sources with the the trial value reach Trial Limit (${this.LIMIT})`)

        for (var i = 0; i < this.FOOD_NUMBER; i++) {
            currentBee = this.foodSources[i];
            if (currentBee.getTrials() >= this.LIMIT) {
                this.addLog(`(sendScoutBees) compute conflicts of the currentBee ${i}`)
                this.addLog(`(sendScoutBees) set trial of currentBee to 0`)
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
        this.addLog(`(getFitness) get the fitness of the foodSource`)
        var worst = HoneyUtilities.getMaxValue(this.foodSources, (function (val) {
            return val.getConflicts();
        }));

        this.addLog(`(getFitness) get the worst value of the foodSource ${worst.value.getConflicts()}`)


        worstScore = ((_a = worst.value) === null || _a === void 0 ? void 0 : _a.getConflicts()) || Infinity;
        var minScore = ((_b = HoneyUtilities.getMinValue(this.foodSources, (function (val) {
            return val.getConflicts();
        })).value) === null || _b === void 0 ? void 0 : _b.getConflicts()) || 0;

        this.addLog(`(getFitness) get the best value of the foodSource ${minScore}`)

        bestScore = worstScore - minScore;

        this.addLog(`(getFitness) get the bestScore of the foodSource ${bestScore}`)

        this.addLog(`(getFitness) get the fitness of each foodsource`)
        for (var i = 0; i < this.FOOD_NUMBER; i++) {
            thisFood = this.foodSources[i];
            
            let fitness = (worstScore - thisFood.getConflicts()) * 100.0 / bestScore
            this.addLog(`(getFitness) food source ${i}, fitness: ${fitness}`)
            thisFood.setFitness(fitness);
        }
    };
    ArtificialBeeColony.prototype.calculateProbabilities = function () {
        
        this.addLog(`(calculateProbabilities) calculate the probabilities of the current generation of food source ${this.epoch}`)

        var currFitness = this.foodSources[this.epoch].getFitness();

        this.addLog(`(calculateProbabilities) get the fitness value of the current generation`, currFitness)

        var maxFoodSource = HoneyUtilities.getMaxValue(this.foodSources, (function (val) {
            return val.getFitness();
        })).value;
        var maxFit = (maxFoodSource === null || maxFoodSource === void 0 ? void 0 : maxFoodSource.getFitness()) || 0;

        this.addLog(`(calculateProbabilities) get the maximum fitness`, maxFit)

        var fitness_value = currFitness / maxFit;

        this.addLog(`(calculateProbabilities) get the fitness value of the current fitness of the generation over maxFitness`, fitness_value)

        var probability = 0.9 * fitness_value + 0.1;

        this.addLog(`(calculateProbabilities) calculate the probability (prob = 0.9 * fitness_value + 0.1) = ${probability}`)

        this.addLog(`(calculateProbabilities) set the probability value to current generation of food source`)
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
        this.addLog(`(memorizeBestFoodSource) get the best food source with the lowest objective value ${this.gBest.getConflicts()}`)
    };
    ArtificialBeeColony.prototype.printSolution = function (solution) {

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