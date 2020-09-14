"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* ArtificialBeeColony.java
 *
 * Solves the N-Queens puzzle using Artificial Bee Colony Algorithm.
 * Code inspired by the java code for abc algorith at artificial bee colony's website
 * Found at http://mf.erciyes.edu.tr/abc/.
 *
 * Special thanks to Professor Bahriye Basturk Akay for pointing me to abc's website for the source code
 * http://mf.erciyes.edu.tr/abc/software.htm
 *
 * @author: James M. Bayon-on
 * @version: 1.0
 */
const honey_1 = require("./honey");
const evacuation_1 = require("./evacuation");
class ArtificialBeeColony {
    /* Instantiates the artificial bee colony algorithm along with its parameters.
     *
     * @param: size of n queens
     */
    constructor(max_length = 10, max_val = 200, population_size = 20, trial_limit = 50, max_epoch = 1000, min_shuffle = 8, max_shuffle = 20) {
        /** food sources contains the value of Evacuation Center */
        this.foodSources = [];
        this.solutions = [];
        this.MAX_VAL = max_val;
        this.MAX_LENGTH = max_length;
        this.NP = population_size; //pop size 20 to 40 or even 100
        this.FOOD_NUMBER = this.NP / 2;
        this.LIMIT = trial_limit;
        this.MAX_EPOCH = max_epoch;
        this.MIN_SHUFFLE = min_shuffle;
        this.MAX_SHUFFLE = max_shuffle;
        this.gBest = undefined;
        this.epoch = 0;
    } //constructor
    /** Starts the MOABC
     *
     */
    algorithm() {
        this.foodSources = [];
        this.solutions = [];
        //rand = new Random();
        let done = false;
        let epoch = 0;
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
                // This is here simply to show the runtime status.
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
        this.foodSources.forEach((h) => {
            if (h.getConflicts() < 0.5) {
                console.log("SOLUTION");
                this.solutions.push(h); //.add(h);
                this.printSolution(h);
                console.log("conflicts:" + h.getConflicts());
            }
        });
        console.log("the best of all %o", this.gBest);
        return done;
    }
    /** Initializes all of the solutions' placement of queens in ramdom positions.
     *
     */
    initialize() {
        let newFoodIndex = 0;
        let shuffles = 0;
        for (let i = 0; i < this.FOOD_NUMBER; i++) {
            let newHoney = new honey_1.Honey(this.MAX_LENGTH);
            this.foodSources.push(newHoney);
            // reference get latest index --> this.foodSources.indexOf(newHoney);
            newFoodIndex = this.foodSources.length - 1;
            shuffles = this.getRandomNumber(this.MIN_SHUFFLE, this.MAX_SHUFFLE);
            for (let j = 0; j < shuffles; j++) {
                this.randomlyArrange(newFoodIndex);
            }
            this.foodSources[newFoodIndex].computeConflicts();
        } // i
    } //initialize
    /** Sends the employed bees to optimize the solution
     *
     */
    sendEmployedBees() {
        let neighborBeeIndex = 0;
        let currentBee;
        let neighborBee;
        for (let i = 0; i < this.FOOD_NUMBER; i++) {
            neighborBeeIndex = this.getExclusiveRandomNumber(this.FOOD_NUMBER - 1, i);
            currentBee = this.foodSources[i];
            neighborBee = this.foodSources[neighborBeeIndex];
            this.sendToWork(currentBee, neighborBee);
        }
    } //sendEmployedBees
    /**
     * Sends the onlooker bees to optimize the solution.
     * Onlooker bees work on the best solutions from the employed bees. best solutions have high selection probability.
     */
    sendOnlookerBees() {
        let i = 0;
        let t = 0;
        let neighborBeeIndex = 0;
        let currentBee;
        let neighborBee;
        while (t < this.FOOD_NUMBER) {
            currentBee = this.foodSources[i];
            console.log("searching onlooker bee %o", currentBee);
            //** reference --> if(rand.nextDouble() < currentBee.getSelectionProbability()) {
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
    } //sendOnlookerBees
    /** The optimization part of the algorithm. improves the currentbee by choosing a
     * random neighbor bee. the changes is a randomly generated number of times to try and improve the current solution.
     * @param: the currently selected bee
     * @param: a randomly selected neighbor bee
     * @param: the number of times to try and improve the solution
     */
    sendToWork(currentBee, neighborBee) {
        let newValue = 0;
        let tempValue = 0;
        let tempIndex = 0;
        let prevConflicts = 0;
        let currConflicts = 0;
        let parameterToChange = 0;
        //get number of conflicts
        prevConflicts = currentBee.getConflicts();
        //The parameter to be changed is determined randomly
        parameterToChange = this.getRandomNumber(0, this.MAX_LENGTH - 1);
        /*v_{ij}=x_{ij}+\phi_{ij}*(x_{kj}-x_{ij})
        solution[param2change]=Foods[i][param2change]+(Foods[i][param2change]-Foods[neighbour][param2change])*(r-0.5)*2;
        */
        ///!!!REFERENCE
        const phi = -1 + (1 - (1)) * Math.random();
        tempValue = currentBee.getNectar(parameterToChange, evacuation_1.EvacuationPropType.current_population);
        newValue = (tempValue + (tempValue - neighborBee.getNectar(parameterToChange, evacuation_1.EvacuationPropType.current_population)) * phi);
        //trap the value within upper bound and lower bound limits
        if (newValue < 0) {
            newValue = 0;
        }
        if (newValue > this.MAX_VAL) {
            newValue = this.MAX_VAL;
        }
        //get the index of the new value
        //tempIndex = currentBee.getIndex(newValue, EvacuationPropType.current_population);
        //swap
        currentBee.setNectar(parameterToChange, newValue, evacuation_1.EvacuationPropType.current_population);
        //currentBee.setNectar(tempIndex, tempValue, EvacuationPropType.current_population);
        currentBee.computeConflicts();
        currConflicts = currentBee.getConflicts();
        //greedy selection
        if (prevConflicts < currConflicts) { //No improvement
            currentBee.setNectar(parameterToChange, tempValue, evacuation_1.EvacuationPropType.current_population);
            currentBee.setNectar(tempIndex, newValue, evacuation_1.EvacuationPropType.current_population);
            currentBee.computeConflicts();
            currentBee.setTrials(currentBee.getTrials() + 1);
        }
        else { //improved solution
            currentBee.setTrials(0);
        }
    } //sendToWork
    /** Finds food sources which have been abandoned/reached the limit.
     * Scout bees will generate a totally random solution from the existing and it will also reset its trials back to zero.
     *
     */
    sendScoutBees() {
        let currentBee;
        let shuffles = 0;
        for (let i = 0; i < this.FOOD_NUMBER; i++) {
            currentBee = this.foodSources[i];
            if (currentBee.getTrials() >= this.LIMIT) {
                shuffles = this.getRandomNumber(this.MIN_SHUFFLE, this.MAX_SHUFFLE);
                for (let j = 0; j < shuffles; j++) {
                    this.randomlyArrange(i);
                }
                currentBee.computeConflicts();
                currentBee.setTrials(0);
            }
        }
    } //sendScoutBees
    /* Sets the fitness of each solution based on its conflicts
     *
     */
    getFitness() {
        var _a, _b;
        // Lowest errors = 100%, Highest errors = 0%
        let thisFood;
        let bestScore = 0.0;
        let worstScore = 0.0;
        // The worst score would be the one with the highest energy, best would be lowest.
        console.log("curr gen: %o foodsource: %o", this.epoch, this.foodSources);
        const worst = honey_1.HoneyUtilities.getMaxValue(this.foodSources, ((val) => {
            return val.getConflicts();
        }));
        console.log("worst fitness: %o", worst);
        worstScore = ((_a = worst.value) === null || _a === void 0 ? void 0 : _a.getConflicts()) || Infinity;
        let minScore = ((_b = honey_1.HoneyUtilities.getMinValue(this.foodSources, ((val) => {
            return val.getConflicts();
        })).value) === null || _b === void 0 ? void 0 : _b.getConflicts()) || 0;
        bestScore = worstScore - minScore;
        // Convert to a weighted percentage.
        for (let i = 0; i < this.FOOD_NUMBER; i++) {
            thisFood = this.foodSources[i];
            thisFood.setFitness((worstScore - thisFood.getConflicts()) * 100.0 / bestScore);
        }
    } //getFitness
    /** Sets the selection probability of each solution. the higher the fitness the greater the probability
     *
     */
    calculateProbabilities() {
        console.log("curr gen: %o foodsource: %o", this.epoch, this.foodSources);
        let currFitness = this.foodSources[this.epoch].getFitness();
        let maxFoodSource = honey_1.HoneyUtilities.getMaxValue(this.foodSources, ((val) => {
            return val.getFitness();
        })).value;
        console.log("max foodsource: %o", maxFoodSource);
        let maxFit = (maxFoodSource === null || maxFoodSource === void 0 ? void 0 : maxFoodSource.getFitness()) || 0;
        console.log("currFitness: %o maxfit: %o", currFitness, maxFit);
        let fitness_value = currFitness / maxFit;
        let probability = 0.9 * fitness_value + 0.1;
        this.foodSources[this.epoch].setSelectionProbability(probability);
    } //calculateProbabilities
    /** Gets a random number in the range of the parameters
     *
     * @param: the minimum random number
     * @param: the maximum random number
     * @return: random number
     */
    getRandomNumber(low, high) {
        return Math.round((high - low) * Math.random() + low);
    } //getRandomNumber
    /** Gets a random number with the exception of the parameter
     *
     * @param: the maximum random number
     * @param: number to to be chosen
     * @return: random number
     */
    getExclusiveRandomNumber(high, except) {
        let done = false;
        let getRand = 0;
        while (!done) {
            getRand = honey_1.HoneyUtilities.randomNumberMax(high); //Math.random(high) //rand.nextInt(high);
            if (getRand != except) {
                done = true;
            }
        }
        return getRand;
    } //getExclusiveRandomNumber
    /** Changes a position of the queens in a particle by swapping a randomly selected position
     *
     * @param: index of the solution
     */
    randomlyArrange(index) {
        let positionA = this.getRandomNumber(0, this.MAX_LENGTH - 1);
        let positionB = this.getExclusiveRandomNumber(this.MAX_LENGTH - 1, positionA);
        let thisHoney = this.foodSources[index];
        let temp = thisHoney.getNectar(positionA, evacuation_1.EvacuationPropType.current_population);
        thisHoney.setNectar(positionA, thisHoney.getNectar(positionB, evacuation_1.EvacuationPropType.current_population), evacuation_1.EvacuationPropType.current_population);
        thisHoney.setNectar(positionB, temp, evacuation_1.EvacuationPropType.current_population);
    } //randomlyArrange
    /** Memorizes the best solution
     * sets gBest with the lowest conflict or objective value
     */
    memorizeBestFoodSource() {
        this.gBest = honey_1.HoneyUtilities.getMinValue(this.foodSources, ((val) => {
            return val.getConflicts();
        })).value || undefined;
    } //memorizeBestFoodSource
    /** Prints value of the given solution
     *
     * @param: a chromosome
     */
    printSolution(solution) {
        console.log("given solution: %o", solution);
    }
    /** gets the solutions
     *
     * @return: solutions
     */
    getSolutions() {
        return this.solutions;
    }
    /** gets the epoch
     *
     * @return: epoch
     */
    getEpoch() {
        return this.epoch;
    }
    /** sets the max epoch
     *
     * @return: new max epoch value
     */
    setMaxEpoch(newMaxEpoch) {
        this.MAX_EPOCH = newMaxEpoch;
    }
    /** gets the population size
     *
     * @return: pop size
     */
    getPopSize() {
        return this.foodSources.length;
    }
    /** gets the start size
     *
     * @return: start size
     */
    getStartSize() {
        return this.NP;
    }
    /** gets the number of food
     *
     * @return: food number
     */
    getFoodNum() {
        return this.FOOD_NUMBER;
    }
    /** gets the limit for trials for all food sources
     *
     * @return: number of trials limit
     */
    getLimit() {
        return this.LIMIT;
    }
    /** sets the limit for trials for all food sources
     *
     * @param: new trial limit
     */
    setLimit(newLimit) {
        this.LIMIT = newLimit;
    }
    /** gets the max epoch
     *
     * @return: max epoch
     */
    getMaxEpoch() {
        return this.MAX_EPOCH;
    }
    /** gets the min shuffle
     *
     * @return: min shuffle
     */
    getShuffleMin() {
        return this.MIN_SHUFFLE;
    }
    /** gets the max shuffle
     *
     * @return: max shuffle
     */
    getShuffleMax() {
        return this.MAX_SHUFFLE;
    }
} //ArtificialBeeColony
exports.default = ArtificialBeeColony;
//# sourceMappingURL=moabc.js.map