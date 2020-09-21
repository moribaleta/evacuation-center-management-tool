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
    email
    password

    static keys = ['admin_type', 'date_created', 'firstname', 'lastname', 'municipality', 'username', 'email']

    constructor(id, admin_type, created_by, date_created, firstname, lastname, municipality, username, email, password) {
        this.id = id || "admin-" + genID(5)
        this.admin_type = admin_type
        this.created_by = created_by
        this.date_created = date_created || new Date()
        this.firstname = firstname
        this.lastname = lastname
        this.municipality = municipality
        this.username = username
        this.email = email
        this.password = password
    }

    toObject() {
        return {
            id: this.id,
            admin_type: this.admin_type,
            created_by: this.created_by,
            date_created: this.date_created,
            firstname: this.firstname,
            lastname: this.lastname,
            municipality: this.municipality,
            username: this.username,
            email: this.email,
            password: this.password
        }
    }

    static parse(object = {}) {
        return new AdminUser(
            object.id,
            object.admin_type,
            object.created_by,
            object.date_created,
            object.firstname,
            object.lastname,
            object.municipality,
            object.username,
            object.email,
            object.password
        )
    }
} //AdminUser








/** class functions handles user actions */
class UserHandler extends DataHandlerType {

    /** static enum contains all database table */
    static tables = {
        admin_user: 'admin_user',
        evacuation_centers: 'evacuation_centers',
        evacuation_history: 'evacuation_history',
        evacuation_inventory: 'evacuation_inventory',
        evacuation_supply: 'evacuation_supply',
        municipal_inventory: 'municipal_inventory',
        supply_types: 'supply_types',
        moabc: 'moabc',
        users: 'users',
    }

    /** login function */
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
                        let data = doc.data()
                        let id = doc.id
                        let object = {
                            id,
                            ...data
                        }
                        try {
                            object.date_created = data.date_created?.toDate()
                        } catch (err) {
                            console.log("error %o", err)
                        }

                        users.push(AdminUser.parse(object))
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
    } //login


    /* <------------ USER --------------*/
    /** gets user from the database */
    getAdminUsers(userid = "") {
        return new Promise((resolve, reject) => {
            this.firestore.collection('admin_user')
                .where('created_by', '==', userid)
                .get().then(function (querySnapshot) {
                    var users = []
                    querySnapshot.forEach(function (doc) {
                        console.log(doc.id, " => ", doc.data());
                        let data = doc.data()
                        let id = doc.id
                        var object = {
                            id,
                            ...data
                        }
                        object.date_created = data.date_created?.toDate()
                        users.push(AdminUser.parse(object))
                    });

                    var message = new Message()

                    message.data = users
                    resolve(message)
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                    reject(error)
                });
        })
    } //getUsers

    addAdminUsers(params = new AdminUser()) {
        return new Promise((resolve, reject) => {
            this.firestore.collection('admin_user')
                .doc(params.id)
                .set(params.toObject())
                .then(function () {
                    resolve("Document successfully written!")
                }).catch(function (error) {
                    reject(error)
                });
        })
    } //addAdminUsers


    deleteAdminUsers(id) {
        return new Promise((resolve, reject) => {
            this.firestore.collection('admin_user')
                .doc(id).delete()
                .then(function () {
                    resolve("Document successfully deleted!");
                }).catch(function (error) {
                    reject(error)
                });
        })
    } //deleteAdminUsers
    /* ------------ USER -------------->*/

    /** deletes an entry from table
     * @param id - id of document
     * @param table - database table
     */
    deleteEntry(id, table) {
        var message = new Message()
        return new Promise((resolve, reject) => {
            this.firestore.collection(table)
                .doc(id).delete()
                .then(function () {
                    message.data = "success delete"
                    resolve(message);
                }).catch(function (error) {
                    message.error = error
                    reject(message)
                });
        })
    } //deleteEvacuationHistory

    /** deletes an entry from table
     * @param id - id of document
     * @param table - database table
     */
    addEntry(id, params, table) {
        var message = new Message()
        return new Promise((resolve, reject) => {
            this.firestore.collection(table)
                .doc(id)
                .set(params)
                .then(function () {
                    message.data = "success add"
                    resolve(message);
                }).catch(function (error) {
                    message.error = error
                    reject(message)
                });
        })
    } //deleteEvacuationHistory
} //UserHandler

/** class functions handles evacuation center data */
class EvacuationHandler extends UserHandler {

    /*!--------- EVACUAITON CENTER ---------------!*/

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
    } //getEvacuationCenters


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
    } //addEvacationCenter


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
    } //deleteEvacationCenter

    /*!--------- EVACUAITON HISTORY ---------------!*/

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
    } //addEvacuationHistory


    deleteEvacuationHistory(id) {
        var message = new Message()

        return new Promise((resolve, reject) => {
            this.firestore.collection('evacuation_history')
                .doc(id).delete()
                .then(function () {
                    message.data = "success delete"
                    resolve(message);
                }).catch(function (error) {
                    message.error = error
                    reject(message)
                });
        })
    } //deleteEvacuationHistory

} //EvacuationHandler

/** class functions handles moab parameters used */
class MOABParamsHandler extends EvacuationHandler {

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
    } //getModelParams


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
    } //addModelParams


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
    } //deleteModelParams
} //MOABParamsHandler

class InventoryHandler extends MOABParamsHandler {

    /** returns the inventories of the evacuation centers */
    getInventories(evac_id = "") {
        return new Promise((resolve, reject) => {
            this.firestore.collection(UserHandler.tables.evacuation_inventory)
                .where('evac_id', '==', evac_id)
                .get().then(function (querySnapshot) {
                    var inventories = []
                    querySnapshot.forEach(function (doc) {
                        let data = doc.data()
                        let id = doc.id

                        let object = {
                            id,
                            ...data
                        }
                        try {
                            object.date_created = object.date_created.toDate()
                        } catch (err) {
                            console.log(err)
                        }
                        inventories.push(EvacuationInventory.parse(object))
                    });
                    var message = new Message()
                    message.data = {
                        id: evac_id,
                        inventories
                    }
                    resolve(message)
                }).catch(function (error) {
                    reject(error)
                });
        })
    } //getInventories

    /** returns the inventories of the evacuation centers */
    getInventory(id) {
        return new Promise((resolve, reject) => {
            this.firestore.collection(UserHandler.tables.evacuation_inventory)
                .where('id', '==', id)
                .get().then(function (querySnapshot) {
                    var inventories = []
                    querySnapshot.forEach(function (doc) {
                        let data = doc.data()
                        let id = doc.id

                        let object = {
                            id,
                            ...data
                        }
                        try {
                            object.date_created = object.date_created.toDate()
                        } catch (err) {
                            console.log(err)
                        }
                        inventories.push(EvacuationInventory.parse(object))
                    });
                    var message = new Message()
                    message.data = inventories[0]
                    resolve(message)
                }).catch(function (error) {
                    reject(error)
                });
        })
    } //getInventories

    /** adds inventory uses
     * @param inventory - inventory to be updated to the database
     * @method UserHandler.addEntry()
     */
    addInventory(inventory = new EvacuationInventory()) {
        return this.addEntry(inventory.id, inventory.toObject(), UserHandler.tables.evacuation_inventory)
    } //getInventories

    /**
     * deletes inventory from the database
     * @param id - inventory id to be deleted
     * @method UserHandler.deleteEntry()
     */
    deleteInventory(id) {
        return new Promise((resolve, reject) => {
            this.deleteEntry(id, UserHandler.tables.evacuation_inventory)
            .then((value) => {
                console.log("inventory deleted")
                return this.deleteSuppliesOfInventory(id)
            }).then((message) => {
                resolve(message)
            }).catch(err => {
                reject(err)
            })
        })
    }

    /** returns the supplies of the evacuation centers */
    getSupplies(inventory_ids = []) {
        return new Promise((resolve, reject) => {
            this.firestore.collection(UserHandler.tables.evacuation_supply)
                .where('inventory_id', 'in', inventory_ids)
                .get().then(function (querySnapshot) {
                    var supplies = []
                    querySnapshot.forEach(function (doc) {
                        let data = doc.data()
                        let id = doc.id

                        let object = {
                            id,
                            ...data
                        }
                        supplies.push(EvacuationSupply.parse(object))
                    });

                    const _supplies = inventory_ids.map((inventory_id) => {
                        const filtered_supplies = supplies.filter((supply) => {
                            return supply.inventory_id == inventory_id
                        })
                        return {
                            inventory_id,
                            supplies: filtered_supplies
                        }
                    })

                    var message = new Message()
                    message.data = _supplies

                    resolve(message)
                }).catch(function (error) {
                    reject(error)
                });
        })
    }

    /** adds supply
     * @param inventory - inventory to be updated to the database
     * @method UserHandler.addEntry()
     */
    addSupply(params = new EvacuationSupply()) {
        return this.addEntry(params.id, params.toObject(), UserHandler.tables.evacuation_supply)
    } //getInventories

    /**
     * deletes supply from the database
     * @param id - inventory id to be deleted
     * @method UserHandler.deleteEntry()
     */
    deleteSupply(id) {
        return this.deleteEntry(id, UserHandler.tables.evacuation_supply)
    }

    /**
     * deletes all inventory
     * @param id - delete supplies of the the inventory
     */
    deleteSuppliesOfInventory(id) {
        var message = new Message()

        return new Promise((resolve, reject) => {
            this.firestore.collection(UserHandler.tables.evacuation_supply)
                .where('inventory_id', '==', id).get()
                .then((querySnapshot) => {
                    // Once we get the results, begin a batch
                    var batch = this.firestore.batch();

                    querySnapshot.forEach(function (doc) {
                        // For each doc, add a delete operation to the batch
                        batch.delete(doc.ref);
                    });

                    // Commit the batch
                    return batch.commit();
                }).then((value) => {
                    message.data = value
                }).catch((error) => {
                    message.error = error
                    reject(message)
                }).finally(() => {
                    resolve(message)
                });
        })
    }


    getSupplyTypes() {
        return new Promise((resolve, reject) => {
            this.firestore.collection(UserHandler.tables.supply_types)
                .get().then(function (querySnapshot) {
                    var supplytypes = []
                    querySnapshot.forEach(function (doc) {
                        let data = doc.data()
                        let id = doc.id

                        let object = {
                            id,
                            ...data
                        }
                        supplytypes.push(EvacuationSupplyType.parse(object))
                    });
                    var message = new Message()
                    message.data = supplytypes
                    resolve(message)
                }).catch(function (error) {
                    reject(error)
                });
        })
    }

    /** adds `SUPPLY TYPE`
     * @param inventory - inventory to be updated to the database
     * @method UserHandler.addEntry()
     */
    addSupplyType(params = new EvacuationSupplyType()) {
        return this.addEntry(params.id, params.toObject(), UserHandler.tables.supply_types)
    } //getInventories

    /**
     * deletes `SUPPLY TYPE` from the database
     * @param id - inventory id to be deleted
     * @method UserHandler.deleteEntry()
     */
    deleteSupplyType(id) {
        return this.deleteEntry(id, UserHandler.tables.supply_types)
    }

}

class MunicipalInventoryHandler extends InventoryHandler {

    /** returns the inventories of the evacuation centers */
    getMunicipalInventories(municipality = "") {
        return new Promise((resolve, reject) => {
            var ref = this.firestore.collection(UserHandler.tables.municipal_inventory)
            if (municipality != "admin") {
                ref = ref.where('municipality', '==', municipality)
            }

            ref.get().then(function (querySnapshot) {
                var inventories = []
                querySnapshot.forEach(function (doc) {
                    let data = doc.data()
                    let id = doc.id

                    let object = {
                        id,
                        ...data
                    }
                    try {
                        object.date_created = object.date_created.toDate()
                    } catch (err) {
                        console.log(err)
                    }
                    inventories.push(MunicipalInventory.parse(object))
                });
                var message = new Message()
                message.data = inventories
                resolve(message)
            }).catch(function (error) {
                reject(error)
            });
        })
    } //getInventories

    /** returns the inventories of the evacuation centers */
    getMunicipalInventory(id) {
        return new Promise((resolve, reject) => {
            this.firestore.collection(UserHandler.tables.municipal_inventory)
                .where('id', '==', id)
                .get().then(function (querySnapshot) {
                    var inventories = []
                    querySnapshot.forEach(function (doc) {
                        let data = doc.data()
                        let id = doc.id

                        let object = {
                            id,
                            ...data
                        }
                        try {
                            object.date_created = object.date_created.toDate()
                        } catch (err) {
                            console.log(err)
                        }
                        inventories.push(MunicipalInventory.parse(object))
                    });
                    var message = new Message()
                    message.data = inventories[0]
                    resolve(message)
                }).catch(function (error) {
                    reject(error)
                });
        })
    } //getInventories

    /** adds inventory uses
     * @param inventory - inventory to be updated to the database
     * @method UserHandler.addEntry()
     */
    addMunicipalInventory(inventory = new MunicipalInventory()) {
        return this.addEntry(inventory.id, inventory.toObject(), UserHandler.tables.municipal_inventory)
    } //getInventories

    /**
     * deletes inventory from the database
     * @param id - inventory id to be deleted
     * @method UserHandler.deleteEntry()
     */
    deleteMunicipalInventory(id) {
        return new Promise((resolve, reject) => {
            this.deleteEntry(id, UserHandler.tables.municipal_inventory)
            .then((value) => {
                console.log("inventory deleted")
                return this.deleteSuppliesOfInventory(id)
            }).then((message) => {
                resolve(message)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

/**
 * class for handling storage and database fetch
 */
class DataHandlerClass extends MunicipalInventoryHandler {

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

} //DataHandlerClass

let DataHandler = new DataHandlerClass()