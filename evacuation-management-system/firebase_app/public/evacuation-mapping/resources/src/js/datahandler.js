class DataHandlerClass extends DataHandlerType {

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

    getRoadMap(){
        
        return new Promise((resolve, reject) => {
            this.database.ref('roadmap/').once('value')
            .then((snapshot) => {
                var children = []

                snapshot.forEach(function(childSnapshot) {
                    var childKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    children.push({id: childKey, ...childData})
                });

                var message = new Message()
                
                if (children.length > 0) {
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

}

const DataHandler = new DataHandlerClass()