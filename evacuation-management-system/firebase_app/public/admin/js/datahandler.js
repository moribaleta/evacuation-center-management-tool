/* 

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
    
    login(username, password) {
        console.log(username +"--"+ password)
        return this.postApi(`${this.baseUrl}/login_admin.php`, {username, password})
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
    }
    
    getEvacuationCenters(){
        return this.fetchApi(`${this.baseUrl}/getEvacuationCenters.php`)
    }
    addEvacationCenter(params){
        return this.postApi(`${this.baseUrl}/addEvacuationCenter.php`, params)
    }
    editEvacationCenter(params){
        return this.postApi(`${this.baseUrl}/setEvacuationCenter.php`,{id})
    }
    deleteEvacationCenter(params){
        return this.postApi(`${this.baseUrl}/deleteEvacuationCenter.php`, params)
    }
}

let DataHandler = new DataHandlerClass() */

/**
* User object structure
*/
class AdminUser {
    id
    admin_type
    created_by
    date_created
    firstname
    lastname
    municipality
    username
    
    constructor(id, admin_type, created_by, date_created, firstname, lastname, municipality, username) {
        this.id           = id
        this.admin_type   = admin_type
        this.created_by   = created_by
        this.date_created = date_created
        this.firstname    = firstname
        this.lastname     = lastname
        this.municipality = municipality
        this.username     = username
    }
}//AdminUser




/**
* class for handling storage and database fetch
*/
class DataHandlerClass extends DataHandlerType {
    
    ///firestore
    firestore
    ///storage
    storage
    ///database
    database
    ///app config
    config
    
    login(username, password) {
        this.configure()
        
        return new Promise((resolve, reject) => {
            console.log(username +"--"+ password)
            this.firestore.collection('admin_user')
            .where("username","==", username)
            .where("password","==", password)
            .get().then(function(querySnapshot) {
                var users = []
                querySnapshot.forEach(function(doc) {
                    console.log(doc.id, " => ", doc.data());
                    let object = doc.data()
                    let admin = new AdminUser(doc.id, object.admin_type,
                        object.created_by, object.date_created,
                        object.firstname, object.lastname,
                        object.municipality, object.username)
                        users.push(admin)
                    });
                    
                    var message = new Message()
                    
                    if (users.length > 0) {
                        message.data = users[0].id
                        resolve(message)
                    } else {
                        message.data  = "error"
                        message.error = "Invalid Username and Password"
                        reject(message)
                    }
                    
                })
                .catch(function(error) {
                    console.log("Error getting documents: ", error);
                    reject(error)
                });
            })
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
        }
        
        getEvacuationCenters(){
            this.configure()
            //return this.fetchApi(`${this.baseUrl}/getEvacuationCenters.php`)
            return new Promise((resolve, reject) => {
                
                this.firestore.collection('evacuation_centers')
                .get().then(function(querySnapshot) {
                    var evacuations = []
                    querySnapshot.forEach(function(doc) {
                        console.log(doc.id, " => ", doc.data());
                        let data = doc.data()
                        let id = doc.id
                        
                        let object = {id, ...data}
                        evacuations.push(EvacuationCenter.parse(object))
                    });
                    
                    var message = new Message()
                    
                    message.data = evacuations
                    resolve(message)
                    
                })
                .catch(function(error) {
                    reject(error)
                });
            })
        }
        
        
        addEvacationCenter(params = new EvacuationCenter()){
            //return this.postApi(`${this.baseUrl}/addEvacuationCenter.php`, params)
            return new Promise((resolve, reject) => {
                this.firestore.collection('evacuation_centers')
                .doc(params.id)
                .set(params.toObject())
                .then(function() {
                    resolve("Document successfully written!")
                }).catch(function(error) {
                    reject(error)
                });
            })
        }
        
        
        deleteEvacationCenter(params){
            return this.postApi(`${this.baseUrl}/deleteEvacuationCenter.php`, params)
        }
        
        
        
    }//DataHandlerClass
    
    let DataHandler = new DataHandlerClass()