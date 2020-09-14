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





class Writer {
    private list: string[] = [];

    /* Instantiates the writer class.
     *
     */
    public constructor() {
        this.list = [];
        console.log("constructed writer %o", this.list)
    }

    /* Accepts a string to add to the string list in the writer class.
     *
     * @param: a line string to write into the log
     */
    public addString(line: string) {
        this.list.push(line);
    }

    public printLog() : string[] {
        return this.list
    }
}

class TesterABC {

    //logWriter: Writer;
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
            parameters: params,
            output: {
                best:           this.abc.gBest,
                foodsources:    this.abc.foodSources,
                solutions:      this.abc.getSolutions()
            },
            elapsed_time: totalTime
        }
    }

    /* start() : MOABCOutput {
        console.log("im starting")
        return this.test(10, 50, 10)
    } */
}

let main = new TesterABC()


interface MOABCOutput {

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

//console.log("build new file")

/* const log = ((value: string) => {
    console.log(value)
})

log("new value is this")
log("gile get new")
log("sample file")
log("sample 2 and a half new")
 */

/* Writer.java
 *
 * Class that contains a string list to be written in a log file.
 *
 * @author: James M. Bayon-on
 * @version: 1.3
 */

