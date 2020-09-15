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


class ArtificialBeeColony {

    /*ABC PARAMETERS*/
    public MAX_VAL: number
    /**The number of parameters of the problem to be optimized (Honey bee nectars)*/
    public MAX_LENGTH: number

    /**The number of total bees/colony size. employed + onlookers*/
    public NP: number

    /**The number of food sources equals the half of the colony size*/
    public FOOD_NUMBER: number

    /**A food source which could not be improved through "limit" trials is abandoned by its employed bee (Trial Limit)*/
    public LIMIT: number

    /**The number of cycles for foraging {a stopping criteria}*/
    public MAX_EPOCH: number

    public MIN_SHUFFLE: number
    public MAX_SHUFFLE: number

    /** food sources contains the value of Evacuation Center */
    public foodSources: Honey[] = []
    public solutions: Honey[] = []

    /** the best from the food sources by its conflict value */
    public gBest ? : Honey

    /** current generation */
    public epoch: number

    public evacuation_centers: EvacuationCenter[] = []
    public evacuation_history: EvacuationHistory[] = []

    /* Instantiates the artificial bee colony algorithm along with its parameters.
     *
     * @param: size of n queens
     */
    public constructor(max_length: number = 10,
        max_val: number = 200,
        population_size: number = 20,
        trial_limit: number = 50,
        max_epoch: number = 1000,
        min_shuffle: number = 8,
        max_shuffle: number = 20,
        evacuation_centers: EvacuationCenter[] = [],
        evacuation_history: EvacuationHistory[] = []
    ) {

        let capacity = evacuation_centers.map((evac) => {
            return evac.population_capacity
        })
        this.MAX_VAL = Math.max(...capacity) /* evacuation_centers.max((evac) => {
            return evac.population_capacity
        }).population_capacity */

        this.MAX_LENGTH = max_length;
        let size = population_size > evacuation_centers.length ? evacuation_centers.length : population_size
        this.NP         =  size//population_size; //pop size 20 to 40 or even 100
        //this.FOOD_NUMBER    = this.NP / 2;
        this.FOOD_NUMBER = size
        this.LIMIT = trial_limit;
        this.MAX_EPOCH = max_epoch;
        this.MIN_SHUFFLE = min_shuffle;
        this.MAX_SHUFFLE = max_shuffle;
        this.evacuation_centers = evacuation_centers
        this.evacuation_history = evacuation_history
        this.gBest = undefined;
        this.epoch = 0;

    } //constructor


    /** Starts the MOABC
     *
     */
    public algorithm(): boolean {

        this.foodSources = [];
        this.solutions = [];
        //rand = new Random();
        let done = false;
        let epoch = 0;

        this.initialize();
        this.memorizeBestFoodSource();

        while (!done) {
            console.log("iteration current %o, max: %o", epoch, this.MAX_EPOCH)
            if (epoch < this.MAX_EPOCH) {
                console.log("im the best %o", this.gBest)

                if (this.gBest != null && this.gBest.getConflicts() < 0.5) {
                    done = true;
                }

                console.log("employed bees")
                this.sendEmployedBees();
                console.log("update fitness bees")
                this.getFitness();
                console.log("probability")
                this.calculateProbabilities();
                console.log("onlooker bee")
                this.sendOnlookerBees();
                console.log("update food source")
                this.memorizeBestFoodSource();
                console.log("scout bee")
                this.sendScoutBees();

                epoch++;
                // This is here simply to show the runtime status.
                console.log("Epoch: " + epoch);
            } else {
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
                this.solutions.push(h) //.add(h);
                this.printSolution(h);
                console.log("conflicts:" + h.getConflicts());
            }
        })

        console.log("the best of all %o", this.gBest)

        return done;
    }

    /** Initializes all of the solutions' placement of queens in ramdom positions.
     *
     */
    public initialize() {
        let newFoodIndex = 0;
        let shuffles = 0;

        for (let i = 0; i < this.FOOD_NUMBER; i++) {
            let newHoney = new Honey(this.MAX_LENGTH, this.evacuation_centers[i]);

            this.foodSources.push(newHoney);
            // reference get latest index --> this.foodSources.indexOf(newHoney);
            newFoodIndex = this.foodSources.length - 1

            /* shuffles = this.getRandomNumber(this.MIN_SHUFFLE, this.MAX_SHUFFLE);
            for (let j = 0; j < shuffles; j++) {
                this.randomlyArrange(newFoodIndex);
            } */

            this.foodSources[newFoodIndex].computeConflicts();
        } // i
    } //initialize

    /** Sends the employed bees to optimize the solution
     *
     */
    public sendEmployedBees() {
        let neighborBeeIndex = 0;
        let currentBee: Honey
        let neighborBee: Honey

        for (let i = 0; i < this.FOOD_NUMBER; i++) {
            neighborBeeIndex = this.getExclusiveRandomNumber(this.FOOD_NUMBER - 1, i);
            currentBee = this.foodSources[i]
            neighborBee = this.foodSources[neighborBeeIndex]
            this.sendToWork(currentBee, neighborBee);
        }
    } //sendEmployedBees


    /** 
     * Sends the onlooker bees to optimize the solution. 
     * Onlooker bees work on the best solutions from the employed bees. best solutions have high selection probability. 
     */
    public sendOnlookerBees() {
        let i = 0;
        let t = 0;
        let neighborBeeIndex = 0;
        let currentBee: Honey;
        let neighborBee: Honey;

        while (t < this.FOOD_NUMBER) {
            currentBee = this.foodSources[i];
            console.log("searching onlooker bee %o", currentBee)
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
    public sendToWork(currentBee: Honey, neighborBee: Honey) {
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
        const phi = -1 + (1 - (1)) * Math.random()
        tempValue = currentBee.getNectar(parameterToChange, EvacuationPropType.current_population);
        newValue = (tempValue + (tempValue - neighborBee.getNectar(parameterToChange, EvacuationPropType.current_population)) * phi);


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
        currentBee.setNectar(parameterToChange, newValue, EvacuationPropType.current_population);
        //currentBee.setNectar(tempIndex, tempValue, EvacuationPropType.current_population);
        currentBee.computeConflicts();
        currConflicts = currentBee.getConflicts();

        //greedy selection
        if (prevConflicts < currConflicts) { //No improvement
            currentBee.setNectar(parameterToChange, tempValue, EvacuationPropType.current_population);
            currentBee.setNectar(tempIndex, newValue, EvacuationPropType.current_population);
            currentBee.computeConflicts();
            currentBee.setTrials(currentBee.getTrials() + 1);
        } else { //improved solution
            currentBee.setTrials(0);
        }

    } //sendToWork



    /** Finds food sources which have been abandoned/reached the limit.
     * Scout bees will generate a totally random solution from the existing and it will also reset its trials back to zero.
     *
     */
    public sendScoutBees() {
        let currentBee: Honey;
        let shuffles = 0;

        for (let i = 0; i < this.FOOD_NUMBER; i++) {
            currentBee = this.foodSources[i];
            if (currentBee.getTrials() >= this.LIMIT) {
                /* shuffles = this.getRandomNumber(this.MIN_SHUFFLE, this.MAX_SHUFFLE);
                for (let j = 0; j < shuffles; j++) {
                    this.randomlyArrange(i);
                } */
                currentBee.computeConflicts();
                currentBee.setTrials(0);
            }
        }
    } //sendScoutBees

    /* Sets the fitness of each solution based on its conflicts
     *
     */
    public getFitness() {
        // Lowest errors = 100%, Highest errors = 0%
        let thisFood: Honey;
        let bestScore = 0.0;
        let worstScore = 0.0;

        // The worst score would be the one with the highest energy, best would be lowest.
        console.log("curr gen: %o foodsource: %o", this.epoch, this.foodSources)
        const worst = HoneyUtilities.getMaxValue(this.foodSources, ((val) => {
            return val.getConflicts()
        }))
        console.log("worst fitness: %o", worst)
        worstScore = worst.value?.getConflicts() || Infinity

        let minScore = HoneyUtilities.getMinValue(this.foodSources, ((val) => {
            return val.getConflicts()
        })).value?.getConflicts() || 0

        bestScore = worstScore - minScore

        // Convert to a weighted percentage.
        for (let i = 0; i < this.FOOD_NUMBER; i++) {
            thisFood = this.foodSources[i];
            thisFood.setFitness((worstScore - thisFood.getConflicts()) * 100.0 / bestScore);
        }
    } //getFitness

    /** Sets the selection probability of each solution. the higher the fitness the greater the probability 
     *
     */
    public calculateProbabilities() {
        console.log("curr gen: %o foodsource: %o", this.epoch, this.foodSources)
        let currFitness = this.foodSources[this.epoch].getFitness()
        let maxFoodSource = HoneyUtilities.getMaxValue(this.foodSources, ((val) => {
            return val.getFitness()
        })).value

        console.log("max foodsource: %o", maxFoodSource)
        let maxFit = maxFoodSource?.getFitness() || 0

        console.log("currFitness: %o maxfit: %o", currFitness, maxFit)

        let fitness_value = currFitness / maxFit
        let probability = 0.9 * fitness_value + 0.1
        this.foodSources[this.epoch].setSelectionProbability(probability)
    } //calculateProbabilities




    /** Gets a random number in the range of the parameters
     *
     * @param: the minimum random number
     * @param: the maximum random number
     * @return: random number
     */
    public getRandomNumber(low: number, high: number): number {
        return Math.round((high - low) * Math.random() + low)
    } //getRandomNumber


    /** Gets a random number with the exception of the parameter
     *
     * @param: the maximum random number
     * @param: number to to be chosen
     * @return: random number
     */
    public getExclusiveRandomNumber(high: number, except: number): number {
        let done = false;
        let getRand = 0;

        while (!done) {
            getRand = HoneyUtilities.randomNumberMax(high) //Math.random(high) //rand.nextInt(high);
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
    public randomlyArrange(index: number) {
        let positionA = this.getRandomNumber(0, this.MAX_LENGTH - 1);
        let positionB = this.getExclusiveRandomNumber(this.MAX_LENGTH - 1, positionA);
        let thisHoney = this.foodSources[index];
        let temp = thisHoney.getNectar(positionA, EvacuationPropType.current_population);
        thisHoney.setNectar(positionA, thisHoney.getNectar(positionB, EvacuationPropType.current_population), EvacuationPropType.current_population);
        thisHoney.setNectar(positionB, temp, EvacuationPropType.current_population);
    } //randomlyArrange

    /** Memorizes the best solution
     * sets gBest with the lowest conflict or objective value
     */
    public memorizeBestFoodSource() {
        this.gBest = HoneyUtilities.getMinValue(this.foodSources, ((val): number => {
            return val.getConflicts()
        })).value || undefined
    } //memorizeBestFoodSource

    /** Prints value of the given solution
     *
     * @param: a chromosome
     */
    public printSolution(solution: Honey) {
        console.log("given solution: %o", solution)
    }

    /** gets the solutions
     *
     * @return: solutions
     */
    public getSolutions(): Honey[] {
        return this.solutions;
    }

    /** gets the epoch
     *
     * @return: epoch
     */
    public getEpoch(): number {
        return this.epoch;
    }

    /** sets the max epoch
     *
     * @return: new max epoch value
     */
    public setMaxEpoch(newMaxEpoch: number) {
        this.MAX_EPOCH = newMaxEpoch;
    }

    /** gets the population size
     *
     * @return: pop size
     */
    public getPopSize(): number {
        return this.foodSources.length;
    }

    /** gets the start size
     *
     * @return: start size
     */
    public getStartSize(): number {
        return this.NP;
    }

    /** gets the number of food
     *
     * @return: food number
     */
    public getFoodNum(): number {
        return this.FOOD_NUMBER;
    }

    /** gets the limit for trials for all food sources
     *
     * @return: number of trials limit
     */
    public getLimit(): number {
        return this.LIMIT;
    }

    /** sets the limit for trials for all food sources
     *
     * @param: new trial limit
     */
    public setLimit(newLimit: number) {
        this.LIMIT = newLimit;
    }

    /** gets the max epoch
     *
     * @return: max epoch
     */
    public getMaxEpoch(): number {
        return this.MAX_EPOCH;
    }

    /** gets the min shuffle
     *
     * @return: min shuffle
     */
    public getShuffleMin(): number {
        return this.MIN_SHUFFLE;
    }

    /** gets the max shuffle
     *
     * @return: max shuffle
     */
    public getShuffleMax(): number {
        return this.MAX_SHUFFLE;
    }

} //ArtificialBeeColony