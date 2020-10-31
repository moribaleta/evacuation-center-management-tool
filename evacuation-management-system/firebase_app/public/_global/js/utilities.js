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
    func
    
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
        
        this.storage    = this.config.storage()
        this.database   = this.config.database()
        this.firestore  = firebase.firestore(this.config)
        
        this.func   = firebase.functions()
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

/** search an object from a given string */
function SearchObject(object = {}, searchTerm = "") {
    let filter = Object.keys(object).filter((key) => {
        return (object[key] + "").toLowerCase().includes(searchTerm.toLowerCase())
    })
    return filter.length > 0;
}


Array.prototype.isEmpty = function() {
    return this.length <= 0
}

Array.prototype.first = function() {
    return this[0]
}

String.prototype.isEmpty = function () {
    return this.length <= 0
}

/** parses all date string to date */
/* function parseDate(object = {}) {
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
} */

/* Object.prototype.transformDate = function () {
    Object.keys(this).filter((key) => {
        return key.includes('date')
    }).forEach((key) => {
        try {
            this[key] = this[key].toDate()
        } catch (err) {
            console.log(err)
        }
    })
    return this
} */


const FormGenerator = Vue.extend({
    template: 
    `
    <div class="row">
    <div class="col col-md-12 input-container" v-for="key in headers" v-if="!(form[key].isHidden || false)">
    <p>{{form[key].title}}</p>
    
    <input v-if="form[key].type == 'text'" type="text" class="input input-item"
    :id="'input_'+key" v-model="input[key]">
    
    <input v-if="form[key].type == 'password'" type="password" class="input input-item"
    :id="'input_'+key" v-model="input[key]">
    
    <input v-if="form[key].type == 'email'" type="email" class="input input-item"
    :id="'input_'+key" v-model="input[key]">
    
    <input v-if="form[key].type == 'number'" type="number" class="input input-item"
    :id="'input_'+key" v-model="input[key]">
    
    <input v-if="form[key].type == 'date'" type="date" class="input input-item"
    :id="'input_'+key" v-model="input[key]">
    
    <input v-if="form[key].type == 'datetime'" type="datetime-local" class="input input-item"
    :id="'input_'+key" v-model="input[key]">
    
    <textarea v-if="form[key].type == 'textarea'" class="form-control"
    :id="'input_'+key" name="exact_address" v-model="input[key]"></textarea>
    
    <select v-if="form[key].type == 'dropdown'" class="input input-item input-select"
    :id="'input_'+key" v-model="input[key]">
    <option v-for="option in form[key].options" :value="option.value">
    {{option.title}}</option>
    </select>

    <!-- compound -->
    <div v-if="form[key].type == 'compound'" class="row">
        <div class="col col-md-12 input-container" v-for="subkey in Object.keys(form[key].compound)" v-if="!(form[key].compound[subkey].isHidden || false)">
            <p>{{form[key].compound[subkey].title}}</p>
            <input v-if="form[key].compound[subkey].type == 'text'" type="text" class="input input-item"
            :id="'input_'+key" v-model="input[key][subkey]">
            
            <input v-if="form[key].compound[subkey].type == 'password'" type="password" class="input input-item"
            :id="'input_'+key" v-model="input[key][subkey]">
            
            <input v-if="form[key].compound[subkey].type == 'email'" type="email" class="input input-item"
            :id="'input_'+key" v-model="input[key][subkey]">
            
            <input v-if="form[key].compound[subkey].type == 'number'" type="number" class="input input-item"
            :id="'input_'+key" v-model="input[key][subkey]">
            
            <input v-if="form[key].compound[subkey].type == 'date'" type="date" class="input input-item"
            :id="'input_'+key" v-model="input[key][subkey]">
            
            <input v-if="form[key].compound[subkey].type == 'datetime'" type="datetime-local" class="input input-item"
            :id="'input_'+key" v-model="input[key][subkey]">
            
            <textarea v-if="form[key].compound[subkey].type == 'textarea'" class="form-control"
            :id="'input_'+key" name="exact_address" v-model="input[key][subkey]"></textarea>
            
            <select v-if="form[key].compound[subkey].type == 'dropdown'" class="input input-item input-select"
            :id="'input_'+key" v-model="input[key][subkey]">
            <option v-for="option in form[key].compound[subkey].options" :value="option.value">
            {{option.title}}</option>
            </select>
        </div>
    </div>
    <!-- compound -->

    <div>&nbsp</div>
    </div>
    </div>
    `,
    props: {
        form    : Object,
        input   : Object
    }, 
    data() {
        return {
            headers : Object
        }
    },
    
    created: function () {
        console.log('form generator')
        
        console.log("formModel %o", this.form)
        console.log("input %o", this.input)
        
        this.headers = Object.keys(this.form)
        
        console.log("headers %o", this.headers)
    },
})

Vue.component('form-generator', FormGenerator)



const EntryComponent = Vue.extend({
    template: `
<div class="row">
    <div class="col col-md-4 item-info" v-for="key,index in headers" v-if="_filters.length <= 0 || _filters.includes(key)">
        <p class="item-label">
            {{ getLabel(key)}}
        </p>
        <p class="item-value">
            {{ getValue(key, entry[key]) || '--'}}
        </p>
    </div>
</div>
`,
    props: {
        entry: Object,
        headers: Array,
        filters: Array,
        labels: Object,
        showCount: Boolean
    },

    data() {
        return {
            _filters : [],
            _labels : []
        }
    },

    created: function () {
        this._filters = this.filters || []
        this._labels = this.labels || {}
    },

    methods: {
        formatDate(date) {
            let _date = new Date(date)
            return _date.toLocaleDateString()
        },

        getLabel(key) {
            if (this._labels[key]) {
                return this._labels[key]
            } 
            return key.replace(/_/g,' ').toUpperCase() +": "
        },

        getValue(key, value) {
            if (key.includes('date')) {
                return this.formatDate(value)
            } else if (key.includes('sex')) {
                return value == 0 ? 'Male' : 'Female'
            }
            return value
        }
    }
})

Vue.component('entry-component', EntryComponent)


var municipalities = 
[
    'Alaminos',
    'Bay',
    'Biñan',
    'Cabuyao',
    'Calamba',
    'Calauan',
    'Cavinti',
    'Famy',
    'Kalayaan',
    'Liliw',
    'Los Baños',
    'Luisiana',
    'Lumban',
    'Mabitac',
    'Magdalena',
    'Majayjay',
    'Nagcarlan',
    'Paete',
    'Pagsanjan',
    'Pakil',
    'Pangil',
    'Pila',
    'Rizal',
    'San Pablo',
    'San Pedro',
    'Santa Cruz',
    'Santa Maria',
    'Santa Rosa',
    'Siniloan',
    'Victoria']


const EntrySingleComponent = Vue.extend({
    template: `
    <div>
        <p class="item-label">
            {{ _label }}
        </p>
        <p class="item-value">
            {{ _value }}
        </p>
    </div>
`,
    props: {
        value: String,
        label: String,
        showtime: Boolean
    },

    data() {
        return {
            _value : [],
            _label : []
        }
    },

    created: function () {
        this._value = this.getValue(this.label, this.value)
        this._label = this.getLabel(this.label)
    },

    methods: {
        formatDate(date) {
            let _date = new Date(date)
            return this.showtime ? _date.toLocaleString() : _date.toLocaleDateString()
        },

        getLabel(key) {
            return key.replace(/_/g,' ').toUpperCase() +": "
        },

        getValue(key, value) {
            if (key.includes('date')) {
                return this.formatDate(value)
            } else if (key.includes('sex')) {
                return value == 0 ? 'Male' : 'Female'
            }
            return value
        }
    }
})

Vue.component('entry-single-component', EntrySingleComponent)

const parseObject = (object) => {
    Object.keys(object).filter((key) => {
        return key.includes('date')
    }).forEach((key) => {
        try {
            object[key] = object[key].toDate()
        } catch (err) {
            //console.log(err)
        }
    })
    return object
}