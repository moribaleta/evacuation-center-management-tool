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
	public MAX_LENGTH: number 		/*The number of parameters of the problem to be optimized*/
    public NP: number 				/*The number of total bees/colony size. employed + onlookers*/
    public FOOD_NUMBER: number 	/*The number of food sources equals the half of the colony size*/
    public LIMIT: number  			/*A food source which could not be improved through "limit" trials is abandoned by its employed bee*/
    public MAX_EPOCH: number 		/*The number of cycles for foraging {a stopping criteria}*/
    public MIN_SHUFFLE: number
    public MAX_SHUFFLE: number

    //public rand: Random
    public foodSources: Honey[]
    public solutions: Honey[]
    public gBest: Honey
    public epoch: number

    /* Instantiates the artificial bee colony algorithm along with its parameters.
	 *
	 * @param: size of n queens
	 */
    public constructor(n: number) {
        this.MAX_LENGTH = n;
        this.NP = 40;					//pop size 20 to 40 or even 100
        this.FOOD_NUMBER = this.NP/2;
        this.LIMIT = 50;
        this.MAX_EPOCH = 1000;
        this.MIN_SHUFFLE = 8;
        this.MAX_SHUFFLE = 20;
        this.gBest = null;
        this.epoch = 0;
    }

    /* Starts the particle swarm optimization algorithm solving for n queens.
	 *
	 */
    public algorithm() : boolean {
    	this.foodSources = [];
    	this.solutions = [];
        //rand = new Random();
        let done = false;
        var epoch = 0;

        this.initialize();
        this.memorizeBestFoodSource();

        while(!done) {
            console.log("iteration current %o, max: %o", epoch, this.MAX_EPOCH)
            if(epoch < this.MAX_EPOCH) {
                console.log("im the best %o", this.gBest)
                if( this.gBest != null && this.gBest.getConflicts() == 0) {
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
        
		if(epoch == this.MAX_EPOCH) {
			console.log("No Solution found");
			done = false;
		}
		
        console.log("done.");
        console.log("Completed " + epoch + " epochs.");
        
        /* for(Honey h: foodSources) {
            if(h.getConflicts() == 0) {
                console.log("SOLUTION");
                solutions.add(h);
                printSolution(h);
                console.log("conflicts:"+h.getConflicts());
            }
        } */

        this.foodSources.forEach((h) => {
            if(h.getConflicts() == 0) {
                console.log("SOLUTION");
                this.solutions.push(h)//.add(h);
                this.printSolution(h);
                console.log("conflicts:"+h.getConflicts());
            }
        })
        
        return done;
    }

    /* Sends the employed bees to optimize the solution
	 *
	 */
    public sendEmployedBees() {
        let neighborBeeIndex = 0;
        let currentBee : Honey = null;
        let neighborBee : Honey = null;
        
        for(var i = 0; i < this.FOOD_NUMBER; i++) {
            //A randomly chosen solution is used in producing a mutant solution of the solution i
            //neighborBee = getRandomNumber(0, Food_Number-1);
            neighborBeeIndex = this.getExclusiveRandomNumber(this.FOOD_NUMBER-1, i);
            currentBee = this.foodSources[i]//.get(i);
            neighborBee = this.foodSources[neighborBeeIndex]//.get(neighborBeeIndex);
            this.sendToWork(currentBee, neighborBee);
        }
    }

    /* Sends the onlooker bees to optimize the solution. Onlooker bees work on the best solutions from the employed bees. best solutions have high selection probability. 
	 *
	 */
    public sendOnlookerBees() {
    	var i = 0;
        var t = 0;
        var neighborBeeIndex = 0;
        var currentBee : Honey = null;
        var neighborBee : Honey = null;

        while(t < this.FOOD_NUMBER) {
            currentBee = this.foodSources[i];
            console.log("searching onlooker bee %o", currentBee)
            //** reference --> if(rand.nextDouble() < currentBee.getSelectionProbability()) {
            if(Math.random() < currentBee.getSelectionProbability()) {
                t++;
                neighborBeeIndex = this.getExclusiveRandomNumber(this.FOOD_NUMBER-1, i);
	            neighborBee = this.foodSources[neighborBeeIndex];
	            this.sendToWork(currentBee, neighborBee);
            }
            i++;
            if(i == this.FOOD_NUMBER) {
                i = 0;
            }
        }
    }

	/** The optimization part of the algorithm. improves the currentbee by choosing a random neighbor bee. the changes is a randomly generated number of times to try and improve the current solution.
	 *
	 * @param: the currently selected bee
	 * @param: a randomly selected neighbor bee
	 * @param: the number of times to try and improve the solution
	 */
    public sendToWork(currentBee: Honey, neighborBee: Honey) {
    	var newValue = 0;
        var tempValue = 0;
        var tempIndex = 0;
        var prevConflicts = 0;
        var currConflicts = 0;
        var parameterToChange = 0;

        //get number of conflicts
        prevConflicts = currentBee.getConflicts();

        //The parameter to be changed is determined randomly
        parameterToChange = this.getRandomNumber(0, this.MAX_LENGTH-1);

        /*v_{ij}=x_{ij}+\phi_{ij}*(x_{kj}-x_{ij}) 
        solution[param2change]=Foods[i][param2change]+(Foods[i][param2change]-Foods[neighbour][param2change])*(r-0.5)*2;
        */
        tempValue = currentBee.getNectar(parameterToChange);
        newValue = (tempValue+(tempValue - neighborBee.getNectar(parameterToChange))*(Math.random()-0.5)*2);

        //trap the value within upper bound and lower bound limits
        if(newValue < 0) {
            newValue = 0;
        }
        if(newValue > this.MAX_LENGTH-1) {
            newValue = this.MAX_LENGTH-1;
        }

        //get the index of the new value
        tempIndex = currentBee.getIndex(newValue);

        //swap
        currentBee.setNectar(parameterToChange, newValue);
        currentBee.setNectar(tempIndex, tempValue);
        currentBee.computeConflicts();
        currConflicts = currentBee.getConflicts();
        
        //greedy selection
        if(prevConflicts < currConflicts) {						//No improvement
            currentBee.setNectar(parameterToChange, tempValue);
            currentBee.setNectar(tempIndex, newValue);
            currentBee.computeConflicts();
            currentBee.setTrials(currentBee.getTrials() + 1);
        } else {												//improved solution
            currentBee.setTrials(0);
        }   
        
    }

    /* Finds food sources which have been abandoned/reached the limit.
     * Scout bees will generate a totally random solution from the existing and it will also reset its trials back to zero.
     *
     */
    public sendScoutBees() {
        var currentBee : Honey = null;
        var shuffles = 0;

        for(var i =0; i < this.FOOD_NUMBER; i++) {
            currentBee = this.foodSources[i];
            if(currentBee.getTrials() >= this.LIMIT) {
                shuffles = this.getRandomNumber(this.MIN_SHUFFLE, this.MAX_SHUFFLE);
                for(var j = 0; j < shuffles; j++) {
                    this.randomlyArrange(i);
                }
                currentBee.computeConflicts();
                currentBee.setTrials(0);

            }
        }
    }

	/* Sets the fitness of each solution based on its conflicts
	 *
	 */
    public getFitness() {
    	// Lowest errors = 100%, Highest errors = 0%
        var thisFood : Honey = null;
        var bestScore = 0.0;
        var worstScore = 0.0;

        // The worst score would be the one with the highest energy, best would be lowest.
        /* worstScore = this.foodSources.max((val) : number =>{
            return (val as Honey).getConflicts()
        }).getConflicts() */
        console.log("curr gen: %o foodsource: %o", this.epoch, this.foodSources)
        const worst = getMaxValue(this.foodSources, ((val) => {return val.getConflicts()})) 
        console.log("worst fitness: %o",worst)
        worstScore = worst.value.getConflicts()
        
        let minScore = getMinValue(this.foodSources, ((val) => {return val.getConflicts()})).value.getConflicts()
        /* let minScore = this.foodSources.min((val) : number =>{
            return (val as Honey).getConflicts()
        }).getConflicts() */
        // Convert to a weighted percentage.
        //bestScore = worstScore - Collections.min(foodSources).getConflicts();
        bestScore = worstScore - minScore

        for(var i = 0; i < this.FOOD_NUMBER; i++) {
            thisFood = this.foodSources[i];
            thisFood.setFitness((worstScore - thisFood.getConflicts()) * 100.0 / bestScore);
        }   
    }

    /* Sets the selection probability of each solution. the higher the fitness the greater the probability 
	 *
	 */ 
	public calculateProbabilities() {
    	/* var thisFood : Honey = null;
        var maxfit = this.foodSources[0].getFitness();
        
        for(var i = 1; i < this.FOOD_NUMBER; i++) {
            thisFood = this.foodSources[i];
            if(thisFood.getFitness() > maxfit) {
                maxfit = thisFood.getFitness();
            }
        }
         
        for(var j = 0; j < this.FOOD_NUMBER; j++) {
            thisFood = this.foodSources[j];
            thisFood.setSelectionProbability((0.9*(thisFood.getFitness()/maxfit))+0.1);
        } */
        //var maxFit = this.foodSources.map((val)=>{return val.getFitness()}).reduce((prev, curr)=>{return prev+curr})
        console.log("curr gen: %o foodsource: %o", this.epoch, this.foodSources)
        let currFitness = this.foodSources[this.epoch].getFitness()
        /* let maxFoodSource      = this.foodSources.max((val) : number => {
            return (val as Honey).getFitness()
        }) */
        let maxFoodSource = getMaxValue(this.foodSources,((val)=>{
            return val.getFitness()
        })).value

        console.log("max foodsource: %o", maxFoodSource)
        let maxFit = maxFoodSource.getFitness()
        
        console.log("currFitness: %o maxfit: %o", currFitness, maxFit)

        //let fitness_value = this.foodSources[this.epoch].getFitness() / (this.foodSources.max((val) => {return (val as Honey).getFitness()}).getFitness())//max(this.arr_fitness).max)
        let fitness_value = currFitness / maxFit
        let probability = 0.9 * fitness_value + 0.1
        this.foodSources[this.epoch].setSelectionProbability(probability)
    }

    /* Initializes all of the solutions' placement of queens in ramdom positions.
	 *
	 */ 
    public initialize() {
    	var newFoodIndex = 0;
        var shuffles = 0;
        
        for(var i = 0; i < this.FOOD_NUMBER; i++) {
            var newHoney = new Honey(this.MAX_LENGTH);
       
            this.foodSources.push(newHoney);
            // reference get latest index --> this.foodSources.indexOf(newHoney);
            newFoodIndex = this.foodSources.length - 1 
            
            shuffles = this.getRandomNumber(this.MIN_SHUFFLE, this.MAX_SHUFFLE);
            
            for(var j = 0; j < shuffles; j++) {
                this.randomlyArrange(newFoodIndex);
            }
            
            this.foodSources[newFoodIndex].computeConflicts();
        } // i
    }

    /* Gets a random number in the range of the parameters
	 *
	 * @param: the minimum random number
	 * @param: the maximum random number
	 * @return: random number
	 */ 
    public getRandomNumber(low: number, high: number) : number {
        //return (int)Math.round((high - low) * rand.nextDouble() + low);
        return Math.round((high - low) * Math.random() + low)
    }

    /* Gets a random number with the exception of the parameter
	 *
	 * @param: the maximum random number
	 * @param: number to to be chosen
	 * @return: random number
	 */ 
    public getExclusiveRandomNumber(high: number, except: number) : number {
        var done = false;
        var getRand = 0;

        while(!done) {
            getRand =  randomNumberMax(high)//Math.random(high) //rand.nextInt(high);
            if(getRand != except){
                done = true;
            }
        }

        return getRand;     
    }

    /* Changes a position of the queens in a particle by swapping a randomly selected position
	 *
	 * @param: index of the solution
	 */ 
    public randomlyArrange(index: number) {
        let positionA = this.getRandomNumber(0, this.MAX_LENGTH - 1);
        let positionB = this.getExclusiveRandomNumber(this.MAX_LENGTH - 1, positionA);
        let thisHoney = this.foodSources[index];
        let temp = thisHoney.getNectar(positionA);
        thisHoney.setNectar(positionA, thisHoney.getNectar(positionB));
        thisHoney.setNectar(positionB, temp);          
    }

    /* Memorizes the best solution
	 *
	 */ 
    public memorizeBestFoodSource() {
    	/* this.gBest = this.foodSources.min((val): number =>{
            return (val as Honey).getConflicts()
        }) //Collections.min(foodSources); */
        this.gBest = getMinValue(this.foodSources, ((val) : number => {
            return val.getConflicts()
        })).value
    }

    /* Prints the nxn board with the queens
	 *
	 * @param: a chromosome
	 */ 
    public printSolution(solution: Honey) {
        var board : Board = new Board();
        
        // Clear the board.
        for(var x = 0; x < this.MAX_LENGTH; x++) {
            for(var y = 0; y < this.MAX_LENGTH; y++) {
                //board[x][y] = "";
                board.set(x, y, "")
            }
        }

        for(var x = 0; x < this.MAX_LENGTH; x++) {
            //board[x][solution.getNectar(x)] = "Q";
            board.set(x,solution.getNectar(x), "Q")
        }

        // Display the board.
        console.log("Board:");
        for(var y = 0; y < this.MAX_LENGTH; y++) {
            var string = ""
            for(var x = 0; x < this.MAX_LENGTH; x++) {
                if(board.get(x,y) == "Q") {
                    //System.out.print("Q ");
                    //console.log("i")
                    string += "Q "
                } else {
                    //System.out.print(". ");
                    string += ". "
                }
                console.log(string)
            }
            //System.out.print("\n");
            console.log(string)
        }
    }    

    /* gets the solutions
 	 *
 	 * @return: solutions
 	 */  
 	public getSolutions() : Honey[] {
 		return this.solutions;
 	}

 	 /* gets the epoch
 	 *
 	 * @return: epoch
 	 */ 
 	public getEpoch() : number {
 		return this.epoch;
 	}

     /* sets the max epoch
     *
     * @return: new max epoch value
     */ 
 	public setMaxEpoch(newMaxEpoch: number) {
 		this.MAX_EPOCH = newMaxEpoch;
 	}

 	/* gets the population size
 	 *
 	 * @return: pop size
 	 */ 
 	public getPopSize() : number{
 		return this.foodSources.length;
 	}

 	/* gets the start size
 	 *
 	 * @return: start size
 	 */ 
 	public getStartSize() : number {
 		return this.NP;
 	}

 	/* gets the number of food
 	 *
 	 * @return: food number
 	 */ 
 	public getFoodNum() : number {
 		return this.FOOD_NUMBER;
 	}

 	/* gets the limit for trials for all food sources
 	 *
 	 * @return: number of trials limit
 	 */ 
 	public getLimit() : number {
 		return this.LIMIT;
 	}

    /* sets the limit for trials for all food sources
     *
     * @param: new trial limit
     */    
 	public setLimit(newLimit: number) {
 		this.LIMIT = newLimit;
 	}

 	/* gets the max epoch
 	 *
 	 * @return: max epoch
 	 */ 
 	public getMaxEpoch() : number {
 		return this.MAX_EPOCH;
 	}

 	/* gets the min shuffle
 	 *
 	 * @return: min shuffle
 	 */ 
 	public getShuffleMin() : number {
 		return this.MIN_SHUFFLE;
 	}
    
 	/* gets the max shuffle
 	 *
 	 * @return: max shuffle
 	 */ 
 	public getShuffleMax() : number {
 		return this.MAX_SHUFFLE;
 	}  
}