import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
/* import * as cors from 'cors';
const corsHandler = cors({origin: true}); */


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



export const helloWorld = functions.https.onRequest((request, response) => {
       functions.logger.info("Hello logs!", {
              structuredData: true
       });
       response.send("Hello from Firebase!");
});

export const getUsers = functions.https.onRequest((request, respose) => {
       const app = configure()
       const db = admin.firestore(app);
       
       db.collection("users")
       .onSnapshot(function (snapshot) {
              snapshot.forEach(function (userSnapshot) {
                     //console.log(userSnapshot.data())
                     respose.send(userSnapshot.data())
              });
       });
})

/* export  const createUser = functions.https.onRequest((request, respose) => {
       const app = configure()
       const db = admin.firestore(app);
       
       db.collection("users").add(request.body).then((value) => {
              respose.send({success: true, message: "added value"})
       }).catch((err) => {
              respose.send({success: false, message: err })
       })
}) */

export const recommendEvacuationSupply = functions.https.onRequest((request, response) => {

       response.set("Access-Control-Allow-Origin", "*");
       response.set("Access-Control-Allow-Methods", "GET");
       response.set("Access-Control-Allow-Headers", "Content-Type");
       response.set("Access-Control-Max-Age", "3600");
       

       const app = configure()
       const db = admin.firestore(app);
       
       const evac_promise = db.collection(DB_tables.evacuation_centers)
       .get().then((query) => {
              return convert<EvacuationCenter>(query)
       })
       
       const supply_types = db.collection(DB_tables.supply_types)
       .get().then((query) => {
              return convert<EvacuationSupplyType>(query)
       })
       
       const evacuation_inventory = db.collection(DB_tables.evacuation_inventory)
       .get().then((query) => {
              return convert<EvacuationInventory>(query)
       })
       
       const evacuation_supply = db.collection(DB_tables.evacuation_supply).get().then((query) => {
              return convert<EvacuationSupply>(query)
       })
       
       const promise = Promise.all([evac_promise, supply_types, evacuation_inventory, evacuation_supply])
       
       promise.then((datas) => {
              const evacs = datas[0]
              const types = datas[1]
              const inventories = datas[2]
              const supplies = datas[3]
              
              
              const evac_data = evacs.map((evac) => {

                     let inv : string[] = []

                     const evac_inventory = inventories.filter((inventory) => {
                            if (inventory.evac_id == evac.id) {
                                   inv.push(inventory.id)
                                   return true
                            } 
                            return false
                     })

                     var supply_total = 0

                     const evac_supplies = types.map((type) => {
                            let qtyTotal = 0
                            supplies.filter((supply) => {
                                   return supply.inventory_type == type.id && inv.includes(supply.inventory_id)
                            }).map((supply) => {
                                   qtyTotal += Number(supply.qty)
                            })

                            supply_total += Number(qtyTotal)

                            return {
                                   type,
                                   qty: qtyTotal,
                            }
                     })

                     return {
                            evac,
                            inventory: evac_inventory,
                            supplies: evac_supplies,
                            total: supply_total
                     }
              }).sort((lhs, rhs) => {
                     return (lhs.total - rhs.total)
              })
              response.status(200).json({result: evac_data})
       }).catch((error) => {
              response.json({error})
       })
       
})

function convert<T>(query: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>) : Promise<T[]> {
       return new Promise((resolve, reject) => {
              let array : T[] = []
              query.forEach((doc) => {
                     //console.log(doc.id, " => ", doc.data());
                     const data = doc.data()
                     const id = doc.id
                     
                     const object = {
                            id,
                            ...data
                     }
                     array.push(object as unknown as T)
              });
              resolve(array)
       })
}

export const pingFunctionWithCorsAllowed = functions.https.onRequest((request, response) => {
       response.set("Access-Control-Allow-Origin", "*");
       response.set("Access-Control-Allow-Methods", "GET");
       response.set("Access-Control-Allow-Headers", "Content-Type");
       response.set("Access-Control-Max-Age", "3600");
       response.status(200)
       .json({ body: request.body ,message: `Ping from Firebase (with CORS handling)! ${new Date().toISOString()}`});
});


function configure(): admin.app.App {
       
       if (admin.apps.length > 0) {
              return admin.app()
       }
       
       const firebaseConfig = {
              apiKey: "AIzaSyDkbPEnpffZuVgv2R1hjs_wb_uvz5sfYpg",
              authDomain: "ievacuate-laguna.firebaseapp.com",
              databaseURL: "https://ievacuate-laguna.firebaseio.com",
              projectId: "ievacuate-laguna",
              storageBucket: "ievacuate-laguna.appspot.com",
              messagingSenderId: "22070474230",
              appId: "1:22070474230:web:eaa15ae6cd54d68fd203d7",
              measurementId: "G-9V7V2C0H3Q"
       };
       // Initialize Firebase
       return admin.initializeApp(firebaseConfig);
}

const DB_tables = {
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

/**
* superclass defines the model of any object created
*/
interface Model {
       /** id model */
       id : string
       /** id of the admin that created the model */
       created_by : string
       /** date created*/
       date_created: Date
       /** date the model has been updated*/
       date_updated: Date
} //Model

interface Location {
       lat: number
       lng: number
}

/**
* object structure of Evacuation Center
*/
interface EvacuationCenter extends Model {
       
       /**name     = "sampl1"*/
       name : string
       /**
       * lat lng values
       * ```
       * location = {
              lat = 14.426700434748033,
              lng = 121.43130540847778
       }
       ```
       */
       location: Location
       
       /**population_capacity = 1000*/
       population_capacity : number
       /**floor_space         = 2000*/
       floor_space : number
       /**exact_address       = "mabitac rd"*/
       exact_address : string
       /**municipality        = "mabitac"*/
       municipality : string
       /**contact_numbers     = "09171231233"*/
       contact_numbers : string
       
       /** user id that handles the evac */
       admin_id : string
       
       /** category of the the evacuation center */
       category : string
       
       /** any avialable facilities */
       facilities : string
       
}

interface InventoryType extends Model {
       
       /** name of the inventory */
       name : string
       
       /** description of the inventory */
       description : string
       
       supplies: EvacuationSupply[]
}

/**
* object defines the inventory/warehouse of the evacuation center
*/
interface EvacuationInventory extends InventoryType {
       /** id of the evacuation */
       evac_id : string
} //EvacuationInventory

/**
* object defines the inventory supply
*/
interface EvacuationSupply extends Model {
       
       /** id of the inventory reference can either be from Municipal or Evacuation*/
       inventory_id : string
       
       /** type of supply definition */
       inventory_type : string
       
       /** number of quantity */
       qty : number
       
       /** date of the item supplied */
       date_supplied : Date
       
       /** any remarks or descriptions */
       remarks : string
} //EvacuationSupply

/**
* defines the type of evacuation supply is given
*/
interface EvacuationSupplyType extends Model {
       
       /** name of the item */
       name : string
       /** description of the item */
       description : string
       /** amount per package given */
       amount : number       
} //EvacuationSupplyType