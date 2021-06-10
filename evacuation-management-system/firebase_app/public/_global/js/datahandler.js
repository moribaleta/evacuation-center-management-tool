/** class functions handles user actions */
class UserHandler extends DataHandlerType {

    /** static enum contains all database table */
    static tables = {
        admin_user: 'admin_user',
        evacuation_centers: 'evacuation_centers',
        evacuation_center_type: 'evacuation_center_type',
        evacuation_history: 'evacuation_history',
        evacuation_inventory: 'evacuation_inventory',
        evacuation_supply: 'evacuation_supply',
        municipal_inventory: 'municipal_inventory',
        supply_types: 'supply_types',
        moabc: 'moabc',
        users: 'users',
        public_user: 'public_user',
        public_comment: 'public_comment',
        public_user_history: 'public_user_history',
        public_user_report: 'public_user_report',
        donor_organization: 'donor_org',
        donor_individual: 'donor_individual',
        public_document: 'public_document',
        public_content: 'public_content',
        public_events: 'public_events',
        public_item_supply: 'public_item_supply',
        public_information: 'public_information',
        public_images: 'public_images',
        donor_reports: 'donor_reports'
    }

    /** formats object's date */
    parseDate(object = {}) {
        Object.keys(object).filter((key) => {
            return key.includes('date')
        }).forEach((key) => {
            try {
                object[key] = object[key].toDate()
            } catch (err) {
                console.log(err)
            }
        })
        return object
    }

    /** login function */
    login(username, password) {
        this.configure()
        return new Promise((resolve, reject) => {
            console.log(username + "--" + password)
            let ref = validateEmail(username) ? "email" : "username"

            this.firestore.collection('admin_user')
                .where(ref, "==", username)
                .where("password", "==", password)
                .get().then(function (querySnapshot) {
                    var users = []
                    querySnapshot.forEach(function (doc) {
                        console.log(doc.id, " => ", doc.data());
                        let data = doc.data()
                        let id = doc.id

                        const object = parseObject({
                            id,
                            ...data
                        })
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
                .get().then((querySnapshot) => {
                    var users = []
                    querySnapshot.forEach(function (doc) {
                        console.log(doc.id, " => ", doc.data());
                        let data = doc.data()
                        let id = doc.id
                        const object = parseObject({
                            id,
                            ...data
                        })
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

    /**
     * used to get a single admin by id
     * @param {*} userid - admin id to select
     */
    getAdminById(userid = "") {
        return new Promise((resolve, reject) => {

            if (userid.isEmpty()) {
                var message = new Message()
                message.error = "No ID passed"
                reject(message)
                return
            }

            this.firestore.collection('admin_user')
                .where('id', '==', userid)
                .get().then((querySnapshot) => {
                    var users
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id, " => ", doc.data());
                        let data = doc.data()
                        let id = doc.id
                        const object = parseObject({
                            id,
                            ...data
                        })
                        //users.push(AdminUser.parse(object))
                        users = AdminUser.parse(object)
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
    } //getAdminById

    getAdminUserMunicipality(municipality) {
        return new Promise((resolve, reject) => {
            this.firestore.collection('admin_user')
                .where('municipality', '==', municipality)
                .get().then(function (querySnapshot) {
                    var users = []
                    querySnapshot.forEach(function (doc) {
                        console.log(doc.id, " => ", doc.data());
                        let data = doc.data()
                        let id = doc.id
                        const object = parseObject({
                            id,
                            ...data
                        })
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
    }

    getAdminEvacuationManagerMunicipality(municipality) {
        return new Promise((resolve, reject) => {
            var ref = this.firestore.collection('admin_user')

            if (municipality && municipality != "") {
                ref = ref.where('municipality', '==', municipality)
            }

            ref.where('admin_type', '==', AdminUser.AdminTypes.evacuation)
                .get().then((querySnapshot) => {
                    var users = []
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id, " => ", doc.data());
                        let data = doc.data()
                        let id = doc.id
                        const object = parseObject({
                            id,
                            ...data
                        })
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
    }

    addAdminUsers(params = new AdminUser(), images = []) {
        console.log(params)
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
                .then(() => {
                    message.data = "success delete"
                    resolve(message);
                }).catch((error) => {
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
            body: formData,
        })
    } //uploadImages

    /** deletes all the images from the array */
    deleteImages(images = []) {
        console.log("images to delete %o", images)

        //wil return the array of the path of images
        let promises = images.map((image) => {
            return fetch(DataHandlerType.api_host + 'deletefiles.php?filename=' + encodeURI(image))
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
    getObjects(objecttype, table, where = null, orderBy = ['date_created', 'desc'], limit = 100) {

        var ref = this.firestore.collection(table)

        if (where) {
            ref = ref.where(...where)
        }

        ref = ref.orderBy(...orderBy).limit(limit)

        return new Promise((resolve, reject) => {

            ref.get().then(function (querySnapshot) {
                var donors = []
                querySnapshot.forEach(function (doc) {
                    let data = doc.data()
                    let id = doc.id

                    /* let object = {
                        id,
                        ...data
                    } */
                    /* Object.keys(object).filter((key) => {
                        return key.includes('date')
                    }).forEach((key) => {
                        try {
                            object[key] = object[key].toDate()
                        } catch (err) {
                            console.log(err)
                        }
                    }) */
                    let object = parseObject({
                        id,
                        ...data
                    })
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

            query.get().then((querySnapshot) => {
                var users = []
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id, " => ", doc.data());
                    let data = doc.data()
                    let id = doc.id
                    const object = parseObject({
                        id,
                        ...data
                    })
                    users.push(PublicUser.parse(object))
                });

                var message = new Message()

                if (!id.isEmpty()) {
                    message.data = users[0]
                } else {
                    message.data = users
                }

                resolve(message)
            }).catch((error) => {
                console.log("Error getting documents: ", error);
                reject(error)
            });
        })
    } //getUsers

     /** gets user from the database */
     getAllPublicUsers(isPending = false) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.public_user)
            var query = ref
            
            query.get().then((querySnapshot) => {
                var users = []
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id, " => ", doc.data());
                    let data = doc.data()
                    let id = doc.id
                    const object = parseObject({
                        id,
                        ...data
                    })
                    users.push(PublicUser.parse(object))
                });

                var message = new Message()

                if (isPending) {
                    message.data = users.filter((user) => {
                        return user.status == StatusType.pending
                    })
                } else {
                    message.data = users
                }

                
                resolve(message)
            }).catch((error) => {
                console.log("Error getting documents: ", error);
                reject(error)
            });
        })
    } //getUsers

    addPublicUser(params = new PublicUser()) {
        return new Promise((resolve, reject) => {
            var ref = this.firestore.collection(UserHandler.tables.public_user)
            ref.where('username', '==', params.username)
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

    loginPublicUser(username, password) {
        return new Promise((resolve, reject) => {
            console.log(username + "--" + password)
            this.firestore.collection(UserHandler.tables.public_user)
                .where("username", "==", username)
                .where("password", "==", password)
                .get().then(function (querySnapshot) {
                    var users = []
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id, " => ", doc.data());
                        let data = doc.data()
                        let id = doc.id
                        let object = parseObject({
                            id,
                            ...data
                        })
                        users.push(PublicUser.parse(object))
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
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                    reject(error)
                });
        })
    } //login

    /** returns the public history of the user or general if given empty id */
    getPublicUserHistory(id) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.public_user_history)
            //const query = (municipality != "0") ? ref.where('municipality', '==', municipality) : ref
            var query = (id && !id.isEmpty()) ? ref.where('user_id', '==', id) : ref

            query = query.orderBy('date_admitted', 'desc')

            query.get().then(function (querySnapshot) {
                var history = []
                querySnapshot.forEach(function (doc) {
                    let data = doc.data()
                    let id = doc.id
                    const object = parseObject({
                        id,
                        ...data
                    })
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
    } //getPublicUserHistory

    /** returns the public history of the user or general if given empty id */
    getPublicUserHistoryByEvac(evac_id) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.public_user_history)
            //const query = (municipality != "0") ? ref.where('municipality', '==', municipality) : ref
            var query = (evac_id && !evac_id.isEmpty()) ? ref.where('evac_id', '==', evac_id) : ref

            query = query.orderBy('date_admitted', 'desc')

            query.get().then(function (querySnapshot) {
                var history = []
                querySnapshot.forEach(function (doc) {
                    let data = doc.data()
                    let id = doc.id
                    const object = parseObject({
                        id,
                        ...data
                    })
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
    } //getPublicUserHistory

    /** returns the public history of the user or general if given empty id */
    getActivePublicUserHistory(municipality, approved = false) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.public_user_history)
            var query = ref

            if (municipality && !municipality.trim().isEmpty() && municipality != 0) {
                query = query.where('municipality', '==', municipality)
            }

            //checks if the public user is not yet cleared
            query = query.where('date_cleared', '==', '')

            if (approved) {
                query = query.where('status', '==', StatusType.approved)
            }

            query = query.orderBy('date_admitted', 'desc')


            query.get().then(function (querySnapshot) {
                var history = []
                querySnapshot.forEach(function (doc) {
                    let data = doc.data()
                    let id = doc.id
                    const object = parseObject({
                        id,
                        ...data
                    })
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
    } //getPublicUserHistory


    /** returns the public history of the user or general if given empty id */
    getActivePublicUserHistoryByEvac(evac_id, approved) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.public_user_history)
            var query = ref

            if (evac_id) {
                query = query.where('evac_id', '==', evac_id)
            } else {
                reject("no evacuation id provided")
                return
            }

            if (approved) {
                query = query.where('status', '==', StatusType.approved)
            }

            //checks if the public user is not yet cleared
            query = query.where('date_cleared', '==', '')
            query = query.orderBy('date_admitted', 'desc')


            query.get().then(function (querySnapshot) {
                var history = []
                querySnapshot.forEach(function (doc) {
                    let data = doc.data()
                    let id = doc.id
                    const object = parseObject({
                        id,
                        ...data
                    })
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
    } //getPublicUserHistory


    /**
     * returns the active population by evacuation center
     * ```
     * message.data = {
                    history : [],
                    users   : [],
                    evac_id
                }
     * ```
     * @param {*} evac_id 
     * @param {*} approved 
     * @returns 
     */
    getPublicActivePopulation(approved) {

        let promiseEvac = ((id, evac_id) => {
            return new Promise((resolve, reject) => {
                const ref = this.firestore.collection(UserHandler.tables.public_user)
                var query = ref.where('id', '==', id)

                query.get().then((querySnapshot) => {
                    var users = []
                    querySnapshot.forEach(function (doc) {
                        console.log(doc.id, " => ", doc.data());
                        let data = doc.data()
                        let id = doc.id
                        const object = parseObject({
                            id,
                            ...data
                        })
                        users.push(PublicUser.parse(object))
                    });

                    var message = new Message()
                    message.data = {
                        user: users[0],
                        evac_id
                    }
                    resolve(message)
                }).catch((error) => {
                    console.log("Error getting documents: ", error);
                    reject(error)
                });
            })
        })

        return new Promise((resolve, reject) => {
            const history_ref = this.firestore.collection(UserHandler.tables.public_user_history)

            var history_query = history_ref

            //checks if the public user is not yet cleared
            history_query = history_query.where('date_cleared', '==', '')

            if (approved) {
                history_query = history_query.where('status', '==', StatusType.approved)
            }

            history_query = history_query.orderBy('date_admitted', 'desc')

            console.log("datahandler - get active history %o")

            history_query.get().then(function (querySnapshot) {
                var promises = []

                var final_message = new Message()

                final_message.data = {}

                querySnapshot.forEach((doc) => {
                    let data = doc.data()
                    let id = doc.id
                    const object = parseObject({
                        id,
                        ...data
                    })
                    let history = PublicUserHistory.parse(object)

                    final_message.data[history.evac_id] = final_message.data[history.evac_id] || {
                        users       : [],
                        history     : [],
                        count       : 0,
                        family      : 0,
                        independent: 0
                    }

                    final_message.data[history.evac_id].history.push(history)

                    promises.push(promiseEvac(history.user_id, history.evac_id))
                });

                Promise.all(promises).then((messages) => {
                    messages.map((message) => {
                        let user = message.data.user
                        let evac_id = message.data.evac_id
                        final_message.data[evac_id].users.push(user)
                        final_message.data[evac_id].count += (1 + (user.dependents.length))
                        if (user.dependents.length > 0) {
                            final_message.data[evac_id].family += 1
                        } else {
                            final_message.data[evac_id].independent += 1
                        }
                    })


                    resolve(final_message)
                }).catch((err) => {
                    throw err;
                })

            }).catch(function (error) {
                console.log("Error getting documents: ", error);
                reject(error)
            });
        })
    } //getPublicActivePopulationByEvac

    getActivePublicUserHistoryAllPopulation(municipality) {
        return new Promise((resolve, reject) => {

            const history_ref = this.firestore.collection(UserHandler.tables.public_user_history)
            const population_ref = this.firestore.collection(UserHandler.tables.public_user)

            var query_history = history_ref
            var query_population = population_ref

            if (municipality && !municipality.trim().isEmpty() && municipality != 0) {
                query_history = query_history.where('municipality', '==', municipality)
            }

            //checks if the public user is not yet cleared
            query_history = query_history.where('date_cleared', '==', '').where('status', '==', StatusType.approved)
            query_history = query_history.orderBy('date_admitted', 'desc')

            //query_population = query_population.where('id', '==', )

            query_history.get().then((query_historySnapshot) => {

                var history_dict = {
                    //user_id : { history, user }
                }

                var populationPromises = []

                query_historySnapshot.forEach((doc) => {
                    let data = doc.data()
                    let id = doc.id
                    const object = parseObject({
                        id,
                        ...data
                    })
                    let history = PublicUserHistory.parse(object)

                    history_dict[history.user_id] = {
                        history,
                    }

                    let population_promise = query_population.doc(history.user_id).get()
                        .then((doc) => {
                            if (doc.exists) {
                                let data = doc.data()
                                let id = doc.id
                                const object = parseObject({
                                    id,
                                    ...data
                                })
                                return PublicUser.parse(object)
                            } else {
                                console.log("No such document! -> " + history.user_id);
                                return null
                            }
                        })
                    populationPromises.push(population_promise)
                })

                Promise.all(populationPromises)
                    .then((users) => {
                        users
                            .map((user) => {
                                history_dict[user.id]['user'] = user
                            })
                        var message = new Message()
                        message.data = Object.keys(history_dict).map((key) => {
                            return history_dict[key]
                        })
                        resolve(message)
                    })

            }).catch(function (error) {
                console.log("Error getting documents: ", error);
                reject(error)
            });
        })
    }



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
            var query = (user_id && !user_id.isEmpty()) ? ref.where('user_id', '==', user_id) : ref

            query = query.orderBy('date_updated', 'desc')

            query.get().then(function (querySnapshot) {
                var reports = []
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id, " => ", doc.data());
                    let data = doc.data()
                    let id = doc.id
                    let object = parseObject({
                        id,
                        ...data
                    })
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
    } //getPublicUserReports

    addPublicUserReport(params = new PublicUserReport) {
        return this.addEntry(params.id, params.toObject(), UserHandler.tables.public_user_report)
    }

    deletePublicUserReport(id) {
        return this.deleteEntry(id, UserHandler.tables.public_user_report)
    }


    /** returns the public history of the user or general if given empty id */
    getPublicUserComments(users = []) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.public_comment)
            //const query z= (municipality != "0") ? ref.where('municipality', '==', municipality) : ref
            var query = !(users.isEmpty()) ? ref.where('user_id', 'array-contains-any', users) : ref

            query = query.orderBy('date_updated', 'desc')

            query.get().then(function (querySnapshot) {
                var reports = []
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id, " => ", doc.data());
                    let data = doc.data()
                    let id = doc.id
                    let object = parseObject({
                        id,
                        ...data
                    })
                    reports.push(PublicUserComment.parse(object))
                });
                var message = new Message()
                message.data = reports
                resolve(message)
            }).catch(function (error) {
                console.log("Error getting documents: ", error);
                reject(error)
            });
        })
    } //getPublicUserReports

    /** returns the public history of the user or general if given empty id */
    getPublicUserComments(user_id) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.public_comment)
            //const query z= (municipality != "0") ? ref.where('municipality', '==', municipality) : ref
            var query = (user_id && !user_id.isEmpty()) ? ref.where('user_id', '==', user_id) : ref

            query = query.orderBy('date_updated', 'asc')

            query.get().then(function (querySnapshot) {
                var reports = []
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id, " => ", doc.data());
                    let data = doc.data()
                    let id = doc.id
                    let object = parseObject({
                        id,
                        ...data
                    })
                    reports.push(PublicUserComment.parse(object))
                });
                var message = new Message()
                message.data = reports
                resolve(message)
            }).catch(function (error) {
                console.log("Error getting documents: ", error);
                reject(error)
            });
        })
    } //getPublicUserReports

    addPublicUserComment(params = new PublicUserComment) {
        return this.addEntry(params.id, params.toObject(), UserHandler.tables.public_comment)
    }

    deletePublicUserComment(id) {
        return this.deleteEntry(id, UserHandler.tables.public_comment)
    }



} //PublicUserHandler

/** class functions handles evacuation center data */
class EvacuationHandler extends PublicUserHandler {

    /*!--------- EVACUAITON CENTER ---------------!*/
    getEvacuationCenters(municipality = "") {
        return new Promise((resolve, reject) => {

            var ref = this.firestore.collection(UserHandler.tables.evacuation_centers)
            if (municipality != "0" && !municipality.isEmpty()) {
                ref = ref.where('municipality', '==', municipality)
            }

            ref.get().then(function (querySnapshot) {
                var evacuations = []
                querySnapshot.forEach(function (doc) {
                    //console.log(doc.id, " => ", doc.data());
                    const data = doc.data()
                    const id = doc.id
                    const object = parseObject({
                        id,
                        ...data
                    })

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

    ///gets the evacuation center by id
    getEvacuationById(id) {
        return new Promise((resolve, reject) => {

            var ref = this.firestore.collection(UserHandler.tables.evacuation_centers)

            ref = ref.where('id', '==', id)

            ref.get().then(function (querySnapshot) {
                var evacuations = []
                querySnapshot.forEach(function (doc) {
                    //console.log(doc.id, " => ", doc.data());
                    const data = doc.data()
                    const id = doc.id
                    const object = parseObject({
                        id,
                        ...data
                    })

                    evacuations.push(EvacuationCenter.parse(object))
                });

                var message = new Message()

                message.data = evacuations
                resolve(message)

            }).catch(function (error) {
                reject(error)
            });
        })
    } //getEvacuationById

    /** overrides images */
    addEvacationCenter(params = new EvacuationCenter(), images = []) {
        if (images.length > 0) {
            return this.uploadImages(images).then((resp) => {
                console.log("response %o", resp)
                return resp.json()
            }).then((new_images) => {
                params.images = params.images || []
                param.images = params.images.concat(new_images)
                return this.addEntry(params.id, params.toObject(), UserHandler.tables.evacuation_centers)
            })
        } else {
            return this.addEntry(params.id, params.toObject(), UserHandler.tables.evacuation_centers)
        }
    } //addEvacationCenter


    deleteEvacationCenter(id) {
        return this.deleteEntry(id, UserHandler.tables.evacuation_centers)
    } //deleteEvacationCenter

    /* !--------- EVACUATION CENTER TYPES -----------*/
    getEvacuationCenterType() {
        return new Promise((resolve, reject) => {
            this.firestore.collection(UserHandler.tables.evacuation_center_type)
                .get().then(function (querySnapshot) {
                    var types = []
                    querySnapshot.forEach(function (doc) {
                        //console.log(doc.id, " => ", doc.data());
                        const data = doc.data()
                        const id = doc.id
                        const object = parseObject({
                            id,
                            ...data
                        })

                        types.push(EvacuationCenterType.parse(object))
                    });
                    var message = new Message()
                    message.data = types
                    resolve(message)
                }).catch(function (error) {
                    reject(error)
                });
        })
    }

    addEvacationCenterType(params = new EvacuationCenterType()) {
        return this.addEntry(params.id, params.toObject(), UserHandler.tables.evacuation_center_type)
    }

    deleteEvacationCenterType(id) {
        return this.deleteEntry(id, UserHandler.tables.evacuation_center_type)
    }

    /*!--------- EVACUAITON HISTORY ---------------!*/

    /** returns history */
    getEvacuationHistory(evac_id = null) {
        let collection = this.firestore.collection(UserHandler.tables.evacuation_history)
        var ref = evac_id != null ? ref.where('evac_id', '==', evac_id) : collection

        ref = ref.orderBy("report_date", "desc") //.limit(limit)
        console.log("fetch history running %o", evac_id)
        return new Promise((resolve, reject) => {
            ref.get().then((querySnapshot) => {
                    var models = []
                    querySnapshot.forEach(function (doc) {
                        //console.log(doc.id, " => ", doc.data());
                        const data = doc.data()
                        const id = doc.id

                        const object = parseObject({
                            id,
                            ...data
                        })

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

    /** returns max count */
    getEvacuationHistoryMax() {
        return new Promise((resolve, reject) => {
            this.firestore.collection('evacuation_history').get().then((querySnapshot) => {
                console.log(querySnapshot.size);
                var message = new Message()
                message.data = querySnapshot.size
                resolve(message)
            }).catch((error) => {
                reject(error)
            })
        })
    } //getEvacuationHistoryMax


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

    addLargeEvacuationHistory(params = []) {
        return new Promise((resolve, reject) => {
            var db = this.firestore
            var batch = db.batch();

            params.forEach((doc) => {
                batch.set(db.collection(UserHandler.tables.evacuation_history).doc(), doc.toObject());
            })
            // Commit the batch
            batch.commit().then(function () {
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


    saveEvacuation


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

    getModelParams(isActive = false) {
        return new Promise((resolve, reject) => {
            let ref = this.firestore.collection('moabc')

            let query = isActive ? ref.where('is_active', '==', 'true') : ref

            query.get().then(function (querySnapshot) {
                    var models = []
                    querySnapshot.forEach(function (doc) {
                        const data = doc.data()
                        const id = doc.id
                        const object = parseObject({
                            id,
                            ...data
                        })
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
        return this.addEntry(params.id, params.toObject(), UserHandler.tables.moabc)
    } //addModelParams

    deleteModelParams(id) {
        return this.deleteEntry(id, UserHandler.tables.moabc)
    } //deleteModelParams

} //MOABParamsHandler

/** class functions handles inventory */
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
                        let object = parseObject({
                            id,
                            ...data
                        })
                        /* let object = {
                            id,
                            ...data
                        }
                        try {
                            object.date_created = object.date_created.toDate()
                            object.date_updated = object.date_updated.toDate()
                        } catch (err) {
                            //console.log(err)
                        } */
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

                        var object = {
                            id,
                            ...data
                        }

                        object = parseObject(object)
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
            const ref = this.firestore.collection(UserHandler.tables.evacuation_supply)
            //.where('inventory_id', 'in', inventory_ids)
            const query = inventory_ids.isEmpty() ? ref : ref.where('inventory_id', 'in', inventory_ids)

            query.get().then(function (querySnapshot) {
                var supplies = []
                querySnapshot.forEach(function (doc) {
                    let data = doc.data()
                    let id = doc.id

                    var object = {
                        id,
                        ...data
                    }

                    object = parseObject(object)
                    supplies.push(EvacuationSupply.parse(object))
                });

                var _supplies = []
                if (inventory_ids.isEmpty()) {
                    _supplies = supplies
                } else {
                    _supplies = inventory_ids.map((inventory_id) => {
                        const filtered_supplies = supplies.filter((supply) => {
                            return supply.inventory_id == inventory_id
                        })
                        return {
                            inventory_id,
                            supplies: filtered_supplies
                        }
                    })
                }

                var message = new Message()
                message.data = _supplies

                resolve(message)
            }).catch(function (error) {
                reject(error)
            });
        })
    }

    getPendingSupplies(inventory_ids = []) {
        var perChunk = 2 // items per chunk    

        //var inputArray = ['a', 'b', 'c', 'd', 'e']

        let result = inventory_ids.reduce((resultArray, item, index) => {
            const chunkIndex = Math.floor(index / perChunk)

            if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = [] // start a new chunk
            }

            resultArray[chunkIndex].push(item)

            return resultArray
        }, [])

        let promises = result.map((item) => {
            return this.getPendingSuppliesBatch(item).then((message) => {
                return message.data
            })
        })

        return Promise.all(promises).then((data) => {
            var message = new Message()
            console.log(data)
            message.data = data
            return message
        })
    }

    getPendingSuppliesBatch(inventory_ids = [], limit = 100) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.evacuation_supply)

            var query = inventory_ids.isEmpty() ? ref : ref.where('inventory_id', 'in', inventory_ids)
            query = query.where('status', '==', 'pending').orderBy('date_updated', 'desc').limit(limit)

            query.get().then((querySnapshot) => {
                var supplies = []
                querySnapshot.forEach((doc) => {
                    let data = doc.data()
                    let id = doc.id
                    let object = parseObject({
                        id,
                        ...data
                    })
                    supplies.push(EvacuationSupply.parse(object))
                });

                var _supplies = []
                if (inventory_ids.isEmpty()) {
                    _supplies = supplies
                } else {
                    _supplies = inventory_ids.map((inventory_id) => {
                        const filtered_supplies = supplies.filter((supply) => {
                            return supply.inventory_id == inventory_id
                        })
                        return {
                            inventory_id,
                            supplies: filtered_supplies
                        }
                    })
                }

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
    } //deleteSuppliesOfInventory

    /** returns the list of supplies dictated by the admin */
    getSupplyTypes() {
        return new Promise((resolve, reject) => {
            this.firestore.collection(UserHandler.tables.supply_types).orderBy('date_updated', 'desc')
                .get().then(function (querySnapshot) {
                    var supplytypes = []
                    querySnapshot.forEach(function (doc) {
                        let data = doc.data()
                        let id = doc.id

                        const object = parseObject({
                            id,
                            ...data
                        })
                        supplytypes.push(EvacuationSupplyType.parse(object))
                    });
                    var message = new Message()
                    message.data = supplytypes
                    resolve(message)
                }).catch(function (error) {
                    reject(error)
                });
        })
    } //getSupplyTypes

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
            if (municipality != "0" && !municipality.isEmpty()) {
                ref = ref.where('municipality', '==', municipality)
            }

            ref.get().then(function (querySnapshot) {
                var inventories = []
                querySnapshot.forEach(function (doc) {
                    let data = doc.data()
                    let id = doc.id
                    let object = parseObject({
                        id,
                        ...data
                    })
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
                .get().then((querySnapshot) => {
                    var inventories = []
                    querySnapshot.forEach((doc) => {
                        let data = doc.data()
                        let id = doc.id

                        var object = {
                            id,
                            ...data
                        }

                        object = parseObject(object)
                        /* try {
                            object.date_created = object.date_created.toDate()
                            object.date_updated = object.date_updated.toDate()
                        } catch (err) {
                            //console.log(err)
                        } */
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

    /**
     * generates the list of evacuation center ranked by the lowest inventory status
     */
    recommendEvacuationCenter() {
        return new Promise((resolve, reject) => {
            const ref = this.func.httpsCallable('recommendEvacuationSupply')
            ref().then((data) => {
                var message = new Message()
                message.data = data
                resolve(message)
            }).catch((err) => {
                reject(err)
            })
        })
    } //recommendEvacuationCenter
}

class DonorHandler extends MunicipalInventoryHandler {

    loginDonor(username, password) {
        return new Promise((resolve, reject) => {
            let promiseInd = this.loginDonorIndv(username, password)
            let promiseOrg = this.loginDonorOrg(username, password)

            Promise.all([promiseInd, promiseOrg]).then((messages) => {
                let ind = messages[0]
                let org = messages[1]

                if (ind.data != "error") {
                    resolve(ind)
                } else if (org.data != "error") {
                    resolve(org)
                } else {
                    let message = new Message()
                    message.data = "error"
                    message.error = "Invalid Username and Password"
                    reject(message)
                }
            }).catch((error) => {
                console.log("Error getting documents: ", error);
                reject(error)
            })
        })
    }

    loginDonorIndv(username, password) {
        return new Promise((resolve, reject) => {
            console.log(username + "--" + password)
            this.firestore.collection(UserHandler.tables.donor_individual)
                .where("email", "==", username)
                .where("password", "==", password)
                .get().then(function (querySnapshot) {
                    var users = []
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id, " => ", doc.data());
                        let data = doc.data()
                        let id = doc.id
                        let object = parseObject({
                            id,
                            ...data
                        })
                        users.push(DonorsIndividual.parse(object))
                    });

                    var message = new Message()

                    if (users.length > 0) {
                        message.data = users[0]
                        resolve(message)
                    } else {
                        message.data = "error"
                        message.error = "Invalid Username and Password"
                        resolve(message)
                    }

                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                    reject(error)
                });
        })
    }

    loginDonorOrg(username, password) {
        return new Promise((resolve, reject) => {
            console.log(username + "--" + password)
            this.firestore.collection(UserHandler.tables.donor_organization)
                .where("email", "==", username)
                .where("password", "==", password)
                .get().then(function (querySnapshot) {
                    var users = []
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id, " => ", doc.data());
                        let data = doc.data()
                        let id = doc.id
                        let object = parseObject({
                            id,
                            ...data
                        })
                        users.push(DonorsOrganization.parse(object))
                    });

                    var message = new Message()

                    if (users.length > 0) {
                        message.data = users[0]
                        resolve(message)
                    } else {
                        message.data = "error"
                        message.error = "Invalid Username and Password"
                        resolve(message)
                    }

                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                    reject(error)
                });
        })
    }

    /** returns the inventories of the evacuation centers */
    getDonorOrganizations(id) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.donor_organization)
            const query = (id && !id.isEmpty()) ? ref.where('id', '==', id) : ref

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
    getDonorById(id, isOrg) {
        return new Promise((resolve, reject) => {
            var docRef = this.firestore.collection(isOrg ? UserHandler.tables.donor_organization : UserHandler.tables.donor_individual)
                            .doc(id);

            docRef.get().then((doc) => {
                if (doc.exists) {
                    let data    = doc.data()
                    let id      = doc.id

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
                    var message     = new Message()
                    message.data    = isOrg ? DonorsOrganization.parse(object) : DonorsIndividual.parse(object)
                    resolve(message)
                } else {
                    throw "user not exist"
                }
            }).catch((error) => {
                reject(error)
            });
        })
    } //getDonorOrganizations

    /** returns the dictionary of donor organization */
    getDonorOrganizationsDict() {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.donor_organization)
            const query = ref

            query.get().then(function (querySnapshot) {
                var donors = {}
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
                    //donors.push(DonorsOrganization.parse(object))
                    let donor = DonorsOrganization.parse(object)
                    donors[donor.id] = donor
                });
                var message = new Message()
                message.data = donors
                resolve(message)
            }).catch(function (error) {
                reject(error)
            });
        })
    } //getDonorOrganizations

    /** returns the dictionary of donor organization */
    getDonorIndividualDict() {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.donor_individual)
            const query = ref

            query.get().then(function (querySnapshot) {
                var donors = {}
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
                    //donors.push(DonorsOrganization.parse(object))
                    let donor = DonorsIndividual.parse(object)
                    donors[donor.id] = donor
                });
                var message = new Message()
                message.data = donors
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
            var query = (id && !id.isEmpty()) ? ref.where('id', '==', id) : ref

            query.get().then((querySnapshot) => {
                var donors = []
                querySnapshot.forEach((doc) => {
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
            }).catch((error) => {
                reject(error)
            });
        })
    } //getDonorOrganizations

    /** adds `DONOR ORG` or `DONOR INDV` from the database
     * @param params - entry to be updated to the database
     * @method UserHandler.addEntry()
     */
    addDonor(params, isOrg = true) {
        console.log("on save donor %o -> isOrg %o", params, isOrg)
        return this.addEntry(params.id, params.toObject(), isOrg ? UserHandler.tables.donor_organization : UserHandler.tables.donor_individual)
    } //getInventories

    /**
     * deletes `DONOR ORG` or `DONOR INDV` from the database
     * @param id - entry id to be deleted
     * @method UserHandler.deleteEntry()
     */
    deleteDonor(id, isOrg = true) {
        return this.deleteEntry(id, isOrg ? UserHandler.tables.donor_organization : UserHandler.tables.donor_individual)
    }

    getDonorsReportsByEvac(evac_id, status) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.donor_reports)

            var query = ref.where('evac_id', '==', evac_id)

            // if (status) {
            //     query = ref.where('status', '==', status)
            // }

            query = query.orderBy('date_updated', 'desc')

            query.get().then((querySnapshot) => {
                var reports = []
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data());
                    let data = doc.data()
                    let id = doc.id

                    const object = parseObject({
                        id,
                        ...data
                    })

                    let report = DonorsReport.parse(object)

                    if (status) {
                        if(report.status == status) {
                            reports.push(report)
                        }
                    }
                    
                });
                var message = new Message()


                message.data = reports
                resolve(message)
            }).catch((error) => {
                console.log("Error getting documents: ", error);
                reject(error)
            });
        })
    }

    getDonorsReportsByMunicipal(municipality, status) {
        return new Promise((resolve, reject) => {
            this.getEvacuationCenters(municipality)
                .then((evacs) => {
                    let reportsPromises = evacs.data.map((evac) => {
                        return this.getDonorsReportsByEvac(evac.id, status)
                    })
                    Promise.all(reportsPromises).then((messages) => {
                        let reports = messages.map((message) => {
                            return message.data
                        }).reduce((prev, curr) => {
                            prev = prev || []
                            return prev.concat(curr)
                        })

                        var message = new Message()
                        message.data = reports
                        console.log("getDonorsReportsByMunicipal: evacs: %o", evacs.data);
                        resolve(message)
                    })
                }).catch((err) => {
                    console.log("Error getting documents: ", error);
                    reject(err)
                })
        })
    }

    /** returns the public history of the user or general if given empty id */
    getDonorReports(user_id, limit = 100) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.donor_reports)
            //const query = (municipality != "0") ? ref.where('municipality', '==', municipality) : ref
            var query = (user_id && !user_id.isEmpty()) ? ref.where('user_id', '==', user_id) : ref

            query = query.orderBy('date_updated', 'desc').limit(limit)

            query.get().then(function (querySnapshot) {
                var reports = []
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id, " => ", doc.data());
                    let data = doc.data()
                    let id = doc.id

                    const object = parseObject({
                        id,
                        ...data
                    })
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
    } //getPublicUserReports

    /**
     * returns the count of pending reports of donor
     * @returns Promise(Int)
     */
    getDonorPendingReportsCount(evac_id) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.donor_reports)
            var query = ref //.where('status','==',SupplyStatus.pending)

            if(evac_id) {
                query = query.where('evac_id','==', evac_id)
            }

            query.get().then((querySnapshot) => {

                var count = 0 

                querySnapshot.forEach(function (doc) {
                    console.log(doc.id, " => ", doc.data());
                    let data = doc.data()
                    let id = doc.id

                    const object = parseObject({
                        id,
                        ...data
                    })
                    let report = DonorsReport.parse(object)
                    if(report.status == SupplyStatus.pending) {
                        count++
                    }
                });

                var message     = new Message()
                message.data    = count
                resolve(message)
            }).catch((error) => {
                console.log("Error getting documents: ", error);
                reject(error)
            });
        })
    } //getPublicUserReports

    addDonorsReport(params = new DonorsReport) {
        let object = params.toObject()
        console.log(object)
        return this.addEntry(params.id, object, UserHandler.tables.donor_reports)
    }

    deleteDonorsReport(id) {
        return this.deleteEntry(id, UserHandler.tables.donor_reports)
    }
} //DonorHandler


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
        const ref = this.firestore.collection(table)
        return new Promise((resolve, reject) => {
            const doc = id != null ? ref.where('id', '==', id) : ref.orderBy('date_updated', 'desc')
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
    addPublicPost(params, file, images = [], table = UserHandler.tables.public_content) {
        //return this.addPublicEntry(params, images, UserHandler.tables.public_content)
        /* return this.uploadImages([file]).then((resp) => {
            console.log("response %o", resp)
            return resp.json()
        }).then((file_path) => {
            console.log("filepath %o", file_path)
            params.path = file_path[0]
            return this.uploadImages(images)
        }).then((resp) =>{
            return resp.json()
        }).then((images) => {
            params.images = (params.images || []).concat(images)
            return this.addEntry(params.id, params.toObject(), table)
        }) */

        if (images.isEmpty()) {
            return this.uploadImages([file]).then((resp) => {
                console.log("response %o", resp)
                return resp.json()
            }).then((file_path) => {
                console.log("filepath %o", file_path)
                params.path = file_path[0]
                return this.updatePublicPost(params, table)
            })
        } else {
            return this.uploadImages([file]).then((resp) => {
                console.log("response %o", resp)
                return resp.json()
            }).then((file_path) => {
                console.log("filepath %o", file_path)
                params.path = file_path[0]
                return this.uploadImages(images)
            }).then((resp) => {
                return resp.json()
            }).then((images) => {
                params.images = (params.images || []).concat(images || [])
                return this.updatePublicPost(params, table)
            })
        }
    } //addPublicPost

    updatePublicPost(params, table = UserHandler.tables.public_content) {
        return this.addEntry(params.id, params.toObject(), table)
    }

    /** gets the text content from the server file */
    getPublicPostContent(path) {
        let filePath = DataHandlerType.api_host + `getfile.php?path=${path}`
        console.log("hello? %o", filePath)

        return fetch(filePath)
            .then(response => {
                return response.text()
            }).catch(err => {
                console.log(err)
            })
    } //getPublicPostContent

    /**
     * deletes the content entry on the databse
     * @param {*} params - object to be delete
     */
    deletePublicPost(params, table = UserHandler.tables.public_content) {
        let toDelete = params.images.concat([params.path])
        this.deleteImages(toDelete).then((val) => {
            console.log("deleted successfuly %o", val)
        }).catch(err => {
            console.log(err)
        })
        return this.deleteEntry(params.id, table)
    } //deletePublicPost

    /* ------------------ EVENTS -------------------- */

    /** returns list of events sorted by date_event desc*/
    getPublicEvents(id = null) {
        //const type = PublicContent
        const ref = this.firestore.collection(UserHandler.tables.public_events)
        return new Promise((resolve, reject) => {
            const doc = id != null ? ref.where('id', '==', id) : ref
            doc.orderBy('date_start', 'desc').get().then(function (querySnapshot) {
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
                        object.date_start = object.date_start.toDate()
                        object.date_end = object.date_end.toDate()
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
    } //getPublicEvents

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
    } //getPublicDocuments

    /** saves the document to the server and the db */
    addPublicDocument(params, file = null) {
        if (file) {
            return this.addPublicPost(params, file, UserHandler.tables.public_document)
        } else {
            return this.addEntry(params.id, params.toObject(), UserHandler.tables.public_document)
        }
    } //addPublicDocument

    /** deletes the document from the server and the db */
    deletePublicDocument(params) {
        return this.deletePublicPost(params, UserHandler.tables.public_document)
    } //deletePublicDocument

    /* ------------- OTHER INFORMATION --------------- */

    /** gets content information from database */
    getPublicInformation(id = null) {
        return this.getContentPost(id, PublicInformation, UserHandler.tables.public_information)
    } //getContentInformation

    /** saves the document to the server and the db */
    addPublicInformation(params, file = null) {
        if (file) {
            return this.addPublicPost(params, file, UserHandler.tables.public_information)
        } else {
            return this.addEntry(params.id, params.toObject(), UserHandler.tables.public_information)
        }
    } //addPublicInformation

    /** deletes the document from the server and the db */
    deletePublicInformation(params) {
        return this.deletePublicPost(params, UserHandler.tables.public_information)
    } //deletePublicInformation

    /* ------------- IMAGES ----------------------- */

    getPublicImages(id = null) {
        return this.getContentPost(id, PublicGallery, UserHandler.tables.public_images)
    } //getPublicImages

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
    } //addPublicImages

    deletePublicImages(params) {
        this.deleteImages(params.images = []).then((val) => {
            console.log("deleted successfuly %o", val)
        }).catch(err => {
            console.log(err)
        })
        return this.deleteEntry(params.id, table)
    } //deletePublicImages

} //PublicWebHandler

class PublicUserSupplyHandler extends PublicWebHandler {

    /** adds the event to the db */
    addPublicSupply(params) {
        return this.addEntry(params.id, params.toObject(), UserHandler.tables.public_item_supply)
    }

    /**
     * returns list of public supplies
     * @param {*} user_id - ref to search by user_id
     * @returns 
     */
    getPublicSupplyByUserId(user_id) {
        return new Promise((resolve, reject) => {
            const ref = this.firestore.collection(UserHandler.tables.public_item_supply)
            //const query = (municipality != "0") ? ref.where('municipality', '==', municipality) : ref
            var query = (user_id && !user_id.isEmpty()) ? ref.where('user_id', '==', user_id) : ref

            query = query.orderBy('date_updated', 'desc').limit(limit)

            query.get().then(function (querySnapshot) {
                var reports = []
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id, " => ", doc.data());
                    let data = doc.data()
                    let id = doc.id

                    const object = parseObject({
                        id,
                        ...data
                    })
                    reports.push(PublicUserSupply.parse(object))
                });
                var message = new Message()
                message.data = reports
                resolve(message)
            }).catch(function (error) {
                console.log("Error getting documents: ", error);
                reject(error)
            });
        })
    }
}

/**
 * class for handling storage and database fetch
 */
class DataHandlerClass extends PublicUserSupplyHandler {

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

const DataHandler = new DataHandlerClass()