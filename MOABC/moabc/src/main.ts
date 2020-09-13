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
    logWriter: Writer;
    abc: ArtificialBeeColony;
    MAX_RUN: number;
    MAX_LENGTH: number;
    runtimes: number[];

    /* Instantiates the TesterABC class
     *
     */
    public constructor() {
        this.logWriter = new Writer();
        this.MAX_RUN = 1;
        this.runtimes = [];
        console.log("created")
    }

    /* Test method accepts the N/max length, and parameters mutation rate and max epoch to set for the ABC accordingly.
     *
     * @param: max length/n
     * @param: trial limit for ABC
     * @param: max epoch for ABC
     */
    public test(maxLength: number, trialLimit: number, maxEpoch: number) {
        this.MAX_LENGTH = maxLength;
        log("starting")
        this.abc = new ArtificialBeeColony(this.MAX_LENGTH); //instantiate and define abc here
        this.abc.setLimit(trialLimit);
        this.abc.setMaxEpoch(maxEpoch);
        let testStart = window.performance.now();
        let filepath = "ABC-N" + this.MAX_LENGTH + "-" + trialLimit + "-" + maxEpoch + ".txt";
        var startTime: number;
        var endTime: number;
        var totalTime = 0;
        var fail = 0;
        //var success = 0;

        this.logParameters();

        startTime = window.performance.now();
        var success = this.abc.algorithm()
        endTime = window.performance.now();

        //endTime = window.performance.now();
        totalTime = endTime - startTime;
        console.log("success?: %o", success)
        console.log("Done");
        console.log("time in nanoseconds: " + totalTime);
        console.log("Success!");

        this.logWriter.addString("Runtime in nanoseconds: " + totalTime);
        this.logWriter.addString("Found at epoch: " + this.abc.getEpoch());
        this.logWriter.addString("Population size: " + this.abc.getPopSize());
        this.logWriter.addString("");


        this.abc.getSolutions().forEach(h => {
            //this.logWriter.addObject(h);
            this.logWriter.addString(h + "")
            this.logWriter.addString("");
        });


        /* for(var i = 0; i < this.MAX_RUN; ) {                                             //run 50 sucess to pass passing criteria
            startTime = window.performance.now();
            if(this.abc.algorithm()) {
                endTime = window.performance.now();
                totalTime = endTime - startTime;
                
                console.log("Done");
                console.log("run "+(i+1));
                console.log("time in nanoseconds: "+totalTime);
                console.log("Success!");
                
                this.runtimes[i] = totalTime;
                i++;
                success++;
                
                //write to log
                this.logWriter.addString("Run: "+i);
                this.logWriter.addString("Runtime in nanoseconds: "+totalTime);
                this.logWriter.addString("Found at epoch: "+this.abc.getEpoch());
                this.logWriter.addString("Population size: "+this.abc.getPopSize());
                this.logWriter.addString("");
                
                
                this.abc.getSolutions().forEach(h => {
                    //this.logWriter.addObject(h);
                    this.logWriter.addString(h+"")
                    this.logWriter.addString("");
                });

            } else {                                                                //count failures for failing criteria
                fail++;
                console.log("Fail!");
            }
            
            if(fail >= 100) {
                console.log("Cannot find solution with these params");
                break;
            }
            startTime = 0;                                                          //reset time
            endTime = 0;
            totalTime = 0;
        } */

        console.log("Number of Success: " + success);
        console.log("Number of failures: " + fail);
        this.logWriter.addString("Runtime summary");
        this.logWriter.addString("");

        for (var x = 0; x < this.runtimes.length; x++) { //print runtime summary
            this.logWriter.addString(this.runtimes[x].toString());
        }

        let testEnd = window.performance.now();
        this.logWriter.addString((testStart).toString());
        this.logWriter.addString((testEnd).toString());
        this.logWriter.addString((testEnd - testStart).toString());


        this.logWriter.writeFile(filepath);
        this.printRuntimes();
    }

    /* Converts the parameters of ABC to string and adds it to the string list in the writer class
     *
     */
    public logParameters() {
        this.logWriter.addString("Artificial Bee Colony Algorithm");
        this.logWriter.addString("Parameters");
        this.logWriter.addString(("MAX_LENGTH/N: " + this.MAX_LENGTH));
        this.logWriter.addString(("STARTING_POPULATION: " + this.abc.getStartSize()));
        this.logWriter.addString(("MAX_EPOCHS: " + this.abc.getMaxEpoch()));
        this.logWriter.addString(("FOOD_NUMBER: " + this.abc.getFoodNum()));
        this.logWriter.addString(("TRIAL_LIMIT: " + this.abc.getLimit()));
        this.logWriter.addString(("MINIMUM_SHUFFLES: " + this.abc.getShuffleMin()));
        this.logWriter.addString(("MAXIMUM_SHUFFLES: " + this.abc.getShuffleMax()));
        this.logWriter.addString("");
    }

    /* Prints the runtime summary in the console
     *
     */
    public printRuntimes() {
        /* for(long x: runtimes){
            console.log("run with time "+x+" nanoseconds");
        }    */
        this.runtimes.forEach((val) => {
            console.log("run with time " + val + " nanoseconds");
        })
    }

    /* public static void main(String args[]) {
        TesterABC tester = new TesterABC();

        tester.test(4, 50, 1000);
    } */

    start() {
        console.log("im starting")
        this.test(10, 50, 10)
    }
}

const main = new TesterABC()

console.log("build new file")

const log = ((value: string) => {
    console.log(value)
})

log("new value is this")
log("gile get new")
log("sample file")
log("sample 2 and a half new")