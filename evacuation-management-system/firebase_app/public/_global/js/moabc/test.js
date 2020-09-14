"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TesterABC = exports.Writer = void 0;
const moabc_1 = require("./moabc");
class Writer {
    /* Instantiates the writer class.
     *
     */
    constructor() {
        this.list = [];
        this.list = [];
        console.log("constructed writer %o", this.list);
    }
    /* Accepts a string to add to the string list in the writer class.
     *
     * @param: a line string to write into the log
     */
    addString(line) {
        this.list.push(line);
    }
    printLog() {
        return this.list;
    }
}
exports.Writer = Writer;
class TesterABC {
    /* Instantiates the TesterABC class
     *
     */
    constructor() {
        this.runtimes = [];
        console.log("created");
    }
    /* Test method accepts the N/max length, and parameters mutation rate and max epoch to set for the ABC accordingly.
     *
     * @param: max length/n
     * @param: trial limit for ABC
     * @param: max epoch for ABC
     */
    generate(params) {
        this.abc = new moabc_1.default(params.max_length, params.max_val, params.population_size, params.trial_limit, params.max_epoch, params.min_shuffle, params.max_shuffle); //instantiate and define abc here
        /* this.abc.setLimit(trialLimit);
        this.abc.setMaxEpoch(maxEpoch); */
        let startTime;
        let endTime;
        let totalTime = 0;
        startTime = (new Date()).getTime();
        this.abc.algorithm();
        endTime = (new Date()).getTime();
        totalTime = endTime - startTime;
        return {
            parameters: params,
            output: {
                best: this.abc.gBest,
                foodsources: this.abc.foodSources,
                solutions: this.abc.getSolutions()
            },
            elapsed_time: totalTime
        };
    }
}
exports.TesterABC = TesterABC;
const main = new TesterABC();
exports.default = main;
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
//# sourceMappingURL=test.js.map