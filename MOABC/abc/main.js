var modelGen = {
    iteration: 10,
    population_size: 10,
    limit: 5,
    lb: [0, 0],
    up: [10, 10],
    fitness: {},
    objective: {}
}

class MOABC {

    bees;
    modelGen = {};
    data = []

    trial = []
    arr_objectives = []
    arr_fitness = []

    nDecisions = 0

    population = []

    bestSol = {}
    bestObj = {
        value: {},
        index: 0
    }

    combSol = {}

    constructor(modelGen) {
        this.modelGen = modelGen
        console.log("modelGen %o", modelGen)
    }

    start() {
        /* this.nDecisions = this.modelGen.lb.length

        let substr = arrSub(this.modelGen.up, this.modelGen.lb)
        let mularr = substr.map((val)=>{return val * rand(this.modelGen.population_size, this.nDecisions)}) 
        let val = arrAdd(this.modelGen.lb, mularr)
        console.log("value %o %o %o", substr, mularr, val) */

        this.initialization()
        //this.hiveGeneration()




        let arr_objective_set = ([...this.arr_objectives].concat(this.bestobj)).filter(x => x != undefined)
        let minBestObj = min(arr_objective_set)
        this.combSol = [...this.population].concat(this.bestSol)
        this.bestSol = this.combSol[minBestObj.index]

        console.log("output end ==> arr_objective_set %o", arr_objective_set)
        console.log("output end ==> minBestObj %o", minBestObj)
        console.log("output end ==> combSol %o", this.combSol)
        console.log("output end ==> bestSol %o", this.bestSol)
    }

    initialization() {
        console.log("initialize ==> modelGen %o", this.modelGen)
        this.nDecisions = this.modelGen.lb.length

        this.population = []

        this.arr_fitness = genArray(0, this.modelGen.population_size)
        this.arr_objectives = genArray(0, this.modelGen.population_size)
        this.trial = genArray(0, this.modelGen.population_size)

        /* for (var i = 0; i < this.modelGen.up[0]; i++) {
            this.population[i] = genArray(0, this.modelGen.population_size)
            for (var j = 0; j < this.modelGen.up[1]; j++) {
                this.population[i][j] = rand(this.modelGen.population_size, this.nDecisions)
            }
        } */
        let p1 = repmat(this.modelGen.lb, this.modelGen.population_size)
        console.log("initialize ==> population p1 %o", p1)
        let p2 = repmat(arrSub(this.modelGen.up, this.modelGen.lb), this.modelGen.population_size)
        console.log("initialize ==> population p2 %o", p2)
        let v_p2 = this.genRandomDecision(p2)
        console.log("initialize ==> population v_p2 %o", v_p2)
        this.population = arrAddMultiDim(p1, v_p2)

        console.log(this.nDecisions)
        console.log("initialize ==> population %o", this.population)

        for (var i = 0; i < this.modelGen.population_size; i++) {
            this.arr_objectives[i] = calcObjective(this.population[i])
            this.arr_fitness[i] = calcFitness(this.arr_fitness[i])
        }

        console.log("initialize ==> arr fitness %o", this.arr_fitness)
        console.log("initialize ==> arr objective %o", this.arr_objectives)

        this.bestObj = min(this.arr_objectives)
        console.log("initialize ==> best obj: %o ", this.bestObj)
        this.bestSol = this.population[this.bestObj.index]
        console.log("initialize ==> solution: $o", this.bestSol)
    }

    hiveGeneration() {
        for (var generation = 0; generation < this.modelGen.iteration; generation++) {
            console.log("GENERATION: " + generation)
            console.log("employed bee phase")
            for (var i = 0; i < this.modelGen.population_size; i++) {

                let newGenSolObj = genNewSol(modelGen.lb, modelGen.up, this.modelGen.population_size, i, this.population, this.arr_fitness, this.trial, this.arr_objectives, this.nDecisions)
                this.trial = newGenSolObj.trial
                this.population = newGenSolObj.population
                this.arr_fitness = newGenSolObj.arr_fitness
                this.arr_objectives = newGenSolObj.arr_objectives
                console.log("employed bee phase %o %o", i, newGenSolObj)
            }
            let fitness_value = (this.arr_fitness[generation] / max(this.arr_fitness).max)
            let probability = 0.9 * fitness_value

            console.log("employed end ==> arr fitness %o", this.arr_fitness)
            console.log("employed end ==> arr objective %o", this.arr_objectives)
            console.log("employed end ==> fitness value %o", fitness_value)

            var m = 0
            var n = 1
            console.log("onlooker bee phase - probability %o", probability)
            while (m < this.modelGen.population_size) {
                //console.log("model loop %o", n)
                let randomVal = Math.random()
                //console.log("randomVal %o vs probability %o", randomVal, probability)
                if (randomVal < probability) {
                    let newGenSolObj = genNewSol(this.modelGen.lb, this.modelGen.up, this.modelGen.population_size, n, this.population, this.arr_fitness, this.trial, this.arr_objectives, this.nDecisions)
                    this.trial = newGenSolObj.trial
                    this.population = newGenSolObj.population
                    this.arr_fitness = newGenSolObj.arr_fitness
                    this.arr_objectives = newGenSolObj.arr_objectives
                    console.log("onlooker bee %o %o", m, newGenSolObj)
                    m++
                }
                n = (n % this.modelGen.population_size)
            }

            let arr_objective_set = [...this.arr_objectives].concat(this.bestobj)
            let minBestObj = min(arr_objective_set)
            this.combSol = [...this.population].concat(this.bestSol)
            this.bestSol = this.combSol[minBestObj.index] //this.population[this.bestObj.index]

            console.log("onlooker end ==> arr_objectives %o, best obj %o", this.arr_objectives, this.bestobj)
            console.log("onlooker end ==> arr_objective_set %o", arr_objective_set)
            console.log("onlooker end ==> minBestObj %o", minBestObj)
            console.log("onlooker end ==> combSol %o", this.combSol)
            console.log("onlooker end ==> bestSol %o", this.bestSol)

            console.log("scout bee phase")
            let val = max(this.trial)

            if (val.max > this.modelGen.limit) {
                this.trial[val.index] = 0

                this.population[val.index] = arrAdd(this.modelGen.lb, (arrSub(this.modelGen.up, this.modelGen.lb).map((val) => {
                    val * rand(this.modelGen.population_size, this.nDecisions)
                })))


                this.arr_objectives[val.index] = calcObjective(this.population[val.index])
                this.arr_fitness[val.index] = calcFitness(this.arr_objectives[val.index])
                console.log("scout bee phase %o %o %o", this.population[val.index], this.arr_objectives[val.index], this.arr_fitness[val.index])
            } else {
                console.log("no scout op")
            }

            console.log("scout end ==> arr fitness %o", this.arr_fitness)
            console.log("scout end ==> arr objective %o", this.arr_objectives)

            console.log("end generation :" + i)
            console.log("end generation :" + generation)
        }

    }

    genScoutBeeSolution() {
        let substr = arrSub(this.modelGen.up, this.modelGen.lb)
        let mularr = this.genRandomDecision(substr) //substr.map((val)=>{return val * rand(this.modelGen.population_size, this.nDecisions)}) 
        let val = arrAdd(this.modelGen.lb, mularr)
        return val
    }

    genRandomDecision(arr) {
        //return arr.map((val)=>{return val * rand(this.modelGen.population_size, this.nDecisions)}) 

        //return arr.map((val)=>{return val * randArray(this.modelGen.population_size, this.nDecisions)}) 
        return arr.map((val) => {
            let randVal = randArray(this.modelGen.population_size, this.nDecisions)
            return arrMult(val, randVal)
        })
    }

}