/**generates random string from length */
function genID(length) {
    var result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const d = Date.parse(new Date());
    return result + "-" + d;
} //genID

/** generates an key for models */
function keyGenID(prefix, length = 5) {
    return prefix + "-" + this.genID(length) + "-" + Date.now()
}

/**generates random value between min and max */
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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


    static base_url = 'https://ievacuate-laguna-cdn.000webhostapp.com/'
    //static cdn_host = 'https://ievacuate-laguna.000webhostapp.com/api/uploads/'
    //static api_host = 'https://ievacuate-laguna.000webhostapp.com/api/'

    static api_host  = DataHandlerType.base_url + "api/"
    static cdn_host  = DataHandlerType.api_host + "uploads"

    /** configures firebase functionality */
    configure() {

        if (firebase.apps.length > 0) {
            this.config = firebase.app()
        } else {
            var firebaseConfig = {
                apiKey              : "AIzaSyDkbPEnpffZuVgv2R1hjs_wb_uvz5sfYpg",
                authDomain          : "ievacuate-laguna.firebaseapp.com",
                databaseURL         : "https://ievacuate-laguna.firebaseio.com",
                projectId           : "ievacuate-laguna",
                storageBucket       : "ievacuate-laguna.appspot.com",
                messagingSenderId   : "22070474230",
                appId               : "1:22070474230:web:eaa15ae6cd54d68fd203d7",
                measurementId       : "G-9V7V2C0H3Q"
            };
            // Initialize Firebase
            this.config = firebase.initializeApp(firebaseConfig);
        }

        this.storage = this.config.storage()
        this.database = this.config.database()
        this.firestore = firebase.firestore(this.config)

        this.func = firebase.functions()
    } //configure

} //DataHandlerType



/** search an object from a given string */
function SearchObject(object = {}, searchTerm = "") {
    let filter = Object.keys(object).filter((key) => {
        return (object[key] + "").toLowerCase().includes(searchTerm.toLowerCase())
    })
    return !filter.isEmpty()
}


function combineDateAndTime(date, time) {
    timeString = time.getHours() + ':' + time.getMinutes() + ':00';

    var year = date.getFullYear();
    var month = date.getMonth() + 1; // Jan is 0, dec is 11
    var day = date.getDate();
    var dateString = '' + year + '-' + month + '-' + day;
    var combined = new Date(dateString + ' ' + timeString);

    return combined;
}

Array.prototype.isEmpty = function () {
    return this.length <= 0
}

Array.prototype.first = function () {
    return this[0]
}


Array.prototype.firstIndex = function (where) {
    /*this.forEach((item, index) => {
        if (where(item)) {
            console.log("found?")
            return index
        }
    })*/
    for(var i = 0; i < this.length; i++) {
        if (where(this[i])) {
            console.log("found?")
            return i
        }
    }

    return null
}

Array.prototype.hasValue = function () {
    return this.length > 0
}

String.prototype.isEmpty = function () {
    return this.length <= 0
}

//expected input dd/mm/yyyy or dd.mm.yyyy or dd-mm-yyyy
function isValidDate(s) {
    var separators = ['\\.', '\\-', '\\/'];
    var bits = s.split(new RegExp(separators.join('|'), 'g'));
    var d = new Date(bits[2], bits[1] - 1, bits[0]);
    return d.getFullYear() == bits[2] && d.getMonth() + 1 == bits[1];
}

/** parses all date string to date */
/* function parseDate(object = {}) {
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
} */

/* Object.prototype.transformDate = function () {
    Object.keys(this).filter((key) => {
        return key.includes('date')
    }).forEach((key) => {
        try {
            this[key] = this[key].toDate()
        } catch (err) {
            //console.log(err)
        }
    })
    return this
} */


const FormGenerator = Vue.extend({
    template: `
    <div class="row">
    <div class="col col-md-12 input-container" v-for="key in headers" v-if="!(form[key].isHidden || false) && eval(form[key])">
    <p>{{form[key].title}}</p>
    
    <input v-if="form[key].type == 'text'" type="text" class="input input-item"
    :id="'inputINP'+key" v-model="input[key]">
    
    <input v-if="form[key].type == 'password'" type="password" class="input input-item"
    :id="'inputINP'+key" v-model="input[key]">
    
    <input v-if="form[key].type == 'email'" type="email" class="input input-item"
    :id="'inputINP'+key" v-model="input[key]">
    
    <input v-if="form[key].type == 'number'" type="number" class="input input-item"
    :id="'inputINP'+key" v-model="input[key]">
    
    <input v-if="form[key].type == 'date'" type="date" class="input input-item"
    :id="'inputINP'+key"  :value="formatDate(input[key], false)" v-on:change="dateChange">
    
    <div class="row" v-if="form[key].type == 'datetime'">
        <div class="col col-md-3">
            <input type="date" class="input input-item"
                    :id="'dateINP'+key"
                    :value="formatDate(input[key], false)" v-on:change="datetimeChange">
        </div>
        <div class="col col-md-3">
            <input type="time" :id="'timeINP'+key" name="time"
                    :value="formatDate(input[key], true)" v-on:change="datetimeChange">
        </div>
    </div>
    
    
    <textarea v-if="form[key].type == 'textarea'" class="form-control"
    :id="'inputINP'+key" name="exact_address" v-model="input[key]"
    ></textarea>
    
    <select v-if="form[key].type == 'dropdown'" class="input input-item input-select"
    :id="'inputINP'+key" v-model="input[key]">
    <option v-for="option in form[key].options" :value="option.value">
    {{option.title}}</option>
    </select>

    <!-- compound -->
    <div v-if="form[key].type == 'compound'" class="row">
        <div class="col col-md-12 input-container" v-for="subkey in Object.keys(form[key].compound)" v-if="!(form[key].compound[subkey].isHidden || false)">
            <p>{{form[key].compound[subkey].title}}</p>
            <input v-if="form[key].compound[subkey].type == 'text'" type="text" class="input input-item"
            :id="'inputINP'+key+'INP'+subkey" v-model="input[key][subkey]">
            
            <input v-if="form[key].compound[subkey].type == 'password'" type="password" class="input input-item"
            :id="'inputINP'+key+'INP'+subkey" v-model="input[key][subkey]">
            
            <input v-if="form[key].compound[subkey].type == 'email'" type="email" class="input input-item"
            :id="'inputINP'+key+'INP'+subkey" v-model="input[key][subkey]">
            
            <input v-if="form[key].compound[subkey].type == 'number'" type="number" class="input input-item"
            :id="'inputINP'+key+'INP'+subkey" v-model="input[key][subkey]">
            
            <input v-if="form[key].compound[subkey].type == 'date'" type="date" class="input input-item"
            :id="'inputINP'+key+'INP'+subkey" v-model="input[key][subkey]">
            
            <input v-if="form[key].compound[subkey].type == 'datetime'" type="datetime-local" class="input input-item"
            :id="'inputINP'+key+'INP'+subkey" v-model="input[key][subkey]">
            
            <textarea v-if="form[key].compound[subkey].type == 'textarea'" class="form-control"
            :id="'inputINP'+key+'INP'+subkey" name="exact_address" v-model="input[key][subkey]"></textarea>
            
            <select v-if="form[key].compound[subkey].type == 'dropdown'" class="input input-item input-select"
            :id="'inputINP'+key+'INP'+subkey" v-model="input[key][subkey]">
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
        form: Object,
        input: Object
    },
    data() {
        return {
            headers: Object
        }
    },

    created() {
        this.headers = Object.keys(this.form)
    },

    methods: {

        eval(form){
            if (form.logic) {
                try {
                    let logic           = form.logic
                    let key_value       = this.input[logic.key]
                    let condition       = logic.condition
                    let condition_value = logic.value
                    let string          = `"${key_value}"` + condition + `"${condition_value}"`
                    
                    return eval(string)
                }catch(err){
                    return true
                }
                
            }
            return true
        },

        datetimeChange(event) {
            //console.log("event %o", event)

            let id = event.srcElement.id
            let ids = id.split('INP');

            var date_value = null
            var time_value = null

            if (ids[0] == "date") {
                date_value = $('#' + id).val()
                time_value = $('#timeINP' + ids[1]).val()
            } else {
                time_value = $('#' + id).val()
                date_value = $('#dateINP' + ids[1]).val()
            }

            //console.log("date %o", date_value)
            //console.log("time %o", time_value)

            //let _date = combineDateAndTime(date_value, time_value)
            "yyyy-MM-ddThh:mm"
            let date_time = date_value + "T" + time_value

            /*  if (ids > 1) {
                 this.input[ids[1]][ids[2]] = _date
                 //console.log("compound")
             } else { */
            this.input[ids[1]] = date_time
            //}

            /* 
            let date = $('#'+id).val()
            let ids = id.split('INP')
            let data_value = $('#inputINP')

            let _date = new Date(date.toString())


            //console.log("date changed %o",_date)
            if (ids > 1) {
                this.input[ids[1]][ids[2]] = _date
                //console.log("compound")
            } else {
                this.input[ids[1]] = _date
            }
            //console.log("ids %o", ids)
            //console.log(this.input) */
        },

        dateChange(event) {
            //console.log("event %o", event)

            let id = event.srcElement.id
            let date = $('#' + id).val()
            //this.input[id.substr(('input_').length)] = new Date(date)
            let ids = id.split('INP')
            let _date = new Date(date.toString())
            ////console.log("date changed %o", _date)
            if (ids > 1) {
                this.input[ids[1]][ids[2]] = _date
                ////console.log("compound")
            } else {
                this.input[ids[1]] = _date
            }
            //console.log("ids %o", ids)
            //console.log(this.input)
        },

        formatDate(date, isTime) {

            let format = isTime ? moment(date).format('hh:mm') : moment(date).format('YYYY-MM-DD')
            ////console.log("format date %o", format)
            return format
            /* let _date = new Date(date)
            let format = isTime ? _date.toLocaleString() : _date.toLocaleDateString()
            //console.log("formatted input date %o", format )
            return format */
        },
    }
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
            _filters: [],
            _labels: []
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
            return key.replace(/_/g, ' ').toUpperCase() + ": "
        },

        getValue(key, value) {
            if (key.includes('date')) {
                return value ? this.formatDate(value) : "--"
            } else if (key.includes('sex')) {
                return value == 0 ? 'Male' : 'Female'
            }
            return value
        }
    }
})

Vue.component('entry-component', EntryComponent)




var municipalities = [
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
    'Victoria'
]


const months_array = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
]




const parseObject = (object) => {
    Object.keys(object).filter((key) => {
        return key.includes('date')
    }).forEach((key) => {
        try {
            //object[key] = object[key].toDate()
            let date = new Date(object[key].toDate())
            object[key] = date
        } catch (err) {
            try {
                ////console.log(err) 
                if (object[key].seconds &&
                    object[key].nanoseconds) {
                    let timestamp = new firebase.firestore.Timestamp(object[key].seconds,
                        object[key].nanoseconds)
                    object[key] = new Date(timestamp.toDate())
                } else {
                    object[key] = new Date(object[key])
                }

                ////console.log("im here?")
            } catch (err) {
                ////console.log(err) 
            }
            ///* console.log("key %o, value %o", key, object[key])
            //console.log(err) */
        }
    })
    return object
}


const ConvertToCSV = (objArray) => {
    let rows = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let header = "";
    Object.keys(rows[0]).map(pr => (header += pr + ";"));

    let str = "";
    rows.forEach(row => {
        let line = "";
        let columns =
            typeof row !== "object" ? JSON.parse(row) : Object.values(row);
        columns.forEach(column => {
            if (line !== "") {
                line += ";";
            }
            if (typeof column === "object") {
                line += JSON.stringify(column);
            } else {
                line += column;
            }
        });
        str += line + "\r\n";
    });
    return header + "\r\n" + str;
}


/** for saving any text as file */
const saveTextAsFile = (title, data) => {
    const textToWrite = data
    const textFileAsBlob = new Blob([textToWrite], {
        type: 'text/plain'
    });
    const fileNameToSaveAs = title //document.getElementById("").value;
    let downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}


const FilterComponent = Vue.extend({
    template: `
    <div class="section">
    <div class="well input-container" style="padding:10px; width: 100%; min-height: 70px">
    <div class="col col-md-1">
    <p class="input-label">YEAR</p>
    <select id="input-type" class="input input-select" v-model="filter.year">
    <option v-for="(item,index) in selections.years" :selected="index == filter.year ? true : false">{{item ? item : "NOT AVAILABLE"}}</option>
    </select>
    </div>
    <div class="col col-md-2">
    <p class="input-label">MONTH</p>
    <select id="input-type" class="input input-select" v-model="filter.month">
    <option v-for="(item,index) in selections.months" :selected="index == filter.month ? true : false"> {{item}}</option>
    </select>
    </div>
    <div class="col col-md-3" v-if="!disable_municipal">
    <p class="input-label">MUNICIPALITY</p>
    <select id="input-type" class="input input-select" v-model="filter.municipality">
    <option v-for="(item,index) in selections.municipality" :selected="index == filter.municipality ? true : false"> {{item}}</option>
    </select>
    </div>
    
    <div class="col col-2 button-filter-container">
        <div>&nbsp;</div>
        <button type="button" id="filterButton" class="btn btn-warning button-view" v-on:click="$emit('filter', filter)">Filter
        </button>
        <button type="button" id="clearButton" class="btn btn-warning button-view" v-on:click="$emit('clear', 0); onClear()">Clear
        </button>
        
    </div>
    <div class="col col-12  button-filter-container">
        <div>&nbsp;</div>
        <button type="button" class="btn btn-warning button-view " :href="'#'+filter.id+'filteradd'" data-toggle="collapse">Additional Filter
        </button>
        <button type="button" class="btn btn-danger button-view " :href="'#'+filter.id+'searchbox'" data-toggle="collapse">Show Search
        </button>
    </div>
    
    </div>
    <div :id="filter.id+'filteradd'" class="panel-collapse collapse">
    <div class="panel-body well">
    <div class="col col-md-12">
    <div class="row">
    <div class="col col-md-3" v-for="key, index in Object.keys(filter_add)">
    <p class="input-label">{{key.toUpperCase().replace('_'," ")}}</p>
    <select id="input-type" class="input input-select" v-model="filter[key]">
    <option v-for="(item,index) in filter_add[key]" :selected="index == filter[key] ? true : false"> {{item}}</option>
    </select>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div :id="filter.id+'searchbox'" class="panel-collapse collapse">
    <div class="panel-body well">
    <p class="input-label">Search</p>
    <input id="input_searchTerm" class="input input-text" type="text" v-model="filter.searchTerm" >
    <button type="button" class="btn btn-warning button-view" v-on:click="$emit('search', filter)">Search
    </button>
    <button type="button" class="btn btn-danger button-view" v-if="filter.searchTerm.length > 0" v-on:click="onCancelSearch">Cancel
    </button>
    </div>
    </div>
    </div>`,
    props: {
        filter_add: {},
        disable_municipal: Boolean
    },
    watch: {
        filter_add() {
            Object.keys(this.filter_add).forEach((key) => {
                this.filter[key] = 'all'
            })
            console.log("filter %o", this.filter_add)
        }
    },
    data() {
        return {
            filter: {
                id: keyGenID("filter",5),
                year: 'all',
                month: 'all',
                municipality: 'all',
                searchTerm: ''
            },
            selections: {
                years: ['all'],
                months: [
                    'all',
                    'JANUARY',
                    'FEBRUARY',
                    'MARCH',
                    'APRIL',
                    'MAY',
                    'JUNE',
                    'JULY',
                    'AUGUST',
                    'SEPTEMBER',
                    'OCTOBER',
                    'NOVEMBER',
                    'DECEMBER',
                ],
                months_only: [
                    'JANUARY',
                    'FEBRUARY',
                    'MARCH',
                    'APRIL',
                    'MAY',
                    'JUNE',
                    'JULY',
                    'AUGUST',
                    'SEPTEMBER',
                    'OCTOBER',
                    'NOVEMBER',
                    'DECEMBER',
                ],
                municipality: ['all'].concat(municipalities),
                
                filter_additional: {}
            },
        }
    },
    created() {
        console.log('user data from parent component:')
        
        for (var i = (new Date()).getFullYear(); i >= 2000; i--) {
            this.selections.years.push(i)
        }
        
        try {
            Object.keys(this.filter_add).forEach((key) => {
                this.selections.filter_additional[key] = ['all'].concat(this.filter_add[key] || [])
                this.filter[key] = 'all'
            })
        } catch (err) {
            console.log(err)
        }
        
    },
    methods: {
        formatDate(date) {
            let _date = new Date(date)
            return _date.toLocaleDateString()
        },
        onCancelSearch() {
            this.filter.searchTerm = ""
            this.$emit('cancel', this.filter)
        },
        onClear() {
            Object.keys(this.filter).map((key) => {
                this.filter[key] = 'all'
            })
            this.filter.searchTerm = ''
        }
    }
})

Vue.component('filter-component', FilterComponent)




const StatusComponent = Vue.extend({
    template: `
        <div :id="modal_id" class="modal fade" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">{{title}}</h4>
                    </div>
                    <div class="modal-body">
                        <form-generator :form="formModel" :input.sync="input_model"></form-generator>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"
                            v-on:click="onSave()">Save</button>
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
        `,
    props: {
        modal_id: String,
        title   : String,
        status  : {},
    },
    watch: {
        status(val) {
            console.log("update status %o",val)
            this.input_model.status = val
        }
    },
    data() {
        return {
            input_model : {
                status : StatusType.pending
            },
            formModel: {
                status : FormModelsUtilities.StatusDropdown
            }
        }
    },
    methods: {
        onSave() {
            this.$emit('save', this.input_model.status)
        },
    }
})

Vue.component('status-modal', StatusComponent)



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
    props: [
        'value',
        'label',
        'showtime'
    ],

    data() {
        return {
            _value: [],
            _label: []
        }
    },

    created: function () {
        this._value = this.getValue(this.label, this.value)
        this._label = this.getLabel(this.label)
    },

    methods: {
        formatDate(date) {
            try {
                let _date = new Date(date)
                if (typeof _date.getMonth === 'function') {
                    
                    //console.log("am i valid? %o", date)
                    return this.showtime ? _date.toLocaleString() : _date.toLocaleDateString()   
                } else {
                    return date
                }
            }catch {
                return date
            }
            
        },

        getLabel(key) {
            return key.replace(/_/g, ' ').toUpperCase() + ": "
        },

        getValue(key, value) {
            if (key.toLowerCase().includes('date')) {
                return this.formatDate(value)
            } else if (key.includes('sex')) {
                return value == 0 ? 'Male' : 'Female'
            }
            return value
        }
    }
})

Vue.component('entry-single-component', EntrySingleComponent)


const EntryImageComponent = Vue.extend({
    template: `
    <div :id="id + '-images'" class="row">
        <div class="col col-md-12"
            v-if="images.length <= 0">
            <p>Images are empty</p>
        </div>
        <div class="col col-md-2 item-info" v-for="image,index in images">
            <div class="image-area" v-if="image">
                <img :src="cdn+image" alt="Preview">
                <a class="remove-image" v-if="edit" v-on:click="onDeleteImage(index)"
                    style="display: inline;">&#215;</a>
            </div>
        </div>
    </div>
`,
    props: {
        id      : String,
        cdn     : String,
        images  : Array,
        edit    : Boolean
    },

    methods: {
        onDeleteImage(index) {
            this.$emit('delete', {
                item: this.id ,
                index
            })
        }
    }
})

Vue.component('entry-image-component', EntryImageComponent)



const DonorComponent = Vue.extend({
    template: `
    <!-- Individual -->
    <div class="row" v-if="indv">
        <div class="col col-md-4 item-info" v-for="key,index in indv_headers" v-if="key !='id'">
            <p class="item-label">
                {{key.replace(/_/g,' ').toUpperCase() +": "}}
            </p>
            <p class="item-value">
                {{ getValue(key, indv[key]) || '--'}}
            </p>
        </div>
    </div>
    <!-- Organization -->
    <div class="row" v-else-if="org">
        <div class="col col-md-4 item-info" v-for="key,index in org_headers" v-if="key !='id'">
            <p class="item-label">
                {{key.replace(/_/g,' ').toUpperCase() +": "}}
            </p>
            <p class="item-value">
                {{ getValue(key, org[key]) || '--'}}
            </p>
        </div>
    </div>
    `,
    props: {
        donor: Object
    },

    data() {
        return {
            org: null,
            indv: null,
            
            org_headers : DonorsOrganization.visiblekeys,
            indv_headers: DonorsIndividual.visiblekeys,
        }
    },

    created() {
        console.log("donor %o", this.donor)
        if (this.donor.id.includes('org')) {
            this.org = this.donor
        } else {
            this.indv = this.donor
        }
    },

    methods: {
        formatDate(date) {
            return app.formatDate(date)
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

Vue.component('donor-container', DonorComponent)




let ImageProfileComponent = Vue.extend({
    template: 
    `
    <div class="row">
        <div class="col col-xs-12 item-info" v-if="image">
            <img :src="cdn + image" onerror="this.src='resources/images/avatar.jpeg';"
                style="height: 50px; width: 50px; border-radius: 25;">
        </div>
        <div class="col col-xs-12 item-info" v-if="!image">
            <img src="resources/images/avatar.jpeg"
                style="height: 50px; width: 50px; border-radius: 25;">
        </div>
    </div>
    `,
    props: {
        image: String,
        cdn: String
    }
})

Vue.component('image-profile-component', ImageProfileComponent)


const PasswordEditorComponent = Vue.extend({
    template:
    `
        <div :id="modal_id" class="modal fade" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" v-on:click="onClose()" >&times;</button>
                        <h4 class="modal-title">Update Password</h4>
                    </div>
                    <div class="modal-body">
                        <div class="panel-body">
                            <form-generator :form="formModelPassword" :input.sync="password_input"></form-generator>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" 
                            class="btn btn-default" 
                            v-on:click="onSave()"
                        >Save</button>
                    </div>
                </div>

            </div>
        </div>
    `,
    props: {
        modal_id: String,
        password: String,
        override: Boolean
    },

    watch: {
        override() {
            if(this.override) {
                this.password_input = {
                    password        : null,
                    conf_password   : null
                }
                this.formModelPassword = {
                    password: {
                        title: "Password",
                        type: FormModels.password,
                    },
                    conf_password: {
                        title: "Confirm Password",
                        type: FormModels.password,
                    }
                }
            }
        }
    },

    data() {
        return {
            password_input: {
                curr_password   : null,
                password        : null,
                conf_password   : null
            },
            formModelPassword: {
                curr_password: {
                    title: "Current Password",
                    type: FormModels.password,
                },
                password: {
                    title: "Password",
                    type: FormModels.password,
                },
                conf_password: {
                    title: "Confirm Password",
                    type: FormModels.password,
                }
            },
        }
    },

    methods: {
        onSave() {            
            if (!this.validatePassword()) {
                this.password_input = {
                    curr_password   : null,
                    password        : null,
                    conf_password   : null
                }
                return
            }
            $('#'+this.modal_id).modal('toggle');
            this.$emit('onsave', this.password_input.password)
        }, //onSaveUser

        onClose(){
            this.password_input = {
                curr_password   : null,
                password        : null,
                conf_password   : null
            }
        },

        validatePassword() {
            let curr_pass   = this.password_input.curr_password
            let conf        = this.password_input.conf_password
            let pass        = this.password_input.password

            if (!curr_pass || curr_pass.length <= 0) {
                AlertMessages.error("current password is required")
                return false
            }

            if (!pass || pass.length <= 0) {
                AlertMessages.error("password is required")
                return false
            }

            if (!conf || conf.length <= 0) {
                AlertMessages.error("confirm password is required")
                return false
            }

            if (pass.length < 5) {
                AlertMessages.error("password must have a minimum of 5 characters")
                return false
            }

            if (conf.length < 5) {
                AlertMessages.error("confirm password must have a minimum of 5 characters")
                return false
            }

            if (pass != conf) {
                AlertMessages.error("password and confirm password doesn't match")
                return false
            }

            if (pass == curr_pass && !this.override) {
                AlertMessages.error("password should not be the same with the current password")
                return false
            }

            return true
        },

    },
})


Vue.component('password-editor-component', PasswordEditorComponent)


const DonorRegistrationComponent = Vue.extend({
    template: 
    `
        <div :id="modal_id" class="modal fade" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" v-on:click="onClose()" >&times;</button>
                        <h4 class="modal-title">Update Donor Profile</h4>
                    </div>
                    <div class="modal-body" v-if="model_input">
                        <div class="panel-body">
                            <div id="formOrg" v-if="type">
                                <form-generator :form="formModelOrg" :input.sync="model_input"></form-generator>
                            </div>
                            <div id="formIndv" v-else-if="!type">
                                <form-generator :form="formModelIndv" :input.sync="model_input"></form-generator>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" 
                        data-dismiss="modal"
                            class="btn btn-default" 
                            v-on:click="onSave()"
                        >Save</button>
                    </div>
                </div>

            </div>
        </div>
    
    
    `,
    props: {
        modal_id: String,
        donor   : Object
    },

    watch: {
        donor(){
            if (this.donor) {
                this.type           = this.donor.id.includes("org")
                console.log("type %o", this.type)
                this.model_input    = this.donor
            } else {
                this.model_input    = null
            }
        }
    },

    data() {
        return  {
            type         : null,
            model_input  : null,
            formModelOrg : DonorsOrganization.formModel,
            formModelIndv: DonorsIndividual.formModel,
        }
    },

    methods: {
        onSave() {
            if(AlertMessages.confirmSave('Edit Profile')) {
                this.$emit("onsave", this.model_input)
            }
        }
    }
})


Vue.component('donor-registration-component', DonorRegistrationComponent)