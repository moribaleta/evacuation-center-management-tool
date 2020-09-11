/**generates random string from length */
function genID(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }//genID

 
 /** super class that contains object for firebase implementation */
 class DataHandlerType {

    /** firebase firestore */
    firestore
    /** firebase storage */
    storage
    
    /** firebase database*/
    database

    /** app config */
    config

    /** configures firebase functionality */
    configure() {
                
        if (firebase.apps.length > 0) {
            this.config = firebase.app()
        } else {
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
            this.config = firebase.initializeApp(firebaseConfig);
        }
        
        this.storage    = this.config.storage()
        this.database   = this.config.database()
        this.firestore  = firebase.firestore(this.config)
    }//configure

 }//DataHandlerType