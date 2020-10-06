/**generates random string from length */
function genID(length) {
    var result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const d = Date.parse(new Date());
    return result +"-"+ d;
} //genID

/** generates an key for models */
function keyGenID(prefix, length = 5) {
    return prefix +"-"+ this.genID(length) +"-"+ Date.now()
}

/**generates random value between min and max */
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/** super class that contains object for firebase implementation */
class DataHandlerType {
    /** firebase functions */
    functions

    /** firebase firestore */
    firestore
    /** firebase storage */
    storage

    /** firebase database*/
    database

    /** app config */
    config

    static cdn_host = 'https://ievacuate-laguna.000webhostapp.com/api/uploads/'
    static api_host = 'https://ievacuate-laguna.000webhostapp.com/api/'

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

        this.storage = this.config.storage()
        this.database = this.config.database()
        this.firestore = firebase.firestore(this.config)
        //this.functions  = firebase.functions()
    } //configure

} //DataHandlerType


///generates a file of json contains
function saveTextAsFile(title, text) {
    const textToWrite = text
    const textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    const fileNameToSaveAs = title//document.getElementById("").value;
    let downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    
    downloadLink.click();
}//saveTextAsFile

