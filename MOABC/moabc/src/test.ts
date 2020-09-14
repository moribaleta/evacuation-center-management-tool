/* TesterABC.java
 *
 * Runs ArtificialBeeColony.java and logs the results into a file using Writer.java.
 * ABC testing setup is according to pass/fail criteria
 * Pass criteria - 50 success
 * Fail criteria - 100 failures
 *
 * @author: James M. Bayon-on
 * @version: 1.3
 */


class TesterABC {

    abc!        : ArtificialBeeColony;
    runtimes    : number[];
    evacuations : EvacuationCenter[]

    /* Instantiates the TesterABC class
     *
     */
    public constructor() {
        this.runtimes = [];
        console.log("created")
    }

    /* Test method accepts the N/max length, and parameters mutation rate and max epoch to set for the ABC accordingly.
     *
     * @param: max length/n
     * @param: trial limit for ABC
     * @param: max epoch for ABC
     */
    public generate(params: MOABCParameters) : MOABCOutput {

        this.abc = new ArtificialBeeColony( 
            params.max_length     ,
            params.max_val        ,
            params.population_size,
            params.trial_limit    ,
            params.max_epoch      ,
            params.min_shuffle    ,
            params.max_shuffle    ,
            this.evacuations
        ); //instantiate and define abc here

        /* this.abc.setLimit(trialLimit);
        this.abc.setMaxEpoch(maxEpoch); */
        
        let startTime: number;
        let endTime: number;
        let totalTime = 0;

        startTime   = (new Date()).getTime()
        this.abc.algorithm()
        endTime     = (new Date()).getTime()

        totalTime = endTime - startTime;

        return {
            params,
            output: {
                best:           this.abc.gBest,
                foodsources:    this.abc.foodSources,
                solutions:      this.abc.getSolutions()
            },
            elapsed_time: totalTime
        }
    }
}

let main = new TesterABC()


interface MOABCOutput {
    params: MOABCParameters,
    output: {
        best: Honey,
        foodsources: Honey[],
        solutions: Honey[]
    },
    elapsed_time: number
}

interface MOABCParameters {
    id          : string,
    date_created: string,
    created_by  : string,
    
    max_length      : number
    max_val         : number
    population_size : number
    trial_limit     : number
    max_epoch       : number
    min_shuffle     : number
    max_shuffle     : number
}

