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
        public_user: 'public_user',
        public_user_history: 'public_user_history',
        public_user_report: 'public_user_report',
        donor_organization: 'donor_org',
        donor_individual: 'donor_individual',
        public_document: 'public_document',
        public_content: 'public_content',
        public_events: 'public_events',
        public_information: 'public_information',
        public_images: 'public_images',
        donor_reports: 'donor_reports'
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
                        object.date_created = object.date_created.toDate()
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        console.log(err)
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
                    try {
                        object.date_created = object.date_created.toDate()
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        console.log(err)
                    }
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
    
    addAdminUsers(params = new AdminUser(), images = []) {
        if (images.length > 0) {
            return this.uploadImages(images).then((resp) => {
                console.log("response %o", resp)
                return resp.json()
            }).then((images) => {
                params.images = images || []
                return this.addEntry(params.id, params.toObject(), UserHandler.tables.admin_user)
            })
        } else {
            return this.addEntry(params.id, params.toObject(), UserHandler.tables.admin_user)
        }
        
    } //addAdminUsers
    
    
    deleteAdminUsers(params) {
        this.deleteImages(params.images).then((val) => {
            console.log("deleted successfuly %o", val)
        })
        return this.deleteEntry(params.id, UserHandler.tables.admin_user)
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
    
    /** upload image files to server */
    uploadImages(images = []) {
        console.log("images to upload %o", images)
        const formData = new FormData();
        images.forEach((image) => {
            formData.append('files[]', image)
        })
        
        //wil return the array of the path of images
        return fetch(DataHandlerType.api_host + 'fileupload.php', {
            method: 'POST',
            body:   formData,
        })
    }//uploadImages
    
    /** deletes all the images from the array */
    deleteImages(images = []){
        console.log("images to delete %o", images)
        
        //wil return the array of the path of images
        let promises = images.map((image) => {
            return fetch(DataHandlerType.api_host + 'deletefiles.php?filename='+encodeURI(image))
        })
        return Promise.all(promises)
    }
    
    /**
    *  returns a promise that resolves the query
    * @param objecttype - defines the class which the promise will return
    * @param table - determines the table that the query is pointing to
    * @param offset 
    * * start of the query index 
    * * default = `0`
    * @param limit  
    * * the limit of the query to get
    * * default = `Infinity`
    * @param where
    * * the query to filter to
    * @param orderBy
    * * the order of data to be displayed
    *  */
    getObjects(objecttype, table,  where = null, orderBy = ['date_created','desc'], offset = 0, limit = 100) {
        
        var ref = this.firestore.collection(table)
        
        if (where) {
            ref = ref.where(...where)
        }
        
        ref = ref.orderBy(...orderBy).startAt(offset).limit(limit)
        
        return new Promise((resolve, reject) => {
            
            ref.get().then(function (querySnapshot) {
                var donors = []
                querySnapshot.forEach(function (doc) {
                    let data = doc.data()
                    let id = doc.id
                    
                    let object = {
                        id,
                        ...data
                    }
                    try {
                        object.date_created = object.date_created.toDate()
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        //console.log(err)
                    }
                    donors.push(objecttype.parse(object))
                });
                var message = new Message()
                message.data = donors
                resolve(message)
            }).catch(function (error) {
                reject(error)
            });
        })
    } //getDonorOrganizations
    
} //UserHandler

/** class functions handles public user data */
class PublicUserHandler extends UserHandler {
    /* <------------ USER --------------*/
    /** gets user from the database */
    getPublicUsers(municipality, id = "") {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.public_user)
            var query = ref
            if (municipality && !municipality.trim().isEmpty() && municipality != 0) {
                query = ref.where('municipality', '==', municipality)
            } else if (!id.trim().isEmpty()) {
                query = ref.where('id', '==', id)
            }
        
            query.get().then(function (querySnapshot) {
                var users = []
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id, " => ", doc.data());
                    let data = doc.data()
                    let id = doc.id
                    var object = {
                        id,
                        ...data
                    }
                    try {
                        object.date_created = object.date_created.toDate()
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        console.log(err)
                    }
                    users.push(PublicUser.parse(object))
                });
                
                var message = new Message()
                
                if (!id.isEmpty()) {
                    message.data = users[0]
                } else {
                    message.data = users
                }
                
                resolve(message)
            }).catch(function (error) {
                console.log("Error getting documents: ", error);
                reject(error)
            });
        })
    } //getUsers
    
    addPublicUser(params = new PublicUser()) {
        return new Promise((resolve, reject) => {
            var ref = this.firestore.collection(UserHandler.tables.public_user)
            ref.where('username','==',params.username)
            .get().then(function (querySnapshot) {
                var users = []
                querySnapshot.forEach(function (doc) {
                    let data = doc.data()
                    let id = doc.id
                    
                    let object = {
                        id,
                        ...data
                    }
                    try {
                        object.date_created = object.date_created.toDate()
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        //console.log(err)
                    }
                    users.push(PublicUser.parse(object))
                });
                let _users = users.filter((user) => {
                    return user.id != params.id
                })
                
                if (_users.length > 0) {
                    //throw "Username was already taken"    
                    //reject("Username was already taken")
                    let message = new Message()
                    message.error = "Username was already taken"
                    resolve(message)
                } else {
                    return DataHandler.addEntry(params.id, params.toObject(), UserHandler.tables.public_user)
                }
            }).then((data) => {
                resolve(data)
            }).catch(function (error) {
                reject(error)
            });
        })
        //return this.addEntry(params.id, params.toObject, UserHandler.tables.public_user)
    } //addPublicUsers
    
    /** as long as save user doesnt change username or password */
    savePublicUser(params = new PublicUser()) {
        return DataHandler.addEntry(params.id, params.toObject(), UserHandler.tables.public_user)
    } //addPublicUsers
    
    deletePublicUser(id) {
        return this.deleteEntry(id, UserHandler.tables.public_user)
    } //deleteAdminUsers
    /* ------------ USER -------------->*/

    /** returns the public history of the user or general if given empty id */
    getPublicUserHistory(id) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.public_user_history)
            //const query = (municipality != "0") ? ref.where('municipality', '==', municipality) : ref
            var query = (id && !id.isEmpty()) ? ref.where('user_id','==', id) : ref
            
            query = query.orderBy('date_admitted', 'desc')

            query.get().then(function (querySnapshot) {
                var history = []
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id, " => ", doc.data());
                    let data = doc.data()
                    let id = doc.id
                    var object = {
                        id,
                        ...data
                    }

                
                    
                    Object.keys(object).filter((key) => {
                        return key.includes('date')
                    }).forEach((key) => {
                        try {
                            object[key] = object[key].toDate()
                        } catch (err) {
                            console.log(err)
                        }
                    })

                    

                    /* try {
                        object.date_created = object.date_created.toDate()
                        object.date_updated = object.date_updated.toDate()
                        object.date_admitted = object.date_admitted.toDate()
                        object.date_cleared = object.date_cleared.toDate()
                    } catch (err) {
                        console.log(err)
                    } */
                    history.push(PublicUserHistory.parse(object))
                });
                var message = new Message()
                message.data = history
                resolve(message)
            }).catch(function (error) {
                console.log("Error getting documents: ", error);
                reject(error)
            });
        })
    }//getPublicUserHistory

    

    addPublicUserHistory(params = new PublicUserHistory) {
        return this.addEntry(params.id, params.toObject(), UserHandler.tables.public_user_history)
    }

    deletePublicUserHistory(id) {
        return this.deleteEntry(id, UserHandler.tables.public_user_history)
    }


    /** returns the public history of the user or general if given empty id */
    getPublicUserReports(user_id) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.public_user_report)
            //const query = (municipality != "0") ? ref.where('municipality', '==', municipality) : ref
            var query = (user_id && !user_id.isEmpty()) ? ref.where('user_id','==', user_id) : ref
            
            query = query.orderBy('date_updated', 'desc')

            query.get().then(function (querySnapshot) {
                var reports = []
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id, " => ", doc.data());
                    let data = doc.data()
                    let id = doc.id
                    var object = {
                        id,
                        ...data
                    }
                    try {
                        object.date_created = object.date_created.toDate()
                    } catch (err) {
                        console.log(err)
                    }
                    try {
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        console.log(err)
                    }
                    reports.push(PublicUserReport.parse(object))
                });
                var message = new Message()
                message.data = reports
                resolve(message)
            }).catch(function (error) {
                console.log("Error getting documents: ", error);
                reject(error)
            });
        })
    }//getPublicUserReports

    addPublicUserReport(params = new PublicUserReport) {
        return this.addEntry(params.id, params.toObject(), UserHandler.tables.public_user_report)
    }

    deletePublicUserReport(id) {
        return this.deleteEntry(id, UserHandler.tables.public_user_report)
    }

}//PublicUserHandler

/** class functions handles evacuation center data */
class EvacuationHandler extends PublicUserHandler {
    
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
                    try {
                        object.date_created = object.date_created.toDate()
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        //console.log(err)
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
    
    /** overrides images */
    addEvacationCenter(params = new EvacuationCenter(), images = []) {
        if (images.length > 0) {
            return this.uploadImages(images).then((resp) => {
                console.log("response %o", resp)
                return resp.json()
            }).then((new_images) => {
                params.images = params.images || []
                param.images  = params.images.concat(new_images)
                return this.addEntry(params.id, params.toObject(), UserHandler.tables.evacuation_centers)
            })
        } else {
            return this.addEntry(params.id, params.toObject(), UserHandler.tables.evacuation_centers)
        }
        /* return new Promise((resolve, reject) => {
            this.firestore.collection('evacuation_centers')
            .doc(params.id)
            .set(params.toObject())
            .then(function () {
                resolve("Document successfully written!")
            }).catch(function (error) {
                reject(error)
            });
        }) */
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
                        ...data
                    }
                    try {
                        object.date_created = object.date_created.toDate()
                        object.date_updated = object.date_updated.toDate()
                        object.report_date  = object.report_date.toDate()
                    } catch (err) {
                        //console.log(err)
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
                    try {
                        object.date_created = object.date_created.toDate()
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        //console.log(err)
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
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        //console.log(err)
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
                        object.date_updated = object.date_updated.toDate()
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
                    try {
                        object.date_created = object.date_created.toDate()
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        //console.log(err)
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
                    try {
                        object.date_created = object.date_created.toDate()
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        //console.log(err)
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
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        //console.log(err)
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
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        //console.log(err)
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

class DonorHandler extends MunicipalInventoryHandler {
    
    /** returns the inventories of the evacuation centers */
    getDonorOrganizations(id) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.donor_organization)
            const query = (id && !id.isEmpty()) ? ref.where('id','==', id) : ref

            query.get().then(function (querySnapshot) {
                var donors = []
                querySnapshot.forEach(function (doc) {
                    let data = doc.data()
                    let id = doc.id
                    
                    let object = {
                        id,
                        ...data
                    }
                    try {
                        object.date_created = object.date_created.toDate()
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        //console.log(err)
                    }
                    donors.push(DonorsOrganization.parse(object))
                });
                var message = new Message()
                if (id && !id.isEmpty()) {
                    message.data = donors[0]
                } else {
                    message.data = donors
                }
                resolve(message)
            }).catch(function (error) {
                reject(error)
            });
        })
    } //getDonorOrganizations
    
    /** returns the inventories of the evacuation centers */
    getDonorIndividual(id) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.donor_individual)
            const query = (id && !id.isEmpty()) ? ref.where('id','==', id) : ref

            query.get().then(function (querySnapshot) {
                var donors = []
                querySnapshot.forEach(function (doc) {
                    let data = doc.data()
                    let id = doc.id
                    
                    let object = {
                        id,
                        ...data
                    }
                    try {
                        object.date_created = object.date_created.toDate()
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        //console.log(err)
                    }
                    donors.push(DonorsIndividual.parse(object))
                });
                var message = new Message()
                if (id && !id.isEmpty()) {
                    message.data = donors[0]
                } else {
                    message.data = donors
                }
                resolve(message)
            }).catch(function (error) {
                reject(error)
            });
        })
    } //getDonorOrganizations
    
    /** adds `DONOR ORG` or `DONOR INDV` from the database
    * @param params - entry to be updated to the database
    * @method UserHandler.addEntry()
    */
    addDonor(params, isOrg = true) {
        return this.addEntry(params.id, params.toObject(), isOrg ? UserHandler.tables.donor_organization : UserHandler.tables.donor_individual )
    } //getInventories
    
    /**
    * deletes `DONOR ORG` or `DONOR INDV` from the database
    * @param id - entry id to be deleted
    * @method UserHandler.deleteEntry()
    */
    deleteDonor(id, isOrg = true) {
        return this.deleteEntry(id, isOrg ? UserHandler.tables.donor_organization : UserHandler.tables.donor_individual )
    }

    /** returns the public history of the user or general if given empty id */
    getDonorReports(user_id) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.donor_reports)
            //const query = (municipality != "0") ? ref.where('municipality', '==', municipality) : ref
            var query = (user_id && !user_id.isEmpty()) ? ref.where('user_id','==', user_id) : ref
            
            query = query.orderBy('date_updated', 'desc')

            query.get().then(function (querySnapshot) {
                var reports = []
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id, " => ", doc.data());
                    let data = doc.data()
                    let id = doc.id
                    var object = {
                        id,
                        ...data
                    }
                    try {
                        object.date_created = object.date_created.toDate()
                    } catch (err) {
                        console.log(err)
                    }
                    try {
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        console.log(err)
                    }
                    reports.push(DonorsReport.parse(object))
                });
                var message = new Message()
                message.data = reports
                resolve(message)
            }).catch(function (error) {
                console.log("Error getting documents: ", error);
                reject(error)
            });
        })
    }//getPublicUserReports

    addDonorsReport(params = new DonorsReport) {
        return this.addEntry(params.id, params.toObject(), UserHandler.tables.donor_reports)
    }

    deleteDonorsReport(id) {
        return this.deleteEntry(id, UserHandler.tables.donor_reports)
    }
}//DonorHandler


/** defines the class that contains all public web files and contents */
class PublicWebHandler extends DonorHandler {
    
    /* ---------- CONTENT ------------------- */
    /**
    * gets the entries from the database
    * @param {*} id 
    * * id of the document to retrive
    * * default to `null`
    * @param {*} type 
    * * object type to be converted to
    * * default to `PublicContent`
    * @param {*} table 
    * * table to refer to on the db
    * * default `UserHandler.tables.public_content`
    * @returns {*} `Promise<Message>`
    */
    getContentPost(id = null, type = PublicContent, table = UserHandler.tables.public_content) {
        //const type = PublicContent
        const ref =  this.firestore.collection(table)
        return new Promise((resolve, reject) => {
            const doc = id != null ? ref.where('id','==', id) : ref.orderBy('date_updated', 'desc')
            doc.get().then(function (querySnapshot) {
                var entries = []
                querySnapshot.forEach(function (doc) {
                    let data = doc.data()
                    let id = doc.id
                    
                    let object = {
                        id,
                        ...data
                    }
                    try {
                        object.date_created = object.date_created.toDate()
                        object.date_updated = object.date_updated.toDate()
                    } catch (err) {
                        //console.log(err)
                    }
                    entries.push(type.parse(object))
                });
                var message = new Message()
                message.data = entries
                resolve(message)
            }).catch(function (error) {
                reject(error)
            });
        })
        //eturn this.getObjects(PublicContent, UserHandler.tables.public_content, id ? ['id', '==', id] : null)
    }
    
    /**
    * saves content entry on the database
    * @param {*} params - object to be saved
    * @param {*} file - images to be uploaded
    */
    addPublicPost(params, file, table = UserHandler.tables.public_content) {
        //return this.addPublicEntry(params, images, UserHandler.tables.public_content)
        return this.uploadImages([file]).then((resp) => {
            console.log("response %o", resp)
            return resp.json()
        }).then((file_path) => {
            console.log("filepath %o", file_path)
            params.path = file_path[0]
            return this.addEntry(params.id, params.toObject(), table)
        })
    }//addPublicPost
    
    /** gets the text content from the server file */
    getPublicPostContent(path){
        let filePath = DataHandlerType.api_host+`getfile.php?path=${path}`
        console.log("hello? %o", filePath)
        
        return fetch(filePath)
        .then(response => {
            return response.text()
        }).catch(err =>{
            console.log(err)
        })
    }//getPublicPostContent
    
    /**
    * deletes the content entry on the databse
    * @param {*} params - object to be delete
    */
    deletePublicPost(params, table = UserHandler.tables.public_content) {
        this.deleteImages([params.path]).then((val) => {
            console.log("deleted successfuly %o", val)
        }).catch(err =>{
            console.log(err)
        })
        return this.deleteEntry(params.id, table)
    }//deletePublicPost
    
    /* ------------------ EVENTS -------------------- */
    
    /** returns list of events sorted by date_event desc*/
    getPublicEvents(id = null) {
        //const type = PublicContent
        const ref =  this.firestore.collection(UserHandler.tables.public_events)
        return new Promise((resolve, reject) => {
            const doc = id != null ? ref.where('id','==',id) : ref
            doc.orderBy('date_start','desc').get().then(function (querySnapshot) {
                var donors = []
                querySnapshot.forEach(function (doc) {
                    let data = doc.data()
                    let id = doc.id
                    
                    let object = {
                        id,
                        ...data
                    }
                    try {
                        object.date_created = object.date_created.toDate()
                        object.date_updated = object.date_updated.toDate()
                        object.date_start   = object.date_start.toDate()
                        object.date_end     = object.date_end.toDate()
                    } catch (err) {
                        //console.log(err)
                    }
                    donors.push(PublicEvent.parse(object))
                });
                var message = new Message()
                message.data = donors
                resolve(message)
            }).catch(function (error) {
                reject(error)
            });
        })
    }//getPublicEvents
    
    /** adds the event to the db */
    addPublicEvent(params) {
        return this.addEntry(params.id, params.toObject(), UserHandler.tables.public_events)
    }
    
    /** deletes the event from the db */
    deletePublicEvent(id) {
        return this.deleteEntry(id, UserHandler.tables.public_events)
    }
    
    /* -------------- DOCUMENTS --------------------- */
    
    /** returns list of events sorted by date_event desc*/
    getPublicDocuments(id = null) {
        return this.getContentPost(id, PublicDocument, UserHandler.tables.public_document)
    }//getPublicDocuments
    
    /** saves the document to the server and the db */
    addPublicDocument(params, file = null) {
        if (file) {
            return this.addPublicPost(params, file, UserHandler.tables.public_document)
        } else {
            return this.addEntry(params.id, params.toObject(), UserHandler.tables.public_document)
        }
    }//addPublicDocument
    
    /** deletes the document from the server and the db */
    deletePublicDocument(params) {
        return this.deletePublicPost(params, UserHandler.tables.public_document)
    }//deletePublicDocument
    
    /* ------------- OTHER INFORMATION --------------- */
    
    /** gets content information from database */
    getPublicInformation(id = null){
        return this.getContentPost(id, PublicInformation, UserHandler.tables.public_information)
    }//getContentInformation
    
    /** saves the document to the server and the db */
    addPublicInformation(params, file = null) {
        if (file) {
            return this.addPublicPost(params, file, UserHandler.tables.public_information)
        } else {
            return this.addEntry(params.id, params.toObject(), UserHandler.tables.public_information)
        }
    }//addPublicInformation
    
    /** deletes the document from the server and the db */
    deletePublicInformation(params) {
        return this.deletePublicPost(params, UserHandler.tables.public_information)
    }//deletePublicInformation
    
    /* ------------- IMAGES ----------------------- */
    
    getPublicImages(id = null){
        return this.getContentPost(id, PublicGallery, UserHandler.tables.public_images)
    }//getPublicImages
    
    addPublicImages(params, images = []) {
        if (images.length > 0) {
            return this.uploadImages(images).then((resp) => {
                console.log("response %o", resp)
                return resp.json()
            }).then((image_paths) => {
                console.log("filepath %o", image_paths)
                params.image = params.image || []
                params.images = params.images.concat(image_paths || [])
                return this.addEntry(params.id, params.toObject(), UserHandler.tables.public_images)
            })
        } else {
            return this.addEntry(params.id, params.toObject(), UserHandler.tables.public_images)
        }
    }//addPublicImages
    
    deletePublicImages(params) {
        this.deleteImages(params.images = []).then((val) => {
            console.log("deleted successfuly %o", val)
        }).catch(err =>{
            console.log(err)
        })
        return this.deleteEntry(params.id, table)
    }//deletePublicImages
    
}//PublicWebHandler



/**
* class for handling storage and database fetch
*/
class DataHandlerClass extends PublicWebHandler {
    
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