const domain = "https://lagunawaterreserve.000webhostapp.com/"
const baseurl = domain + "api/"

class Datahandler {

    fetchApi(url, param = {}) {
        return new Promise((resolve, reject) => {
            $.get(url, param, function (data, status) {
                if (status == "success") {
                    console.log(data)
                    resolve(JSON.parse(data))
                    /* resolve(data) */
                } else {
                    reject(status)
                }
            });
        })
    }

    /**
     * returns a promise report from the database
     */
    getReports() {
        let url = baseurl + 'getreports.php'
        return this.fetchApi(url)
    }

}

const DataHandlerObject = new Datahandler()