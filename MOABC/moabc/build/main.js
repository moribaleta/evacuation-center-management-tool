var TesterABC = (function () {
    function TesterABC() {
        this.logWriter = new Writer();
        this.MAX_RUN = 50;
        this.runtimes = [];
        console.log("created");
    }
    TesterABC.prototype.test = function (maxLength, trialLimit, maxEpoch) {
        var _this = this;
        this.MAX_LENGTH = maxLength;
        this.abc = new ArtificialBeeColony(this.MAX_LENGTH);
        this.abc.setLimit(trialLimit);
        this.abc.setMaxEpoch(maxEpoch);
        var testStart = window.performance.now();
        var filepath = "ABC-N" + this.MAX_LENGTH + "-" + trialLimit + "-" + maxEpoch + ".txt";
        var startTime;
        var endTime;
        var totalTime = 0;
        var fail = 0;
        var success = 0;
        this.logParameters();
        for (var i = 0; i < this.MAX_RUN;) {
            startTime = window.performance.now();
            if (this.abc.algorithm()) {
                endTime = window.performance.now();
                totalTime = endTime - startTime;
                console.log("Done");
                console.log("run " + (i + 1));
                console.log("time in nanoseconds: " + totalTime);
                console.log("Success!");
                this.runtimes[i] = totalTime;
                i++;
                success++;
                this.logWriter.addString("Run: " + i);
                this.logWriter.addString("Runtime in nanoseconds: " + totalTime);
                this.logWriter.addString("Found at epoch: " + this.abc.getEpoch());
                this.logWriter.addString("Population size: " + this.abc.getPopSize());
                this.logWriter.addString("");
                this.abc.getSolutions().forEach(function (h) {
                    _this.logWriter.addObject(h);
                    _this.logWriter.addString("");
                });
            }
            else {
                fail++;
                console.log("Fail!");
            }
            if (fail >= 100) {
                console.log("Cannot find solution with these params");
                break;
            }
            startTime = 0;
            endTime = 0;
            totalTime = 0;
        }
        console.log("Number of Success: " + success);
        console.log("Number of failures: " + fail);
        this.logWriter.addString("Runtime summary");
        this.logWriter.addString("");
        for (var x = 0; x < this.runtimes.length; x++) {
            this.logWriter.addString(this.runtimes[x].toString());
        }
        var testEnd = window.performance.now();
        this.logWriter.addString((testStart).toString());
        this.logWriter.addString((testEnd).toString());
        this.logWriter.addString((testEnd - testStart).toString());
        this.logWriter.writeFile(filepath);
        this.printRuntimes();
    };
    TesterABC.prototype.logParameters = function () {
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
    };
    TesterABC.prototype.printRuntimes = function () {
        this.runtimes.forEach(function (val) {
            console.log("run with time " + val + " nanoseconds");
        });
    };
    TesterABC.prototype.start = function () {
        console.log("im starting");
        this.test(4, 50, 10);
    };
    return TesterABC;
}());
var main = new TesterABC();
console.log("build new file");
var log = (function (value) {
    console.log(value);
});
log("new value is this");
log("gile get new");
log("sample file");
log("sample 2 and a half new");
//# sourceMappingURL=main.js.map