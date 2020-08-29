let home_app = new Vue({
    el: '#home_app',
    data: {
        reports: [],
        table: TableClass,
        prediction: null
    },
    methods: {
        init() {
            this.getData()
            this.prediction = new PredictionClass()
        },
        getData() {
            DataHandlerObject.getReports().then((data) => {
                this.reports = data
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.setTableDisplay()
            })
        },

        setTableDisplay() {
            this.setMapData()
            tableGraph.setData(this.reports)
        },

        setMapData() {
            let years = []

            this.reports.map((report) => {
                let year = report.DATE_CREATED.split('-')[0]
                if (!years.includes(year)) {
                    years.push(year)
                }
            })
            var max_year = 0
            years.map((year) => {
                if (Number(year) > max_year) {
                    max_year = Number(year)
                }
            })

            let _reports = this.reports.filter((report) => {
                let year = report.DATE_CREATED.split('-')[0]
                return Number(year) === max_year
            })
            this.setOverviewMap(_reports)
            this.setSimulateMap(_reports)
        },

        setOverviewMap(reports) {
            console.log("reports %o", reports)
            mapItems.map_overview = new MapClass('map_overview', reports)
        },

        setSimulateMap(reports) {
            var stations = {}

            if(!this.prediction){
                this.prediction = new PredictionClass()
            }

            reports.map((report) => {
                if (!stations[report.STATION]) {
                    stations[report.STATION] = [report]
                } else {
                    stations[report.STATION].push(report)
                }
            })

            let forecasted_reports = []
            Object.keys(stations).map(key => {
                this.prediction = new PredictionClass()
                let forecast_station = this.prediction.forecast(key, [stations[key][0]], 1)
                /* console.log("%o %o \n %o", key, JSON.stringify(forecast_station), JSON.stringify(stations[key])) */
                forecasted_reports = forecasted_reports.concat(forecast_station)
            })
            mapItems.map_simulate = new MapClass('map_simulation', forecasted_reports)
        }

    }
})


home_app.init()


function onGoogleMapsInit() {
    initMap()
    home_app.setMapData()
}