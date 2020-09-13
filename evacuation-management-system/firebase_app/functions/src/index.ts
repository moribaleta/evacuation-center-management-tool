import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import main, { MOABCParameters } from './moabc/test';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



export const helloWorld = functions.https.onRequest((request, response) => {
       functions.logger.info("Hello logs!", {structuredData: true});
       response.send("Hello from Firebase!");
});

export const getUsers = functions.https.onRequest((request, respose) => {
       const app = configure()
       const db = admin.firestore(app);

       db.collection("users")
       .onSnapshot(function(snapshot) {
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


export const testHoneyBee = functions.https.onRequest( async (request, respose) => {
       const app = configure()
       const db = admin.firestore(app);

       await db.collection("moabc").orderBy('date_created', 'desc').limit(1)
       .onSnapshot((snapshot) => {
              let params : MOABCParameters[] = []
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
              respose.send(message)
       }, (error) => {
              let message = {
                     data: null,
                     error: error
              }
              respose.send(message)
       })

})
       

function configure() : admin.app.App {

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