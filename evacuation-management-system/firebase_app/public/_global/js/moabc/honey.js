"use strict";
/** Honey.java
 *
 * Honey class used by ArtificialBeeColony.java
 * Also known as food source.
 * Contains the positions of the queens in a solution as well as its conflicts, trials, fitness and selection probability.
 * Base code at http://mf.erciyes.edu.tr/abc/
 *
 * @author: James M. Bayon-on
 * @version: 1.3
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoneyUtilities = exports.Honey = void 0;
const utilities_1 = require("./utilities");
const evacuation_1 = require("./evacuation");
class Honey {
    /** Instantiate a Honey.
     *
     * @param: size of n
     */
    constructor(size) {
        this.id = "honey*" + utilities_1.Utilities.genID(5);
        this.MAX_LENGTH = size;
        this.nectar = []; //new int[this.MAX_LENGTH];
        this.conflicts = 0;
        this.trials = 0;
        this.fitness = 0.0;
        this.selectionProbability = 0.0;
        this.initNectar();
    }
    /** Compares two Honeys.
     *
     * @param: a Honey to compare with
     */
    compareTo(h) {
        return this.conflicts - h.getConflicts();
    }
    /** Initializes the Honey into diagonal queens.
     *
     */
    initNectar() {
        for (let i = 0; i < this.MAX_LENGTH; i++) { //initialize the solution to 1... n
            this.nectar[i] = new evacuation_1.EvacuationCenter(this.id + "-" + i);
            this.nectar[i].current_population = HoneyUtilities.randomNumber(100, 200);
            this.nectar[i].population_capacity = HoneyUtilities.randomNumber(100, 200);
            this.nectar[i].evacuation_size = HoneyUtilities.randomNumber(50, 300);
            //this.nectar[i].current_population = i;
        }
    }
    /** Computes the conflicts in the nxn board.
     *
     */
    computeConflicts() {
        let carrying_sum = 0;
        for (let i = 0; i < this.MAX_LENGTH; i++) {
            carrying_sum += (this.nectar[i].current_population / this.nectar[i].population_capacity);
        }
        let density_sum = 0;
        for (let i = 0; i < this.MAX_LENGTH; i++) {
            carrying_sum += (this.nectar[i].current_population / this.nectar[i].evacuation_size);
        }
        this.setConflicts(carrying_sum + density_sum);
        /*  //String board[][] = new String[MAX_LENGTH][MAX_LENGTH];
        let board: Board = new Board()
        let x = 0; //row
        let y = 0; //column
        let tempx = 0;
        let tempy = 0;

        let dx = [-1, 1, -1, 1]; //to check for diagonal
        let dy = [-1, 1, 1, -1]; //paired with dx to check for diagonal

        let done = false; //used to check is checking fo diagonal is out of bounds
        let conflicts = 0; //number of conflicts found

        board = this.clearBoard(board); //clears the board into empty strings
        board = this.plotQueens(board); //plots the Q in the board

        // Walk through each of the Queens and compute the number of conflicts.
        for (let i = 0; i < this.MAX_LENGTH; i++) {
            x = i;
            y = this.nectar[i]; //will result to no horizontal and vertical conflicts because it will result to diagonal

            // Check diagonals.
            for (let j = 0; j < 4; j++) { //because of dx and dy where there are 4 directions for diagonal searching for conflicts
                tempx = x;
                tempy = y; // store coordinate in temp
                done = false;

                while (!done) {
                    tempx += dx[j];
                    tempy += dy[j];

                    if ((tempx < 0 || tempx >= this.MAX_LENGTH) || (tempy < 0 || tempy >= this.MAX_LENGTH)) { //if exceeds board
                        done = true;
                    } else {
                        //if(board[tempx][tempy] == "Q") {
                        if (board.get(tempx, tempy) == "Q") {
                            conflicts++;
                        }
                    }
                }
            }
        }

        this.conflicts = conflicts; //set conflicts of this chromosome */
    }
    /** Plots the queens in the board.
     *
     * @param: a nxn board
     */
    /* public plotQueens(board: Board): Board {
        for (let i = 0; i < this.MAX_LENGTH; i++) {
            //board[i][this.nectar[i]] = "Q";
            board.set(i, this.nectar[i], "Q")
        }
        return board;
    }
 */
    /** Clears the board.
     *
     * @param: a nxn board
     */
    /* public clearBoard(board: Board): Board {
        // Clear the board.
        for (let i = 0; i < this.MAX_LENGTH; i++) {
            for (let j = 0; j < this.MAX_LENGTH; j++) {
                //board[i][j] = "";
                board.set(i, j, "")
            }
        }
        return board;
    } */
    /** Gets the conflicts of the Honey.
     *
     * @return: number of conflicts of the honey
     */
    getConflicts() {
        return this.conflicts;
    }
    /** Sets the conflicts of the honey.
     *
     * @param: new number of conflicts
     */
    setConflicts(mConflicts) {
        this.conflicts = mConflicts;
    }
    /** Gets the selection probability of the honey.
     *
     * @return: selection probability of the honey
     */
    getSelectionProbability() {
        return this.selectionProbability;
    }
    /** sets the selection probability of the honey.
     *
     * @param: new selection probability of the honey
     */
    setSelectionProbability(mSelectionProbability) {
        this.selectionProbability = mSelectionProbability;
    }
    /** Gets the fitness of a honey.
     *
     * @return: fitness of honey
     */
    getFitness() {
        return this.fitness;
    }
    /** Sets the fitness of the honey.
     *
     * @param: new fitness
     */
    setFitness(mFitness) {
        this.fitness = mFitness;
    }
    /** Gets the data on a specified index.
     *
     * @param: index of data
     * @return: position of queen
     */
    getNectar(index, type) {
        //return this.nectar[index][type] as number;
        /* if (type == EvacuationPropType.population_capacity){
            return this.nectar[index].population_capacity
        } else {
            return this.nectar[index].
        } */
        switch (type) {
            case evacuation_1.EvacuationPropType.current_population:
                return this.nectar[index].current_population;
            /* case EvacuationPropType.evacuation_size:
                return this.nectar[index].evacuation_size */
            default:
                return 0;
        }
    }
    /** Gets the index on a specified data.
     *
     * @param: index of data
     * @return: position of queen
     */
    getIndex(value, type) {
        let k = 0;
        for (; k < this.MAX_LENGTH; k++) {
            /* if (this.getNectar(k, type) == value) {
                return k
            } */
            if (this.nectar[k].current_population == value) {
                return k;
            }
            /* else {
                let type_nectar = typeof this.nectar[k].current_population
                let type_value  = typeof value
                console.log("find nect value: %o vs val: %o are equal?: %o", this.nectar[k].current_population, value, this.nectar[k].current_population == value)
                console.log("find type nect: %o vs type val: %o", type_nectar, type_value)
                console.log("find nectars: %o", this.nectar[k])
            } */
        }
        /* console.log("find nectars: %o", this.nectar)
        console.log("find value: %o, type: %o", value, type)
        console.log("find index: %o", k)
        console.trace() */
        return null;
    }
    /** Sets the data on a specified index.
     *
     * @param: index of data
     * @param: new position of queen
     */
    setNectar(index, value, type) {
        //this.nectar[index] = value;
        console.log("honeybee nectar %o", this.nectar);
        console.log("set value index: %o, value: %o, type: %o", index, value, type);
        if (index == null) {
            console.log("fatalError()");
            console.trace();
        }
        switch (type) {
            case evacuation_1.EvacuationPropType.current_population:
                return this.nectar[index].current_population = value;
            /* case EvacuationPropType.current_inventory:
                return this.nectar[index].current_inventory = value */
            default:
                return 0;
        }
    }
    /** Gets the number of trials of a solution.
     *
     * @return: number of trials
     */
    getTrials() {
        return this.trials;
    }
    /** Sets the number of trials of a solution.
     *
     * @param: new number of trials
     */
    setTrials(trials) {
        this.trials = trials;
    }
    /** Gets the max length.
     *
     * @return: max length
     */
    getMaxLength() {
        return this.MAX_LENGTH;
    }
}
exports.Honey = Honey;
/* Array.prototype.max = function (where: CallBackNumber) {
    // code to remove "o"
    let index = Math.max(...this.map(where));
    return this[index]
}

Array.prototype.min = function (where: CallBackNumber) {
    // code to remove "o"
    let index = Math.min(...this.map(where));
    return this[index]
} */
class HoneyUtilities {
    static getMaxValue(arr, where) {
        let maxHoney = {
            value: null,
            index: undefined
        };
        let max = -100000;
        arr.forEach((value, index) => {
            let curr_value = where(value);
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
    static getMinValue(arr, where) {
        let minHoney = {
            value: null,
            index: undefined
        };
        let min = Infinity;
        arr.forEach((value, index) => {
            let curr_value = where(value);
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
    static randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    static randomNumberMax(max) {
        return this.randomNumber(0, max);
    }
}
exports.HoneyUtilities = HoneyUtilities;
//# sourceMappingURL=honey.js.map