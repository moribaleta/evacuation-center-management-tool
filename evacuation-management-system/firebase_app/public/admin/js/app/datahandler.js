

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
        this.id = id
        this.admin_type = admin_type
        this.created_by = created_by
        this.date_created = date_created
        this.firstname = firstname
        this.lastname = lastname
        this.municipality = municipality
        this.username = username
    }
} //AdminUser


class MOABCParameters {
    id             
    date_created   
    created_by     
    max_length     
    max_val        
    population_size
    trial_limit    
    max_epoch      
    min_shuffle    
    max_shuffle   
    
    static parameters_shown = {
        id: 'id',
        date_created: 'Date Created',
        created_by: 'Created By User',
        max_length: 'Maximum Number of Nectars per Food Source',
        population_size: 'Maximum # of Population',
        trial_limit: 'Trial Limit',
        max_epoch: 'Maximum Generation',
        min_shuffle: 'Minimum Shuffle Value',
        max_shuffle: 'Maximum Shuffle Value',
    }

    constructor( id, date_created, created_by, max_length, max_val,
                population_size, trial_limit, max_epoch, min_shuffle, max_shuffle) {
        this.id              = id || genID(5)
        this.date_created    = date_created || (new Date()).toLocaleString()
        this.created_by      = created_by || '0'
        this.max_length      = max_length || 0
        this.max_val         = max_val || 0
        this.population_size = population_size || 0
        this.trial_limit     = trial_limit  || 0
        this.max_epoch       = max_epoch    || 0
        this.min_shuffle     = min_shuffle  || 0
        this.max_shuffle     = max_shuffle  || 0
    }

    static parse(objects = {}) {
        return new MOABCParameters(
            objects.id             ,
            objects.date_created   ,
            objects.created_by     ,
            objects.max_length     ,
            objects.max_val        ,
            objects.population_size,
            objects.trial_limit    ,
            objects.max_epoch      ,
            objects.min_shuffle    ,
            objects.max_shuffle    
        )
    }

    toObject(){
        return {
            id              : this.id             ,
            date_created    : this.date_created   ,
            created_by      : this.created_by     ,
            max_length      : this.max_length     ,
            max_val         : this.max_val        ,
            population_size : this.population_size,
            trial_limit     : this.trial_limit    ,
            max_epoch       : this.max_epoch      ,
            min_shuffle     : this.min_shuffle    ,
            max_shuffle     : this.max_shuffle    
        }
    }

}//MOABCParameters



/**
 * class for handling storage and database fetch
 */
class DataHandlerClass extends DataHandlerType {
    

    login(username, password) {
        this.configure()
        return new Promise((resolve, reject) => {
            console.log(username + "--" + password)
            this.firestore.collection('admin_user')
                .where("username", "==", username)
                .where("password", "==", password)
                .get().then(function (querySnapshot) {
                    var users = []
                    querySnapshot.forEach(function (doc) {
                        console.log(doc.id, " => ", doc.data());
                        let object = doc.data()
                        let admin = new AdminUser(
                            doc.id, object.admin_type,
                            object.created_by, object.date_created,
                            object.firstname, object.lastname,
                            object.municipality, object.username,)
                        users.push(admin)
                    });

                    var message = new Message()

                    if (users.length > 0) {
                        message.data = users[0]
                        resolve(message)
                    } else {
                        message.data = "error"
                        message.error = "Invalid Username and Password"
                        reject(message)
                    }

                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                    reject(error)
                });
        })
    }

    getReports() {
        return this.fetchApi(`${this.baseUrl}/getreports.php?i=1`)
    }

    saveReport(params) {
        return this.postApi(`${this.baseUrl}/savereport.php`, params)
    }

    deleteReport(ID) {
        console.log("deleting %o", ID)
        return this.postApi(`${this.baseUrl}/deletereports.php`, {
            ID
        })
    }

    editReport(params) {
        return this.postApi(`${this.baseUrl}/editreports.php`, params)
    }

    getUsers() {
        return this.fetchApi(`${this.baseUrl}/getUsers.php`)
    }

    addUser(params) {
        return this.postApi(`${this.baseUrl}/addUser.php`, params)
    }

    deleteUser(id) {
        return this.postApi(`${this.baseUrl}/deleteUser.php`, {
            id
        })
    }

    editUser(params) {
        return this.postApi(`${this.baseUrl}/editUser.php`, params)
    }

    getEvacuationCenters() {
        return new Promise((resolve, reject) => {
            this.firestore.collection('evacuation_centers')
                .get().then(function (querySnapshot) {
                    var evacuations = []
                    querySnapshot.forEach(function (doc) {
                        console.log(doc.id, " => ", doc.data());
                        let data = doc.data()
                        let id = doc.id

                        let object = {
                            id,
                            ...data
                        }
                        evacuations.push(EvacuationCenter.parse(object))
                    });

                    var message = new Message()

                    message.data = evacuations
                    resolve(message)

                }).catch(function (error) {
                    reject(error)
                });
        })
    }


    addEvacationCenter(params = new EvacuationCenter()) {
        return new Promise((resolve, reject) => {
            this.firestore.collection('evacuation_centers')
                .doc(params.id)
                .set(params.toObject())
                .then(function () {
                    resolve("Document successfully written!")
                }).catch(function (error) {
                    reject(error)
                });
        })
    }


    deleteEvacationCenter(id) {
        return new Promise((resolve, reject) => {
            this.firestore.collection('evacuation_centers')
                .doc(id).delete()
                .then(function() {
                    resolve("Document successfully deleted!");
                }).catch(function(error) {
                    reject(error)
                });
        })
    }


    getModelParams() {
        return new Promise((resolve, reject) => {
            this.firestore.collection('moabc')
                .get().then(function (querySnapshot) {
                    var models = []
                    querySnapshot.forEach(function (doc) {
                        console.log(doc.id, " => ", doc.data());
                        let data = doc.data()
                        let id = doc.id

                        let object = {
                            id,
                            ...data
                        }
                        models.push(MOABCParameters.parse(object))
                    });

                    var message = new Message()

                    message.data = models
                    resolve(message)

                })
                .catch(function (error) {
                    reject(error)
                });
        })
    }


    addModelParams(params = new MOABCParameters()) {
        return new Promise((resolve, reject) => {
            this.firestore.collection('moabc')
                .doc(params.id)
                .set(params.toObject())
                .then(function () {
                    resolve("Document successfully written!")
                }).catch(function (error) {
                    reject(error)
                });
        })
    }


    deleteModelParams(id) {
        return new Promise((resolve, reject) => {
            this.firestore.collection('moabc')
                .doc(id).delete()
                .then(function() {
                    resolve("Document successfully deleted!");
                }).catch(function(error) {
                    reject(error)
                });
        })
    }

    testModelParams(id) {
        /* return new Promise((resolve, reject) => {
            let test = this.functions.httpsCallable('testHoneyBeeModel')
            test({id})
                .then(function (value) {
                    resolve(value);
                }).catch(function (error) {
                    reject(error)
                });
        }) */
        
        return fetch('https://us-central1-ievacuate-laguna.cloudfunctions.net/testHoneyBeeModel', {
                method: 'POST',
                mode: "cors",
                body: {id}
            }).then((response) => response.json())
    }

    pingFunctions(id) {
        return new Promise((resolve, reject) => {
            fetch('https://us-central1-ievacuate-laguna.cloudfunctions.net/pingFunctionWithCorsAllowed', {
                method: 'POST',
                mode: "cors",
                body: {id}
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log("value %o", response)
                resolve(response);
            }).catch(function (error) {
                reject(error)
            });
        })
    }


} //DataHandlerClass

let DataHandler = new DataHandlerClass()

