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
                            object.municipality, object.username, )
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
                        //console.log(doc.id, " => ", doc.data());
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
                .then(function () {
                    resolve("Document successfully deleted!");
                }).catch(function (error) {
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
                        //console.log(doc.id, " => ", doc.data());
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
                .then(function () {
                    resolve("Document successfully deleted!");
                }).catch(function (error) {
                    reject(error)
                });
        })
    }


    getEvacuationHistory(evac_id = null) {
        let collection = this.firestore.collection('evacuation_history')
        let ref = evac_id != null ? ref.where('evac_id', '==', evac_id) : collection

        return new Promise((resolve, reject) => {
            ref.get().then((querySnapshot) => {
                    var models = []
                    querySnapshot.forEach(function (doc) {
                        //console.log(doc.id, " => ", doc.data());
                        let data = doc.data()
                        let id = doc.id

                        let object = {
                            id,
                            evac_id: data.evac_id,
                            current_population: data.current_population,
                            created_by: data.created_by,
                            report_date: data.report_date.toDate(),
                            date_created: data.date_created?.toDate() || null,
                        }
                        models.push(EvacuationHistory.parse(object))
                    });

                    var message = new Message()
                    message.data = models
                    resolve(message)
                })
                .catch((error) => {
                    reject(error)
                });
        })
    } //getEvacuationHistory


    addEvacuationHistory(params = new EvacuationHistory()) {
        return new Promise((resolve, reject) => {
            this.firestore.collection('evacuation_history')
                .doc(params.id)
                .set(params.toObject())
                .then(function () {
                    resolve("Document successfully written!")
                }).catch(function (error) {
                    reject(error)
                });
        })
    } //addEvacuationHistory


    setDataEvacuationHistory(params = []) {
        let promises = params.map((evac) => {
            return this.addEvacuationHistory(evac)
        })
        return Promise.all(promises)
        /* return new Promise((resolve, reject) => {
            this.firestore.collection('evacuation_history')
                .doc(params.id)
                .set(params.toObject())
                .then(function () {
                    resolve("Document successfully written!")
                }).catch(function (error) {
                    reject(error)
                });
        }) */
    } //addEvacuationHistory


    deleteEvacuationHistory(id) {
        return new Promise((resolve, reject) => {
            this.firestore.collection('evacuation_history')
                .doc(id).delete()
                .then(function () {
                    resolve("Document successfully deleted!");
                }).catch(function (error) {
                    reject(error)
                });
        })
    } //deleteEvacuationHistory


} //DataHandlerClass

let DataHandler = new DataHandlerClass()
