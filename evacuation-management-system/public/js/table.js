class TableClass {

    reports_data = []
    table_data = {}
    chart = null

    constructor(reports_data = []) {
        this.reports_data = reports_data
        this.oGraph = document.getElementById('line-graph').getContext('2d');
        this.preprocessData()
        this.setGraphsData();
    }

    preprocessData() {
        let header = Object.keys(this.reports_data[0])

        header.map((column) => {
            if (column != "ID" && column != "USERID") {
                this.table_data[column] = []
            }
        })

        console.log("preprocessed %o", this.table_data)

        this.reports_data.map((data) => {
            header.map((column) => {
                if (column != "ID" && column != "USERID") {
                    if (!this.table_data[column].includes(data[column])) {
                        this.table_data[column].push(data[column])
                    }
                }
            })
        })

        console.log("preprocessed %o", this.table_data)
    }

    selectListener() {
        this.oSearch.parameter = this.oSelectLineGraph.val();
        console.log(this.oSearch);
        this.oSelectLineGraph.on('change', function (e) {
            oLineGraph.oSearch.parameter = e.target.value;
            console.log("value change %o", e.target.value)
        });
    }

    setGraphsData() {
        var reports = this.table_data.STATION.map((station) => {
            let count = this.reports_data.filter((data) => {
                return data.STATION == station
            }).length
            return {
                label: station,
                value: count
            }
        })

        console.log("table graph %o", reports)

        let data = {
            labels: reports.map((report) => {
                return report.label
            }),
            datasets: [{
                label: "Station",
                data: reports.map((report) => {
                    return report.value
                }),
                backgroundColor: "blue",
                borderColor: "lightblue",
                fill: false,
                lineTension: 0,
                radius: 5
            }],
        };

        //options
        let options = {
            responsive: true,
            title: {
                display: true,
                position: "top",
                text: "Line Graph",
                fontSize: 18,
                fontColor: "#111"
            },
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    fontColor: "#333",
                    fontSize: 16
                }
            }
        };

        let myLineChart = new Chart(this.oGraph, {
            type: 'line',
            data: data,
            options: options
        });
    }

    setMap(data, options) {
        this.chart = new Chart(this.oGraph, {
            type: 'line',
            data: data,
            options: options
        });
    }

};


var tableGraph = new Vue({
    el: '#table_graph',
    data: {
        reports: [],
        select_date: 0,
        select_type: null,
        graph: null,

        selection_date: [
            /*  { id: 0, label: 'Today', value: [moment(), moment()] },
             { id: 1, label: 'Yesterday', value: [moment().subtract(1, 'days'), moment().subtract(1, 'days')] }, */
            { id: 0, label: 'Last 7 Days', value: [moment().subtract(6, 'days'), moment()] },
            { id: 1, label: 'Last 30 Days', value: [moment().subtract(29, 'days'), moment()] },
            { id: 2, label: 'This Month', value: [moment().startOf('month'), moment().endOf('month')] },
            { id: 3, label: 'Last 5 Months', value: [moment().subtract(5, 'month').startOf('month'), moment()] },
            { id: 4, label: 'Last Year', value: [moment().subtract(1, 'year').startOf('year'), moment()] },
            { id: 5, label: 'Last 5 Years', value: [moment().subtract(5, 'year').startOf('year'), moment()] },
            { id: 6, label: 'Last 10 Years', value: [moment().subtract(10, 'year').startOf('year'), moment()] },
        ],

        selection_type: []
    },
    methods: {
        setData(reports) {
            this.reports = reports

            this.selection_type = Object.keys(reports[0]).filter((key) => {
                return (!key.includes('ID') && !key.includes('USERID') && !key.includes('DATE_CREATED') && !key.includes('STATION'))
            })
            /* this.selection_type = Object.keys(reports[0]) */

            console.log("selection type %o", this.selection_type)

            this.initGraph()
        },

        initGraph() {
            this.graph = new TableClass(this.reports)
            console.log("time filter %o", this.selection_date)
        },

        filterGraph() {
            let date_selected = this.selection_date[this.select_date]

            console.log("date selected %o by ", date_selected, this.select_date)
            let type = this.select_type

            let start_date = new Date(date_selected.value[0])
            let end_date = new Date(date_selected.value[1])

            console.log("start %o %o %o", start_date.getMonth(), start_date.getDate(), start_date.getFullYear())

            let reports = this.reports.filter((report) => {
                let date = report.DATE_CREATED.split('-')
                let year = date[0]
                let month = date[1]
                let day = date[2]
                if (this.select_date == 0 || this.select_date == 1) {
                    return start_date.getFullYear() == year && start_date.getMonth() + 1 == month && start_date.getDate() == day
                }
                return (start_date.getMonth() + 1 <= month && end_date.getMonth() + 1 >= month) && (start_date.getFullYear() <= year && end_date.getFullYear() >= year)
            })

            console.log("filtered reports %o", reports)
            let timeframe = this.groupByTimeframe(reports)
            this.regenerateGraph(timeframe)
        },

        groupByTimeframe(reports) {
            switch (this.select_date) {
                case 0:
                case 1:
                    return this.timeframeByDate(reports, 2)
                case 2:
                case 3:
                    return this.timeframeByDate(reports, 1)
                default:
                    return this.timeframeByDate(reports)
            }
        },

        /**
         * returns grouped reports by specific timeframe
         * @param {*} reports - reports to be displayed
         * @param {*} timeframetype - timeframetype to be used 0-year | 1-month | 2-date
         */
        timeframeByDate(reports, timeframetype = 0) {
            var timeframeDate = {}
            reports.map((report) => {
                let date = report.DATE_CREATED.split('-')[timeframetype]
                console.log(date)
                if (timeframeDate[date]) {
                    timeframeDate[date].push(report)
                } else {
                    timeframeDate[date] = [report]
                }
            })

            return timeframeDate
        },

        getValueWQI(quality) {
            switch (quality) {
                case 'POOR':
                    return 0
                case 'MARGINAL':
                    return 1
                case 'FAIR':
                    return 2
                case 'GOOD':
                    return 4
                default:
                    return 5
            }
        },

        regenerateGraph(timeframe) {
            console.log("timeframe %o", timeframe)
            let graph_report = Object.keys(timeframe).map((key) => {
                let value = 0
                timeframe[key].map((report) => {
                    if (this.select_type == 'WATER_QUALITY_INDEX') {
                        value += this.getValueWQI(report[this.select_type])
                    } else {
                        value += Number(report[this.select_type])
                    }
                })
                let ave_value = value / timeframe[key].length
                return {
                    label: key,
                    value: ave_value.toFixed(2)
                }
            })

            console.log("table graph %o", graph_report)

            let data = {
                labels: graph_report.map((report) => {
                    return report.label
                }),
                datasets: [{
                    label: this.select_type.split('_').join(' '),
                    data: graph_report.map((report) => {
                        return report.value
                    }),
                    backgroundColor: "blue",
                    borderColor: "lightblue",
                    fill: false,
                    lineTension: 0,
                    radius: 5
                }],
            };

            //options
            let options = {
                responsive: true,
                title: {
                    display: true,
                    position: "top",
                    text: "Line Graph",
                    fontSize: 18,
                    fontColor: "#111"
                },
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        fontColor: "#333",
                        fontSize: 16
                    }
                }
            };

            this.graph.setMap(data, options)

        }

    }
})