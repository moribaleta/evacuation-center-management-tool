var Writer = (function () {
    function Writer() {
        this.list = [];
        this.list = [];
        console.log("constructed writer %o", this.list);
    }
    Writer.prototype.addString = function (line) {
        this.list.push(line);
    };
    Writer.prototype.printLog = function () {
        return this.list;
    };
    return Writer;
}());
var TesterABC = (function () {
    function TesterABC() {
        this.runtimes = [];
        console.log("created");
    }
    TesterABC.prototype.generate = function (params) {
        this.abc = new ArtificialBeeColony(params.max_length, params.max_val, params.population_size, params.trial_limit, params.max_epoch, params.min_shuffle, params.max_shuffle, this.evacuations);
        var startTime;
        var endTime;
        var totalTime = 0;
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
    };
    return TesterABC;
}());
var main = new TesterABC();
//# sourceMappingURL=test.js.map