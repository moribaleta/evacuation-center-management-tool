

class DataHandlerClass {

    host = "https://ievacuate-laguna.000webhostapp.com/evacuation-center-management/evacuation-management-system/"
    baseUrl = this.host + "api"

    fetchApi(url, param = {}){
        return new Promise((resolve,reject) => {
            $.get(url,param,function (data, status) {
                if (status == "success"){
                    resolve(JSON.parse(data))
                }else{
                    reject(status)
                }
            });
        })
    }

    postApi(url, param = {}){
       
        return new Promise((resolve,reject) => {
            $.post(url,param,function (data, status) {
                if (status == "success"){
                    resolve(JSON.parse(data))
                }else{
                    reject(status)
                }
            });
        })
    }

    getRoadMap(){
        return this.fetchApi(`${this.baseUrl}/getRoadMap.php`)
    }

    setRoadMap(params){
        return this.postApi(`${this.baseUrl}/setRoadMap.php`, params)
    }

    /* login(username, password) {
        console.log(username +"--"+ password)
        return this.postApi(`${this.baseUrl}/login.php`, {username, password})
    }

    getReports(){
        return this.fetchApi(`${this.baseUrl}/getreports.php?i=1`)
    }

    saveReport(params) {
        return this.postApi(`${this.baseUrl}/savereport.php`,params)
    }

    deleteReport(ID){
        console.log("deleting %o",ID)
        return this.postApi(`${this.baseUrl}/deletereports.php`,{ID})
    }

    editReport(params) {
        return this.postApi(`${this.baseUrl}/editreports.php`, params)
    }

    getUsers(){
        return this.fetchApi(`${this.baseUrl}/getUsers.php`)
    }

    addUser(params){
        return this.postApi(`${this.baseUrl}/addUser.php`, params)
    }

    deleteUser(id){
        return this.postApi(`${this.baseUrl}/deleteUser.php`,{id})
    }

    editUser(params){
        return this.postApi(`${this.baseUrl}/editUser.php`, params)
    } */
}

const DataHandler = new DataHandlerClass()