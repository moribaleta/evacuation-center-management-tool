class DataHandlerClass extends DataHandlerType {

    

    getRoadMap(){
        
        return new Promise((resolve, reject) => {
            this.database.ref('roadmap/').orderByChild('date_created').limitToLast(1).once('value')
            .then((snapshot) => {
                var children = []

                snapshot.forEach(function(childSnapshot) {
                    var childKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    children.push({id: childKey, ...childData})
                });

                var message = new Message()
                
                if (children.length > 0) {
                    console.log("roadmaps %o", children)
                    let first = children[0].roadmap
                    let roadmap = JSON.parse(first)
                    //console.log("road %o", children)
                    message.data = roadmap 
                } else {
                    message.error = "empty"
                }
                resolve(message)
                
            }).catch((error) => {
                reject(error)
            })
        })
    }

    getEvacuationCenters(){
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

}

const DataHandler = new DataHandlerClass()