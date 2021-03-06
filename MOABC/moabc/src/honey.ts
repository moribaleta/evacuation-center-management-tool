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




class Honey {
    id: string = "honey*" + Utilities.genID(5)

    ///number of nectars
    private MAX_LENGTH: number;

    ///Nectars of EvacuationCenter
    private nectar: EvacuationHistory[]; //solution or placement of queen: numbers

    ///number of trials/failed attempt on the solution
    private trials: number;

    ///objective value
    private conflicts: number;
    ///fitness value
    private fitness: number;

    private selectionProbability: number;

    private evac : EvacuationCenter

    private history : EvacuationHistory[]

    /** Instantiate a Honey.
     *
     * @param: size of n
     */
    constructor(size: number, evac: EvacuationCenter, history: EvacuationHistory[] = []) {
        this.MAX_LENGTH = size;
        this.nectar = [] //new int[this.MAX_LENGTH];
        this.conflicts = 0;
        this.trials = 0;
        this.fitness = 0.0;
        this.selectionProbability = 0.0;
        this.evac = evac
        this.history = history
        this.initNectar();   
    }

    /** Compares two Honeys.
     *
     * @param: a Honey to compare with
     */
    public compareTo(h: Honey): number {
        return this.conflicts - h.getConflicts();
    }

    /** Initializes the Honey into diagonal queens.
     *
     */
    public initNectar() {
        let evac_sub_id = this.evac.id || Utilities.genID(5)
        for (let i = 0; i < this.MAX_LENGTH; i++) { //initialize the solution to 1... n
            
            if (i < this.history.length) {
                let val = {...this.history[i]}
                this.nectar.push(val)
            } else {
                let val = new EvacuationHistory(evac_sub_id)
                val.current_population   = HoneyUtilities.randomNumber(0, this.evac.population_capacity)
                this.nectar.push(val)
            }
            
            /* this.nectar[i] = new EvacuationCenter(evac_sub_id + "-" + i)
            this.nectar[i].current_population   = this.history[i].current_population//HoneyUtilities.randomNumber(100, this.evac.population_capacity)
            this.nectar[i].population_capacity  = this.evac.population_capacity //HoneyUtilities.randomNumber(100, 200)
            this.nectar[i].floor_space = this.evac.floor_space; //HoneyUtilities.randomNumber(50, 300)
            //this.nectar[i].current_population = i; */
        }
    }

    /** Computes the conflicts in the nxn board.
     *
     */
    public computeConflicts() { //compute the number of conflicts to calculate fitness

        let carrying_sum = 0
        for (let i = 0; i < this.MAX_LENGTH; i++) {
            carrying_sum += (this.nectar[i].current_population / this.evac.population_capacity)
        }
        ///average carrying capacity
        carrying_sum = carrying_sum / this.MAX_LENGTH

        let density_sum = 0
        for (let i = 0; i < this.MAX_LENGTH; i++) {
            density_sum += (this.nectar[i].current_population / this.evac.floor_space)
        }

        ///average density
        density_sum = density_sum / this.MAX_LENGTH

        this.setConflicts(carrying_sum + density_sum)
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
    public getConflicts(): number {
        return this.conflicts;
    }

    /** Sets the conflicts of the honey.
     *
     * @param: new number of conflicts
     */
    public setConflicts(mConflicts: number) {
        this.conflicts = mConflicts;
    }

    /** Gets the selection probability of the honey.
     *
     * @return: selection probability of the honey
     */
    public getSelectionProbability(): number {
        return this.selectionProbability;
    }

    /** sets the selection probability of the honey.
     *
     * @param: new selection probability of the honey
     */
    public setSelectionProbability(mSelectionProbability: number) {
        this.selectionProbability = mSelectionProbability;
    }

    /** Gets the fitness of a honey.
     *
     * @return: fitness of honey
     */
    public getFitness(): number {
        return this.fitness;
    }

    /** Sets the fitness of the honey.
     *
     * @param: new fitness
     */
    public setFitness(mFitness: number) {
        this.fitness = mFitness;
    }

    /** Gets the data on a specified index.
     *
     * @param: index of data
     * @return: position of queen
     */
    public getNectar(index: number, type: EvacuationPropType): number {
        //return this.nectar[index][type] as number;
        /* if (type == EvacuationPropType.population_capacity){
            return this.nectar[index].population_capacity
        } else {
            return this.nectar[index].
        } */
        switch (type) {
            case EvacuationPropType.current_population:
                return this.nectar[index].current_population
                /* case EvacuationPropType.evacuation_size:
                    return this.nectar[index].evacuation_size */
            default:
                return 0
        }
    }

    /** Gets the index on a specified data.
     *
     * @param: index of data
     * @return: position of queen
     */
    public getIndex(value: number, type: EvacuationPropType): number | null {
        let k = 0;
        for (; k < this.MAX_LENGTH; k++) {
            /* if (this.getNectar(k, type) == value) {
                return k
            } */
            if (this.nectar[k].current_population == value) {
                return k
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

        return null
    }

    /** Sets the data on a specified index.
     *
     * @param: index of data
     * @param: new position of queen
     */
    public setNectar(index: number, value: number, type: EvacuationPropType) {
        //this.nectar[index] = value;
        console.log("honeybee nectar %o", this.nectar)
        console.log("set value index: %o, value: %o, type: %o", index, value, type)

        if (index == null) {
            console.log("fatalError()")
            console.trace()
        }

        switch (type) {
            case EvacuationPropType.current_population:
                return this.nectar[index].current_population = value
                /* case EvacuationPropType.current_inventory:
                    return this.nectar[index].current_inventory = value */
            case EvacuationPropType.floor_space:
                return this.evac.floor_space
            default:
                return 0
        }
    }

    /** Gets the number of trials of a solution.
     *
     * @return: number of trials
     */
    public getTrials(): number {
        return this.trials;
    }

    /** Sets the number of trials of a solution.
     *
     * @param: new number of trials
     */
    public setTrials(trials: number) {
        this.trials = trials;
    }

    /** Gets the max length.
     *
     * @return: max length
     */
    public getMaxLength(): number {
        return this.MAX_LENGTH;
    }
}
//end honey

///type to define a callback function with a number to return
type CallBackNumber < T > = (val: T) => number

/* class Board {
    value: string[][] = []

    set(section: number, row: number, value: string) {
        if (!this.value[section]) {
            this.value[section] = []
        }
        this.value[section][row] = value
    }

    get(section: number, row: number): string {
        return this.value[section][row]
    }

    push(value: string[]) {
        this.value.push(value)
    }
} */

interface Search < T > {
    value: T | null,
    index: number | undefined
}

interface Array < T > {
    max(where: CallBackNumber < T > ): T
    min(where: CallBackNumber < T > ): T
}



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

    static getMaxValue(arr: Honey[], where: CallBackNumber < Honey > ): Search < Honey > {
        let maxHoney: Search < Honey > = {
            value: null,
            index: undefined
        }
        let max = -100000
        arr.forEach((value, index) => {
            let curr_value = where(value)
            if (curr_value > max) {
                max = curr_value
                maxHoney = {
                    value: value,
                    index: index
                }
            }
            console.log("max compare curr_value: %o, max: %o", curr_value, max)
        })
        return maxHoney
    }

    static getMinValue(arr: Honey[], where: CallBackNumber < Honey > ): Search < Honey > {
        let minHoney: Search < Honey > = {
            value: null,
            index: undefined
        }
        let min = Infinity
        arr.forEach((value, index) => {
            let curr_value = where(value)
            if (curr_value < min) {
                min = curr_value
                minHoney = {
                    value: value,
                    index: index
                }
            }
        })
        return minHoney
    }


    static randomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    }

    static randomNumberMax(max: number): number {
        return this.randomNumber(0, max)
    }
}
