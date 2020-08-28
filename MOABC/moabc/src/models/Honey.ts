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
    private MAX_LENGTH: number;
    private nectar: number[]; //solution or placement of queen: numbers
    private trials: number;
    private conflicts: number;
    private fitness: number;
    private selectionProbability: number;

    /** Instantiate a Honey.
     *
     * @param: size of n
     */
    /**  public Honey(size: number) {
         this.MAX_LENGTH = size;
         this.nectar = [] //new int[this.MAX_LENGTH];
         this.conflicts = 0;
         this.trials = 0;
         this.fitness = 0.0;
         this.selectionProbability = 0.0;
         this.initNectar();
     } */

    constructor(size: number) {
        this.MAX_LENGTH = size;
        this.nectar = [] //new int[this.MAX_LENGTH];
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
    public compareTo(h: Honey): number {
        return this.conflicts - h.getConflicts();
    }

    /** Initializes the Honey into diagonal queens.
     *
     */
    public initNectar() {
        for (var i = 0; i < this.MAX_LENGTH; i++) { //initialize the solution to 1... n
            this.nectar[i] = i;
        }
    }

    /** Computes the conflicts in the nxn board.
     *
     */
    public computeConflicts() { //compute the number of conflicts to calculate fitness
        //String board[][] = new String[MAX_LENGTH][MAX_LENGTH]; 
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
        for (var i = 0; i < this.MAX_LENGTH; i++) {
            x = i;
            y = this.nectar[i]; //will result to no horizontal and vertical conflicts because it will result to diagonal 

            // Check diagonals.
            for (var j = 0; j < 4; j++) { //because of dx and dy where there are 4 directions for diagonal searching for conflicts
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

        this.conflicts = conflicts; //set conflicts of this chromosome

    }

    /** Plots the queens in the board.
     *
     * @param: a nxn board
     */
    public plotQueens(board: Board): Board {
        for (var i = 0; i < this.MAX_LENGTH; i++) {
            //board[i][this.nectar[i]] = "Q";
            board.set(i, this.nectar[i], "Q")
        }
        return board;
    }

    /** Clears the board.
     *
     * @param: a nxn board
     */
    public clearBoard(board: Board): Board {
        // Clear the board.
        for (var i = 0; i < this.MAX_LENGTH; i++) {
            for (var j = 0; j < this.MAX_LENGTH; j++) {
                //board[i][j] = "";
                board.set(i, j, "")
            }
        }
        return board;
    }

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
    public getNectar(index: number): number {
        return this.nectar[index];
    }

    /** Gets the index on a specified data.
     *
     * @param: index of data
     * @return: position of queen
     */
    public getIndex(value: number): number {
        var k = 0;
        for (; k < this.MAX_LENGTH; k++) {
            if (this.nectar[k] == value) {
                break;
            }
        }
        return k;
    }

    /** Sets the data on a specified index.
     *
     * @param: index of data
     * @param: new position of queen
     */
    public setNectar(index: number, value: number) {
        this.nectar[index] = value;
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

class Board {
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
}

interface Search < T > {
    value: T,
    index: number
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



function getMaxValue(arr: Honey[], where: CallBackNumber < Honey > ): Search < Honey > {
    var maxHoney: Search < Honey > = {
        value: null,
        index: undefined
    }
    var max = -100000
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

function getMinValue(arr: Honey[], where: CallBackNumber < Honey > ): Search < Honey > {
    var minHoney: Search < Honey > = {
        value: null,
        index: undefined
    }
    var min = Infinity
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


function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomNumberMax(max: number): number {
    return randomNumber(0, max)
}