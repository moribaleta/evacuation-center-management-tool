var DataHandlerClass = (function () {
    function DataHandlerClass() {
    }
    DataHandlerClass.prototype.configure = function () {
        if (firebase.apps.length > 0) {
            this.config = firebase.app();
        }
        else {
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
            this.config = firebase.initializeApp(firebaseConfig);
        }
        this.storage = this.config.storage();
        this.database = this.config.database();
        this.firestore = firebase.firestore(this.config);
    };
    return DataHandlerClass;
}());
//# sourceMappingURL=datahandler.js.map