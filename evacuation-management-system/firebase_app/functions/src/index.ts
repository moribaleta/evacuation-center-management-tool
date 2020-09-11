import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

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

export const createUser = functions.https.onRequest((request, respose) => {
       const app = configure()
       const db = admin.firestore(app);
       
       db.collection("users").add(request.body).then((value) => {
              respose.send({success: true, message: "added value"})
       }).catch((err) => {
              respose.send({success: false, message: err })
       })
       /* db.collection("users")
       .onSnapshot(function(snapshot) {
           snapshot.forEach(function (userSnapshot) {
               //console.log(userSnapshot.data())
               respose.send(userSnapshot.data())
           });
       }); */
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