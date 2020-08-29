/**
 * ### Water Quality Index
 * class used for calculating the wqi value from a number of reports
 * @see https://psa.gov.ph/sites/default/files/Session%201-5%20Evaluation%20of%20Water%20Equality%20of%20Major%20Rivers%20in%20Palawan%2C%20Philippines%20using%20Physico-Chemical%20Parameters%20and%20Water%20Quality%20Index.pdf
 */
class WQIClass {

    /**
     * number of reports stored
     */
    reports = []

    /**
     * the wqiObject 
     * * contains the wqi value 
     * * contains wqi grade
     */
    wqiObject = {
        wqi: 0,
        eq: null
    }

    constructor(reports) {
        let _reports = JSON.parse(JSON.stringify(reports))
        this.reports = _reports.map((report) => {
            delete report.ID
            delete report.WATER_QUALITY_INDEX
            delete report.STATION
            delete report.DATE_CREATED
            delete report.USERID
            return report
        })
        this.calculate()
    }

    /**
     * generates the wqiObject from the reports
     */
    calculate() {
        if (this.reports.length > 0) {
            this.wqiObject = this.computeGrade(this.reports)
        }
    }

    /**
     * returns the generated wqi value and grade
     * @param {*} reports - array of reports to be calculated
     * 
     * @returns wqi - the wqi value raning from 0 - 100
     * @returns eq - the equivalent grade of wqi 
     */
    computeGrade(reports) {
        let wqi = this.computeWQI(reports)
        
        var eq = ""

        if (wqi > 95) {
            eq = "excellent"
        } else if (wqi > 80) {
            eq = "good"
        } else if (wqi > 65) {
            eq = "fair"
        } else if (wqi > 45) {
            eq = "marginal"
        } else {
            eq = "poor"
        }
        return {
            wqi,
            eq
        }
    }

    /**
     * generates the wqi value from the array of reports
     * @param {r} reports - array of reports used to calculate wqi 
     */
    computeWQI(reports) {
        
        let f1 = this.computeFunction1(reports)
        let f2 = this.computeFunction2(reports)
        let f3 = this.computeFunction3(reports)

        let f1pow = Math.pow(f1, 2)
        let f2pow = Math.pow(f2, 2)
        let f3pow = Math.pow(f3, 2)

        console.log("wqi reports %o", {
            f1,
            f2,
            f3,
            f1pow,
            f2pow,
            f3pow
        })

        return 100 - (Math.sqrt(f1pow + f2pow + f3pow) / 1.732)
    }

    /**
     * calculation used the generate the first parameter needed for wqi
     * gets the number of failed variable over the number of variables
     * * eg. (params_failed/ params_n) * 100
     * @param {*} reports - array of reports used to generated the value
     */
    computeFunction1(reports) {
        let n = Object.keys(reports[0]).length
        let params = Object.keys(reports)
        var map_params = {}
        params.map((param) => {
            map_params[param] = true
        })

        reports.map((report) => {
            params.map((key) => {
                let value = report[key]
                let test = this.getBestWorst(key, value)
                if (map_params[key]) {
                    map_params[key] = test
                }
            })
        })

        let failed = Object.keys(params).filter((key) => {
            return params[key] == false
        }).length

        return (failed / n) * 100
    }

    /**
     * calculation used the generate the 2nd parameter needed for wqi
     * gets the number of failed test over the number of test per report
     * * eg. (params_failed_test/ n_test) * 100
     * @param {*} reports - array of reports used to generated the value
     */
    computeFunction2(reports) {
        
        let n = reports.length

        let failed_reports = reports.map((report) => {
            return Object.keys(report).map(key => {
                let value = report[key]
                return this.getBestWorst(key, value)
            }).filter((item) => {
                return !item.passed
            }).length
        })

        
        var sum_failed = 0
        failed_reports.map((count) => {
            sum_failed += count
        })

        let total_test_n = Object.keys(reports[0]).length * n

        let output = (sum_failed / total_test_n) * 100

        console.log("function 2 %o",{
            reports,
            n,
            failed_reports,
            sum_failed,
            total_test_n,
            output
        })


        return output
    }

    /**
     * calculation used the generate the 2nd parameter needed for wqi
     * gets the number of normalized value then returns the formula:
     * * eg. normalize_val / ((const 0.01) * normalize_val + (const 0.01))
     * @param {*} reports - array of reports used to generated the value
     */
    computeFunction3(reports) {
        let params = Object.keys(reports[0])
        let n_params = params.length
        let n = reports.length * n_params

        var failed_test = []

        reports.map((report) => {
            let failed_params = params.map((key) => {
                let value = report[key]
                return this.getBestWorst(key, value)
            }).filter((item) => {
                return !item.passed
            })
            failed_test = failed_test.concat(failed_params)
        })

        let excursions = failed_test.map((test) => {
            return this.computeExcursion(test)
        })

        var sum_excursions = 0
        excursions.map((excursion) => {
            sum_excursions += excursion
        })
        let normalized = sum_excursions / n
        return (normalized / ((0.01 * normalized) + 0.01))
    }

    /**
     * returns the value used to generate the normalized value
     * * if the (best/objective) < test value return (value/objective) - 1
     * * else return (objective/value) - 1
     * @param {*} test - object contaning {value, worst, best, passed, type} returned by @function getBestWorst
     */
    computeExcursion(test) {
        if (test.best < test.value) {
            return (test.value / test.best) - 1
        } else {
            return (test.best / test.value) - 1
        }
    }

    /**
     * returns an object containing {worst, best, passed, value, type}
     * 
     * @param {*} type - the type of param used eg. PH, AMMONIA ...etc
     * @param {*} value - the value to be tested
     * 
     * @returns worst - the worst value / undesired value
     * @returns best - the best object / desired value
     * @returns passed - rule used to determine if the value passed is between worst - best
     * @returns value - returns the value passed from the function
     * @returns type - returns the type passed from the function
     */
    getBestWorst(type, value) {
        switch (type) {
            case 'PH':
                return {
                    worst: 8,
                    best: 7,
                    passed: value < 8 && value >= 7,
                    value,
                    type
                }
            case 'AMMONIA_TOTAL_MGL_N':
                return {
                    worst: 0.27,
                    best: 0.05,
                    passed: value < 0.14,
                    value,
                    type
                }
            case 'NITRATE_TOTAL_MGLASN':
                return {
                    worst: 10,
                    best: 0,
                    passed: value < 8 && value >= 0,
                    value,
                    type
                }
            case 'INORGANIC_PHOSPHATE':
                return {
                    worst: 0.75,
                    best: 0.06,
                    passed: value < 0.4 && value >= 0.06,
                    value,
                    type
                }
            case 'BOD':
                return {
                    worst: 100,
                    best: 2,
                    passed: value < 6 && value >= 1,
                    value,
                    type
                }
            case 'DISSOLVED_OXYGEN_MGL':
                return {
                    worst: 0,
                    best: 10,
                    passed: value > 4,
                    value,
                    type
                }
            case 'FECAL_COLIFORMS':
                return {
                    worst: 200,
                    best: 50,
                    passed: value < 150,
                    value,
                    type
                }
        }
    }
}