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


export const testHoneyBee = functions.https.onRequest(async (request, response) => {
       const app = configure()
       const db = admin.firestore(app);

       response.set('Access-Control-Allow-Origin', '*');

       await db.collection("moabc").orderBy('date_created', 'desc').limit(1)
              .onSnapshot((snapshot) => {
                     let params: MOABCParameters[] = []
                     snapshot.forEach((param) => {
                            let value = param.data() as MOABCParameters
                            params.push(value)
                     })
                     let message = {
                            data: {},
                            error: ""
                     }
                     if (params.length > 0) {
                            const param = params[0]
                            let writer = main.generate(param)
                            message.data = writer
                     } else {
                            message.error = "empty list"
                     }
                     response.send(message)
              }, (error) => {
                     let message = {
                            data: null,
                            error: error
                     }
                     response.send(message)
              })

})

export const pingFunctionWithCorsAllowed = functions.https.onRequest((request, response) => {
       response.set("Access-Control-Allow-Origin", "*");
       response.set("Access-Control-Allow-Methods", "GET");
       response.set("Access-Control-Allow-Headers", "Content-Type");
       response.set("Access-Control-Max-Age", "3600");
       response.status(200)
              .json({ body: request.body ,message: `Ping from Firebase (with CORS handling)! ${new Date().toISOString()}`});
});

export const testHoneyBeeModel = functions.https.onRequest((request, response) => {
       

       response.set("Access-Control-Allow-Origin", "*");
       response.set("Access-Control-Allow-Methods", "*");
       response.set("Access-Control-Allow-Headers", "Content-Type");
       response.set("Access-Control-Max-Age", "3600");

       const app = configure()
       const db = admin.firestore(app);


              db.collection("moabc").where('id', '==', request.body.id).limit(1)
              .onSnapshot((snapshot) => {
                     let params: MOABCParameters[] = []
                     snapshot.forEach((param) => {
                            let value = param.data() as MOABCParameters
                            value.max_val = 200
                            params.push(value)
                     })
                     let message = {
                            data: {},
                            error: ""
                     }
                     if (params.length > 0) {
                            const param = params[0]
                            let writer = main.generate(param)
                            message.data = writer
                     } else {
                            message.error = "empty list"
                     }
                     
                     //response.send(message)
                     response.status(200).json(message);
              }, (error) => {
                     let message = {
                            data: null,
                            error: error
                     }
                     response.status(200).json(message);
              })
              //response.send(`Ping from Firebase (with CORS handling)! ${new Date().toISOString()}`);
      

       

})


function configure(): admin.app.App {

       if (admin.apps.length > 0) {
              return admin.app()
       }

       var firebaseConfig = {
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