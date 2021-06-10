/**
 * superclass defines the model of any object created
 */
class Model {
    /** id model */
    id = ""
    /** id of the admin that created the model */
    created_by = ""
    /** date created*/
    date_created = new Date()
    /** date the model has been updated*/
    date_updated = new Date()

    /** path of picture saved */
    images = []
} //Model


/**
 * class for Status update
 */
 class StatusModel extends Model {

    /**
     * value of StatusType determining the status of the model
     * @model StatusType
     */
    status

}//StatusModel

/** static cases for status type */
const StatusType = {
    pending     : 'pending',
    approved    : 'approved',
    rejected    : 'rejected'
}

/** statics cases for form model type */
const FormModels = {
    text    : 'text',
    textarea: 'textarea',
    date    : 'date',
    datetime: 'datetime',
    number  : 'number',
    dropdown: 'dropdown',
    password: 'password',
    email   : 'email',
    compound: 'compound'
}

class FormModelsUtilities {

    /**
     * helper value for dropdown of status
     */
    static StatusDropdown = {
        title: 'Status',
        type: FormModels.dropdown,
        options: Object.keys(StatusType).map((key) => {
            return {
                title: key,
                value: key
            }
        })
    }

}

const SupplyStatus = {
    pending:        'pending',
    stored:         'stored',
    addressed:      'addressed',
    cancelled:      'cancelled',
}

class LoginUser extends Model { 

    static LoginType = {
        public  : "public",
        admin   : "admin",
        donor   : "donor"
    }

    constructor(id, date_created) {
        super()
        this.id             = id
        this.date_created   = date_created  || new Date()
    }

    /**
     * coverts instance into a JSON object
     */
    toObject() {
        return {
            id              : this.id,
            date_created    : this.date_created
        }
    }

    /**
     * converts instance into a stringified object
     */
    toStringify(){
        return JSON.stringify(this.toObject())
    }

    /**
     * returns true if the current date is greater than the created_date + 5 days
     * @returns 
     */
    isExpired(){
        let curr        = new Date()
        var addedDate   = new Date(this.date_created.getTime()+(1*24*60*60*1000));
        return curr > addedDate
    }

    static parse(object = {}) {
        return new LoginUser(
            object.id,
            object.date_updated,
        )
    }

    static parseString(string) {
        return LoginUser.parse(JSON.parse(string))
    }


}


/**
 * User object structure
 */
class AdminUser extends Model {

    firstname
    lastname
    municipality
    username
    email
    password
    admin_type
    ///contains the id of the evacuation managed
    evacuation_id

    /**
     * used to determine the type of access of user
     */
    static AdminTypes = {
        pdrrmo      : 'pdrrmo',     //higher - provincial
        mdrrmo      : 'mdrrmo',     //lower - municipal
        evacuation  : 'evacuation'  //lowest - evacuation level
    }

    static keys = ['admin_type', 'date_created', 'firstname', 'lastname', 'municipality', 'username', 'email', 'admin_type']

    constructor(id, admin_type, created_by, date_created, date_updated, firstname,
        lastname, municipality, username, email, password, images, evacuation_id) {
        super()
        this.id             = id            || keyGenID("admin")//"admin-" + genID(5)
        this.admin_type     = admin_type    || AdminUser.AdminTypes.mdrrmo
        this.created_by     = created_by
        this.date_created   = date_created  || new Date()
        this.firstname      = firstname
        this.lastname       = lastname
        this.municipality   = municipality  || 'admin'
        this.username       = username
        this.email          = email
        this.password       = password
        this.date_updated   = date_updated  || new Date()
        this.images         = images        || []
        this.evacuation_id  = evacuation_id || ""
    }

    toObject() {
        return {
            id              : this.id,
            admin_type      : this.admin_type,
            created_by      : this.created_by,
            date_created    : this.date_created,
            date_updated    : this.date_updated,
            firstname       : this.firstname,
            lastname        : this.lastname,
            municipality    : this.municipality,
            username        : this.username,
            email           : this.email,
            password        : this.password,
            images          : this.images, 
            evacuation_id   : this.evacuation_id
        }
    }

    static parse(object = {}) {
        return new AdminUser(
            object.id,
            object.admin_type,
            object.created_by,
            object.date_created,
            object.date_updated,
            object.firstname,
            object.lastname,
            object.municipality,
            object.username,
            object.email,
            object.password,
            object.images,
            object.evacuation_id
            )
    }
} //AdminUser

/**
 * object structure of Evacuation Center
 */
class EvacuationCenter extends Model {

    /**name     = "sampl1"*/
    name = "sampl1"
    /**
    * lat lng values
    * ```
    * location = {
        lat = 14.426700434748033,
        lng = 121.43130540847778
    }
    ```
    */
    location = {
        lat: null,
        lng: null
    }

    /**population_capacity = 1000*/
    population_capacity
    /**floor_space         = 2000*/
    floor_space
    /**exact_address       = "mabitac rd"*/
    exact_address
    /**municipality        = "mabitac"*/
    municipality
    /**contact_numbers     = "09171231233"*/
    contact_numbers

    /** user id that handles the evac */
    admin_id

    /** category of the the evacuation center */
    category

    /** any avialable facilities */
    facilities

    /** used for determining the status of the evacuation center */
    status

    /** remarks for the status */
    remarks 

    /** enum for the status of the evacuation center */
    static EvacuationStatus = {
        active      : "active",
        inactive    : "inactive"
    }

    

    /** used to show the data of the evacuation center */
    static headers = {
        id                 : 'Evacuation Center Code',
        name               : 'Name',
        population_capacity: 'Population Capacity',
        floor_space        : 'Area (sq)',
        exact_address      : 'Address',
        location           : 'LatLng',
        contact_numbers    : 'Contact Number',
        admin_id           : 'Evacuation Center In-charge',
        category           : 'Category',
        facilities         : 'Available Facilities',
        status             : 'Status',
        remarks            : 'Remarks'
    }

    static filter_keys = [
        'population_capacity',
        'floor_space',
        'category',
        'facilities',
        'status'
    ]

    /** static enum contains type of categories used to define Evacuation Center */
    /* static CategoryTypes = {
        dedicated_evacuation_center: 'Dedicated Evacuation Center',
        barangay_hall: 'Barangay Hall',
        school: 'School',
        chapel: 'Chapel',
        others: 'Others'
    } */

    static formModel = {
        name: {
            title: "Name",
            type: FormModels.text
        },
        population_capacity: {
            title: "Population Capacity",
            type: FormModels.number
        },
        floor_space: {
            title: 'Area (sq)',
            type: FormModels.number
        },
        contact_numbers: {
            title: 'Contact Number',
            type: FormModels.number
        },

        admin_id: {
            title   : 'Evacuation Center In-charge',
            type    : FormModels.dropdown,
            options : [],
        },

        municipality: {
            title: 'Municipality',
            type: FormModels.dropdown,
            options: []
        },

        location: {
            title: 'Location',
            type: FormModels.compound,
            compound: {
                lat: {
                    title: 'Latitude',
                    type: FormModels.number,
                },
                lng: {
                    title: 'Longitude',
                    type: FormModels.number
                }
            }
        },

        exact_address: {
            title: 'Exact Address',
            type: FormModels.textarea
        },
        
        category: {
            title: 'Category',
            type: FormModels.dropdown,
            options: []
        },

        facilities: {
            title: 'Facilities',
            type: FormModels.textarea
        },

        status: {
            title: 'Status',
            type: FormModels.dropdown,
            options: [
                {
                    title: "active",
                    value: "active"
                }
                ,
                {
                    title: "inactive",
                    value: "inactive"
                }
            ]
        },

        remarks: {
            title   : 'Remarks',
            type    :  FormModels.textarea,
            logic   : {
                key         : 'status',
                condition   : '==',
                value       : 'inactive'
            }
        }
    }

    constructor(id, name, location, population_capacity,
        floor_space, date_created = new Date(),
        date_updated = new Date(), created_by,
        exact_address, municipality, contact_numbers,
        admin_id, category, facilities, images = [],
        status, remarks) {
        super()
        this.id = id || keyGenID('evac',5)
        this.name = name
        this.location = (location != null && location != undefined) ? location : {
            lat: null,
            lng: null
        }
        this.population_capacity = population_capacity
        this.floor_space         = floor_space
        this.date_created        = date_created
        this.date_updated        = date_updated
        this.created_by          = created_by
        this.exact_address       = exact_address
        this.municipality        = municipality
        this.contact_numbers     = contact_numbers
        this.admin_id            = admin_id
        this.category            = category
        this.facilities          = facilities
        this.images              = images
        this.status              = status || EvacuationCenter.EvacuationStatus.active
        this.remarks             = remarks
    }

    /**returns instance to json object */
    toObject() {
        return {
            id                 : this.id,
            name               : this.name,
            location           : this.location,
            population_capacity: this.population_capacity,
            floor_space        : this.floor_space,
            date_created       : this.date_created,
            date_updated       : this.date_updated,
            created_by         : this.created_by,
            exact_address      : this.exact_address,
            municipality       : this.municipality,
            contact_numbers    : this.contact_numbers,
            admin_id           : this.admin_id,
            category           : this.category,
            facilities         : this.facilities,
            images             : this.images,
            status             : this.status,
            remarks            : this.remarks
        }
    }

    get(key) {
        return this.toObject()[key]
    }

    /** converts object to EvacuationCenter instance */
    static parse(object = {}) {
        let evac = new EvacuationCenter(
            object.id,
            object.name,
            object.location,
            object.population_capacity,
            object.floor_space,
            object.date_created,
            object.date_updated,
            object.created_by,
            object.exact_address,
            object.municipality,
            object.contact_numbers,
            object.admin_id,
            object.category,
            object.facilities,
            object.images,
            object.status,
            object.remarks
        )

        return evac
    }

} //EvacuationCenter


/** class for determining the type of evacuation center */
class EvacuationCenterType extends Model {
    
    //name of the type
    name

    ///used to determine if the type is available
    is_active

    static formModel = {
        name: {
            title: "Title",
            type: FormModels.text
        },
        is_active: {
            title: "Is Active",
            type: FormModels.dropdown,
            options: [
                {title: "true", value: true},
                {title: "false", value: false},
            ]
        }
    }

    constructor(id,
        date_created,
        date_updated,
        created_by, name, is_active) {
        super()
        this.id = id || keyGenID('evactype',5)
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()
        this.created_by   = created_by

        this.name = name
        this.is_active = is_active
    }

    /**returns instance to json object */
    toObject() {
        return {
            id: this.id,
            date_created: this.date_created,
            date_updated: this.date_updated,
            created_by: this.created_by,
            name: this.name,
            is_active: this.is_active,
        }
    }

    /** converts object to EvacuationCenter instance */
    static parse(object = {}) {
        return new EvacuationCenterType(
            object.id,
            object.date_created,
            object.date_updated,
            object.created_by,
            object.name,
            object.is_active,
        )
    }
}//EvacuationCenterType


/**
 * object structure of Message response from Datahandler
 */
class Message {
    /** contains the data */
    data
    /** contains error if any */
    error
} //Message

/**
 * evacuation history used on generating solutions references EvacuationCenter
 */
class EvacuationHistory extends Model {

    evac_id = null
    current_population = 0
    report_date = new Date()


    static formModel = {
        evac_id: {
            title: "Evacuation Center",
            type: FormModels.dropdown,
            options: [],
        },
        current_population: {
            title: "Population",
            type: FormModels.number,
        },
        report_date: {
            title: "Report Date",
            type: FormModels.date
        }
    }


    constructor(id = null, evac_id = null, current_population = 0, created_by = 0, report_date, date_created, date_updated) {
        super()
        this.id = id || keyGenID('history',5)//"history-" + genID(5)
        this.evac_id = evac_id
        this.current_population = current_population
        this.created_by = created_by
        this.report_date = report_date || new Date()
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()
    }

    /**returns instance to json object */
    toObject() {
        return {
            id: this.id,
            evac_id: this.evac_id,
            current_population: this.current_population,
            created_by: this.created_by,
            date_created: this.date_created,
            report_date: this.report_date,
            date_updated: this.date_updated
        }
    }

    /** converts object to EvacuationCenter instance */
    static parse(object = {}) {
        let evac = new EvacuationHistory(
            object.id,
            object.evac_id,
            object.current_population,
            object.created_by,
            object.report_date,
            object.date_created,
            object.date_updated
        )

        return evac
    }

} //EvacuationHistory


/**
 * object used in generating results
 */
class MOABCParameters extends Model {
    max_length
    max_val
    population_size
    trial_limit
    max_epoch
    min_shuffle
    max_shuffle
    active

    static parameters_shown = {
        id             : 'id',
        date_created   : 'Date Created',
        date_updated   : 'Date Updated',
        created_by     : 'Created By User',
        max_length     : 'Maximum Number of Nectars per Food Source',
        population_size: 'Maximum # of Population',
        trial_limit    : 'Trial Limit',
        max_epoch      : 'Maximum Generation',
        is_active      : 'Is Active'
    }

    constructor(id, date_created, date_updated, created_by, max_length, max_val, population_size, trial_limit, max_epoch, min_shuffle, max_shuffle, is_active) {
        super()
        this.id = id || keyGenID("param", 5)//"param-" + genID(5)
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()
        this.created_by = created_by || '0'
        this.max_length = max_length || 0
        this.max_val = max_val || 0
        this.population_size = population_size || 0
        this.trial_limit = trial_limit || 0
        this.max_epoch = max_epoch || 0
        this.min_shuffle = min_shuffle || 0
        this.max_shuffle = max_shuffle || 0
        this.is_active  = is_active || false
    }

    static parse(objects = {}) {
        return new MOABCParameters(
            objects.id,
            objects.date_created,
            objects.date_updated,
            objects.created_by,
            objects.max_length,
            objects.max_val,
            objects.population_size,
            objects.trial_limit,
            objects.max_epoch,
            objects.min_shuffle,
            objects.max_shuffle,
            objects.is_active
        )
    }

    toObject() {
        return {
            id: this.id,
            date_created: this.date_created,
            date_updated: this.date_updated,
            created_by: this.created_by,
            max_length: this.max_length,
            max_val: this.max_val,
            population_size: this.population_size,
            trial_limit: this.trial_limit,
            max_epoch: this.max_epoch,
            min_shuffle: this.min_shuffle,
            max_shuffle: this.max_shuffle,
            is_active: this.is_active
        }
    }

} //MOABCParameters

class InventoryType extends Model {

    /** name of the inventory */
    name = ""

    /** description of the inventory */
    description = ""

    /** supplies of the inventory array `EvacuationSupply` not store on the database */
    supplies = []

}

/**
 * object defines the inventory/warehouse of the evacuation center
 */
class EvacuationInventory extends InventoryType {

    /** id of the evacuation */
    evac_id = ""

    constructor(id, date_created, date_updated, created_by, evac_id, name, description) {
        super()
        this.id = id || keyGenID("evacinv") //"evacinv-" + genID(5)
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()
        this.created_by = created_by || '0'
        this.evac_id = evac_id
        this.name = name
        this.description = description
    }

    static parse(objects = {}) {
        return new EvacuationInventory(
            objects.id,
            objects.date_created,
            objects.date_updated,
            objects.created_by,
            objects.evac_id,
            objects.name,
            objects.description,
        )
    }

    /** returns object 
     *  - doesnt include supplies */
    toObject() {
        return {
            id: this.id,
            date_created: this.date_created,
            date_updated: this.date_updated,
            created_by: this.created_by,
            evac_id: this.evac_id,
            name: this.name,
            description: this.description,
        }
    }

} //EvacuationInventory

/**
 * object defines the inventory for the municipal
 */
class MunicipalInventory extends InventoryType {

    /** municipal that uses the inventory*/
    municipality = ""


    constructor(id, date_created, date_updated, created_by, municipality, name, description) {
        super()
        this.id = id || keyGenID("muninv")//"muninv-" + genID(5)
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()
        this.created_by = created_by || '0'
        this.municipality = municipality
        this.name = name
        this.description = description
    }

    static parse(objects = {}) {
        return new MunicipalInventory(
            objects.id,
            objects.date_created,
            objects.date_updated,
            objects.created_by,
            objects.municipality,
            objects.name,
            objects.description,
        )
    }

    /** returns object 
     *  - doesnt include supplies */
    toObject() {
        return {
            id: this.id,
            date_created: this.date_created,
            date_updated: this.date_updated,
            created_by: this.created_by,
            municipality: this.municipality,
            name: this.name,
            description: this.description,
        }
    }
}

/**
 * object defines the inventory supply
 */
class EvacuationSupply extends Model {

    /** id of the inventory reference can either be from Municipal or Evacuation*/
    inventory_id = ""

    /** type of supply definition */
    inventory_type = ""

    /** number of quantity */
    qty = 0

    /** date of the item supplied */
    date_supplied = new Date()

    /** status of the supply given */
    status = SupplyStatus.pending

    /** any remarks or descriptions */
    remarks = ""

    /** log data of the supply */
    logs = [] // [String]

    static formModel = {
        inventory_type : {
            type: FormModels.dropdown,
            title: 'Supply Type',
            options: []
        },

        qty: {
            type: FormModels.number,
            title: '# of Quantity',
        },

        date_supplied: {
            type: FormModels.date,
            title: 'Date Supplied',
        },

        status: {
            type: FormModels.dropdown,
            title: 'Supply Status',
            options: Object.keys(SupplyStatus).map((key) => {
                return {
                    title: key,
                    value: key
                }
            })
        },

        remarks: {
            type: FormModels.textarea,
            title: 'Remarks'
        }
    }


    constructor(id, date_created, date_updated, created_by, inventory_id, inventory_type, qty, date_supplied, remarks, status, logs) {
        super()
        this.id = id || "evacsupply-" + genID(5)
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()
        this.created_by = created_by || '0'
        this.inventory_id = inventory_id
        this.inventory_type = inventory_type
        this.qty = qty
        this.date_supplied = date_supplied
        this.remarks = remarks
        this.status  = status || SupplyStatus.pending

        if (typeof logs == "string") {
            this.logs = [logs]
        } else {
            this.logs = logs || ["Created Entry"]
        }
    }

    static parse(objects = {}) {
        return new EvacuationSupply(
            objects.id,
            objects.date_created,
            objects.date_updated,
            objects.created_by,
            objects.inventory_id,
            objects.inventory_type,
            objects.qty,
            objects.date_supplied,
            objects.remarks,
            objects.status,
            objects.logs || []
        )
    }

    addLog(value) {
        this.logs.push(value + " Date: " + (new Date()))
    }

    toObject() {
        return {
            id: this.id,
            date_created: this.date_created,
            date_updated: this.date_updated,
            created_by: this.created_by,
            inventory_id: this.inventory_id,
            inventory_type: this.inventory_type,
            qty: this.qty,
            date_supplied: this.date_supplied,
            remarks: this.remarks,
            status: this.status,
            logs: this.logs
        }
    }
} //EvacuationSupply

/**
 * defines the type of evacuation supply is given
 */
class EvacuationSupplyType extends Model {

    /** name of the item */
    name = ""
    /** description of the item */
    description = ""
    /** amount per package given */
    amount = 0

    constructor(id, date_created, date_updated, created_by, name, description, amount) {
        super()
        this.id = id || keyGenID("evacsupplytype")//"evacsupplytype-" + genID(5)
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()
        this.created_by = created_by || '0'
        this.name = name
        this.description = description
        this.amount = amount
    }

    static parse(objects = {}) {
        return new EvacuationSupplyType(
            objects.id,
            objects.date_created,
            objects.date_updated,
            objects.created_by,
            objects.name,
            objects.description,
            objects.amount,
        )
    }

    toObject() {
        return {
            id: this.id,
            date_created: this.date_created,
            date_updated: this.date_updated,
            created_by: this.created_by,
            name: this.name,
            description: this.description,
            amount: this.amount,
        }
    }
} //EvacuationSupplyType


/** defines the object of Public User */
class PublicUser extends StatusModel {

    /** firstname of the public */
    firstname

    /** lastname of the public */
    lastname

    /** middleinit of the public */
    middleinit

    /** municipality the user is created */
    municipality

    /** username of the user used to login */
    username

    /** password of the user used to login */
    password

    /** email of the user used */
    email

    /** birthdate of the user */
    birthdate

    /** phone number the user used*/
    phone_number

    /** home address of the user*/
    address

    /** sex/gender 0 male, 1 female */
    sex

    /** determines if the person has disabilities*/
    disabilities

    /** employment */
    employment

    /** medical needs */
    medical_needs

    /** number of dependents*/
    //number_dependents

    /** array contains dependents users */
    dependents = []

    /** used to determine if the public user is admitted to an evacuation center : reflects user history */
    is_active = false

    static headers = {
        id: 'ID',
        created_by: 'Issued By',
        date_created: 'Date Created',
        date_updated: 'Date Updated',
        firstname: 'Firstname',
        lastname: 'Lastname',
        middleinit: 'MiddleInit',
        municipality: 'Municipality',
        username: 'Username',
        password: 'Password',
        email: 'Email',
        birthdate: 'Birthdate',
        phone_number: 'Contact Number',
        address: 'Exact Address',
        sex: 'Sex',
        disabilities: 'Disabilities',
        employment: 'Employment',
        medical_needs: 'Medical Needs',
        is_active: 'Is Admitted',
        status: 'Status'
    }

    static visiblekeys = [
        'firstname',
        'lastname',
        'middleinit',
        'municipality',
        'username',
        'email',
        'birthdate',
        'phone_number',
        'address',
        'sex',
        'disabilities',
        'employment',
        'medical_needs',
        'is_active',
        'status'
    ]

    /** defines the form of the model to be shown to create an entry */
    static formModel = {
        firstname: {
            title: 'Firstname',
            type: FormModels.text
        },
        lastname: {
            title: 'Lastname',
            type: FormModels.text
        },
        middleinit: {
            title: 'MiddleInit',
            type: FormModels.text
        },
        municipality: {
            title: 'Municipality',
            type: FormModels.dropdown,
            options: []
        },
        username: {
            title: 'Username',
            type: FormModels.text
        },
        password: {
            title: 'Password',
            type: FormModels.password
        },
        email: {
            title: 'Email',
            type: FormModels.email
        },
        birthdate: {
            title: 'Birthdate',
            type: FormModels.date
        },
        phone_number: {
            title: 'Contact Number',
            type: FormModels.text
        },
        address: {
            title: 'Exact Address',
            type: FormModels.textarea
        },
        sex: {
            title: 'Sex',
            type: FormModels.dropdown,
            options: [{
                    title: 'Male',
                    value: 0
                },
                {
                    title: 'Female',
                    value: 1
                }
            ]
        },
        disabilities: {
            title: 'Disabilities',
            type: FormModels.textarea
        },
        employment: {
            title: 'Employment',
            type: FormModels.textarea
        },
        medical_needs: {
            title: 'Medical Needs',
            type: FormModels.textarea
        },
        /* number_dependents: {
            title: 'Number of Dependents',
            type: FormModels.number
        }, */
    }



    constructor(id, created_by, date_created, date_updated, firstname, lastname, middleinit,
        municipality, username, password, email, birthdate, phone_number, address, sex,
        disabilities, employment, medical_needs, dependents, is_active, status, images) {
        super()
        this.id = id || keyGenID("publicuser", 5) //"publicuser-" + genID(5)
        this.created_by = created_by
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()

        this.firstname = firstname
        this.lastname = lastname
        this.middleinit = middleinit || ""
        this.municipality = municipality
        this.username = username
        this.password = password
        this.email = email || ""
        this.birthdate = birthdate
        this.phone_number = phone_number || ""
        this.address = address || ""
        this.sex = sex || 0
        this.disabilities = disabilities || ""
        this.employment = employment || ""
        this.medical_needs = medical_needs || ""
        this.is_active  = is_active  || false
        this.status     = status || StatusType.pending
        this.images     = images || []

        this.dependents = (dependents || []).map((dep) => {
            return DependentUser.parse(dep)
        })
    }

    toObject() {
        return {
            id           : this.id,
            created_by   : this.created_by,
            date_created : this.date_created,
            date_updated : this.date_updated,
            firstname    : this.firstname,
            lastname     : this.lastname,
            middleinit   : this.middleinit,
            municipality : this.municipality,
            username     : this.username,
            password     : this.password,
            email        : this.email,
            birthdate    : this.birthdate,
            phone_number : this.phone_number,
            address      : this.address,
            sex          : this.sex,
            disabilities : this.disabilities,
            employment   : this.employment,
            medical_needs: this.medical_needs,
            dependents   : (this.dependents || []).map((val) => {
                return val.toObject()
            }),
            is_active: this.is_active,
            status   : this.status,
            images   : this.images
        }
    }

    get(key) {
        return this.toObject()[key]
    }

    static parse(object = {}) {
        return new PublicUser(
            object.id,
            object.created_by,
            object.date_created,
            object.date_updated,
            object.firstname,
            object.lastname,
            object.middleinit,
            object.municipality,
            object.username,
            object.password,
            object.email,
            object.birthdate,
            object.phone_number,
            object.address,
            object.sex,
            object.disabilities,
            object.employment,
            object.medical_needs,
            object.dependents,
            object.is_active,
            object.status,
            object.images
        )
    }
} //PublicUser

class DependentUser extends PublicUser {

    static formDependent = [
        'firstname',
        'lastname',
        'middleinit',
        'email',
        'birthdate',
        'phone_number',
        'sex',
        'disabilities',
        'medical_needs'
    ]

    constructor(id, created_by, date_created, date_updated, firstname, lastname, middleinit,
        email, birthdate, phone_number, sex,
        disabilities, medical_needs) {
        super()
        this.id = id || keyGenID("depuser", 5) //"depuser-" + genID(5)
        this.created_by = created_by
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()

        this.firstname = firstname
        this.lastname = lastname
        this.middleinit = middleinit

        this.email = email || ""
        this.birthdate = birthdate
        this.phone_number = phone_number || ""
        this.sex = sex || 0
        this.disabilities = disabilities || ""
        this.medical_needs = medical_needs || ""
    }

    toObject() {
        return {
            id: this.id,
            created_by: this.created_by,
            date_created: this.date_created,
            date_updated: this.date_updated,
            firstname: this.firstname,
            lastname: this.lastname,
            middleinit: this.middleinit,
            email: this.email,
            birthdate: this.birthdate,
            phone_number: this.phone_number,
            sex: this.sex,
            disabilities: this.disabilities,
            medical_needs: this.medical_needs,
        }
    }

    static parse(object = {}) {
        return new DependentUser(
            object.id,
            object.created_by,
            object.date_created,
            object.date_updated,
            object.firstname,
            object.lastname,
            object.middleinit,
            object.email,
            object.birthdate,
            object.phone_number,
            object.sex,
            object.disabilities,
            object.medical_needs,
        )
    }
}//DependentUser




/** defines the object of history of each public user */
class PublicUserHistory extends StatusModel {

    /** user id of the history */
    user_id
    /** evac id of the evacuation center*/
    evac_id

    /** municipality of the evacuation center */
    municipality

    /** date admitted */
    date_admitted
    /** date where the user has signed out */
    date_cleared

    static formModel = {
        evac_id: {
            title: 'Evacuation Center', 
            type: FormModels.dropdown,
            options: []
        },
        date_admitted: {
            title: 'Date Admitted',
            type: FormModels.datetime,
        },
        date_cleared: {
            title: 'Date Cleared',
            type: FormModels.datetime
        }, 
    }

    static headers = [
        'user_id',
        'evac_id',
        'municipality',
        'date_admitted',
        'date_cleared',
        'date_created',
        'date_updated',
    ]

    static headers_admission = [
        'user_id',
        'evac_id',
        'municipality',
        'date_admitted',
        'date_created',
        'date_updated',
    ]
    

    constructor(id, date_created, date_updated, created_by, user_id, evac_id, date_admitted, date_cleared, municipality, status) {
        super()
        this.id = id || keyGenID("publicuserhistory") //"publicuserhistory-" + genID(5)
        this.date_created   = date_created  || new Date()
        this.date_updated   = date_updated  || new Date()
        this.date_admitted  = date_admitted || new Date()
        this.date_cleared   = date_cleared  || ""
        this.created_by     = created_by    || '0'
        this.municipality   = municipality  || ""
        this.user_id        = user_id
        this.evac_id        = evac_id
        this.status         = status        || StatusType.pending
    }


    toObject() {
        return {
            id           : this.id,
            date_created : this.date_created,
            date_updated : this.date_updated,
            date_admitted: this.date_admitted,
            date_cleared : this.date_cleared,
            created_by   : this.created_by,
            user_id      : this.user_id,
            evac_id      : this.evac_id,
            municipality : this.municipality,
            status       : this.status
        }
    }

    static parse(object = {}) {
        return new PublicUserHistory(
            object.id,
            object.date_created,
            object.date_updated,
            object.created_by,
            object.user_id,
            object.evac_id,
            object.date_admitted,
            object.date_cleared,
            object.municipality,
            object.status
        )
    }

} //PublicUserHistory

class DonorModel extends StatusModel {

    /** password used for login */
    password

}

/** defines the object of an organization donor */
class DonorsOrganization extends DonorModel {

    /** name of the organization */
    name

    /** nature of business */
    business

    /** address */
    address

    /** email */
    email

    /** contact number */
    phone_number

    /** name of the person to be accounted for */
    contact_person

    /** email of the person to be accounted for */
    contact_email

    /** phone of the person to be accounted for */
    contact_phone_number

    

    static headers = {
        id                  : 'ID',
        created_by          : 'Issued By',
        date_created        : 'Date Created',
        date_updated        : 'Date Updated',
        name                : 'Name',
        business            : 'Nature of Business',
        phone_number        : 'Contact Number',
        email               : "Email",
        address             : 'Exact Address',
        contact_person      : 'Contact Person',
        contact_email       : 'Contact Email',
        contact_phone_number: 'Personal Contact Number',
        status              : 'Status'
    }

    ///for displaying content on public
    static visiblekeys = [
        'id',
        'name',
        'business',
        'email',
        'phone_number',
        'address',
        'contact_person',
        'contact_email',
        'contact_phone_number',
        'status',
        'date_created',
        'date_updated',
    ]

    /** defines the form of the model to be shown to create an entry */
    static formModel = {
        name: {
            title: 'Name',
            type: FormModels.text
        },
        business: {
            title: 'Nature of Business',
            type: FormModels.text
        },
        
        email: {
            title: 'Email',
            type: FormModels.email
        },

        phone_number: {
            title: 'Contact Number',
            type: FormModels.text
        },

        address: {
            title: 'Address',
            type: FormModels.textarea
        },

        contact_person: {
            title: 'Contact Name',
            type: FormModels.text
        },
        contact_email: {
            title: 'Contact Email',
            type: FormModels.text
        },
        contact_phone_number: {
            title: 'Personal Phone Number',
            type: FormModels.text
        },
    }

    constructor(id, created_by, date_created, date_updated,
        name, business, address,
        email, phone_number, contact_person,
        contact_email, contact_phone_number, 
        status,
        images, password) {
        super()
        this.id                   = id || keyGenID("donororg")  //"donororg-" + genID(5)
        this.created_by           = created_by || '0'
        this.date_created         = date_created || new Date()
        this.date_updated         = date_updated || new Date()
        this.name                 = name
        this.business             = business
        this.address              = address
        this.email                = email
        this.phone_number         = phone_number
        this.contact_person       = contact_person
        this.contact_email        = contact_email
        this.contact_phone_number = contact_phone_number
        this.status               = status || StatusType.pending
        this.images               = images || []
        this.password             = password || ""
    }

    toObject() {
        return {
            id                  : this.id,
            created_by          : this.created_by,
            date_created        : this.date_created,
            date_updated        : this.date_updated,
            name                : this.name,
            business            : this.business,
            address             : this.address,
            email               : this.email,
            phone_number        : this.phone_number,
            contact_person      : this.contact_person,
            contact_email       : this.contact_email,
            contact_phone_number: this.contact_phone_number,
            status              : this.status,
            images              : this.images,
            password            : this.password
        }
    }

    copy(){
        return DonorsOrganization.parse(this.toObject())
    }

    static parse(object = {}) {
        return new DonorsOrganization(
            object.id,
            object.created_by,
            object.date_created,
            object.date_updated,
            object.name,
            object.business,
            object.address,
            object.email,
            object.phone_number,
            object.contact_person,
            object.contact_email,
            object.contact_phone_number,
            object.status,
            object.images,
            object.password
        )
    }
} //DonorsOrganization

/** defines the model of an individual donor */
class DonorsIndividual extends DonorModel {

    /** firstname of the public */
    firstname

    /** lastname of the public */
    lastname

    /** middleinit of the public */
    middleinit

    /** email of the user used */
    email

    /** birthdate of the user */
    birthdate

    /** phone number the user used*/
    phone_number

    /** home address of the user*/
    address

    /** sex/gender 0 male, 1 female */
    sex

    /** position */
    employment_position
    /** nature of business */
    employment_business


    static headers = {
        id: 'ID',
        created_by: 'Issued By',
        date_created: 'Date Created',
        date_updated: 'Date Updated',
        firstname: 'Firstname',
        lastname: 'Lastname',
        middleinit: 'MiddleInit',
        email: 'Email',
        birthdate: 'Birthdate',
        phone_number: 'Contact Number',
        address: 'Exact Address',
        sex: 'Sex',
        employment_position: 'Employment Position',
        employment_business: 'Nature of Business',
        status : 'Status'
    }

    ///visible keys for public view
    static visiblekeys = [
        'id',
        'firstname',
        'lastname',
        'middleinit',
        'email',
        'birthdate',
        'phone_number',
        'address',
        'sex',
        'employment_position',
        'employment_business',
        'status',
        'date_created',
        'date_updated',
    ]

    /** defines the form of the model to be shown to create an entry */
    static formModel = {
        firstname: {
            title: 'Firstname',
            type: FormModels.text
        },
        lastname: {
            title: 'Lastname',
            type: FormModels.text
        },
        middleinit: {
            title: 'MiddleInit',
            type: FormModels.text
        },
        email: {
            title: 'Email',
            type: FormModels.email
        },
        birthdate: {
            title: 'Birthdate',
            type: FormModels.date
        },
        phone_number: {
            title: 'Contact Number',
            type: FormModels.text
        },
        address: {
            title: 'Exact Address',
            type: FormModels.textarea
        },
        sex: {
            title: 'Sex',
            type: FormModels.dropdown,
            options: [{
                    title: 'Male',
                    value: 0
                },
                {
                    title: 'Female',
                    value: 1
                }
            ]
        },
        employment_position: {
            title: 'Employment Position',
            type: FormModels.text
        },
        employment_business: {
            title: 'Nature of Business',
            type: FormModels.textarea
        },
    }

    constructor(id, created_by, date_created, date_updated, firstname, lastname, middleinit,
        email, birthdate, phone_number, address, sex,
        employment_position, employment_business, status, images, password) {
        super()
        this.id           = id || keyGenID("donorindv", 5)  //"publicuser-" + genID(5)
        this.created_by   = created_by || '0'
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()

        this.firstname           = firstname
        this.lastname            = lastname
        this.middleinit          = middleinit
        this.email               = email || ""
        this.birthdate           = birthdate
        this.phone_number        = phone_number || ""
        this.address             = address || ""
        this.sex                 = sex || 0
        this.employment_position = employment_position || ""
        this.employment_business = employment_business || ""
        this.status              = status || StatusType.pending
        this.images              = images || []
        this.password            = password || ""
    }

    toObject() {
        return {
            id                 : this.id,
            created_by         : this.created_by,
            date_created       : this.date_created,
            date_updated       : this.date_updated,
            firstname          : this.firstname,
            lastname           : this.lastname,
            middleinit         : this.middleinit,
            email              : this.email,
            birthdate          : this.birthdate,
            phone_number       : this.phone_number,
            address            : this.address,
            sex                : this.sex,
            employment_position: this.employment_position,
            employment_business: this.employment_business,
            status             : this.status,
            images             : this.images,
            password           : this.password
        }
    }

    /**
     * returns a copy of the instance
     * @returns 
     */
    copy(){
        return DonorsIndividual.parse(this.toObject())
    }

    static parse(object = {}) {
        return new DonorsIndividual(
            object.id,
            object.created_by,
            object.date_created,
            object.date_updated,
            object.firstname,
            object.lastname,
            object.middleinit,
            object.email,
            object.birthdate,
            object.phone_number,
            object.address,
            object.sex,
            object.employment_position,
            object.employment_business,
            object.status,
            object.images,
            object.password
        )
    }
} //DonorsIndividual


/* !=========== PUBLIC REPORTS =============*/
class ReportType extends Model  {
     
    /** public user */
    user_id

    /** evac id appointing to can be empty */
    evac_id = ""

    /** items to be report to ask for evacuation supplies 
     * @model ReportItemType
    */
    reports = []

    /** used to determine the status of the request
     * @model SupplyStatus | string
     */
    status = ""

    static formModel = {
        evac_id: {
            title: 'Evacuation Center', 
            type: FormModels.dropdown,
            options: []
        },
    }

    static headers = [
        'user_id',
        'evac_id',
        'date_created',
        'date_updated',
        'status'
    ]

    toObject() {
        return {
            id          : this.id,
            date_created: this.date_created,
            date_updated: this.date_updated,
            created_by  : this.created_by,
            user_id     : this.user_id,
            evac_id     : this.evac_id,
            reports     : this.reports,
            status      : this.status,
        }
    }

}//ReportType

/** individual items to be given/requested on the reporttype */
class ReportItemType {

    ///id type of inventory
    inventory_type

    ///qty
    qty

    ///remarks
    remarks

    /** used to create a custom item 
     * @model EvacuationSupplyType
    */
    custom = {}

    static reportItemFormModel = {
        inventory_type: {
            title: 'Supply Type',
            type: FormModels.dropdown,
            options: [] 
        },
        qty: {
            title: 'QTY',
            type: FormModels.number
        },
        remarks: {
            title: 'Remarks',
            type: FormModels.textarea
        }
    }

}//ReportItemType

/** defines the model of the report to be requested by the public user */
class PublicUserReport extends ReportType {
    
    comments = []

    constructor(id, date_created, date_updated, created_by, user_id, evac_id, reports, status) {
        super()
        this.id = id || keyGenID("publicuserreport") //"publicuserhistory-" + genID(5)
        this.date_created = date_created    || new Date()
        this.date_updated = date_updated    || new Date()
        this.created_by = created_by        || '0'
        this.user_id    = user_id
        this.evac_id    = evac_id
        this.reports    = reports           || []
        this.status     = status            || SupplyStatus.pending
    }

    static parse(object = {}) {
        return new PublicUserReport(
            object.id,
            object.date_created,
            object.date_updated,
            object.created_by,
            object.user_id,
            object.evac_id,
            object.reports,
            object.status
        )
        
    }

}//PublicUserReport


/**
 * public user supply given by the evacuation
 */
class PublicUserSupply extends ReportType {

    supply_id = ""
    remarks   = ""
    qty       = 0

    constructor(id, date_created,
        date_updated, created_by,
        user_id, inventory_id,
        evac_id, supply_id,
        remarks, qty) {
        super()
        this.id           = id || keyGenID("publicusersupply")       //"publicuserhistory-" + genID(5)
        this.date_created = date_created    || new Date()
        this.date_updated = date_updated    || new Date()
        this.created_by   = created_by      || '0'
        this.user_id      = user_id
        this.inventory_id = inventory_id
        this.evac_id      = evac_id         || ""
        this.supply_id    = supply_id       || []
        this.remarks      = remarks
        this.qty          = qty
    }

    static parse(object = {}) {
        return new PublicUserSupply(
            object.id,
            object.date_created,
            object.date_updated,
            object.created_by,
            object.user_id,
            object.inventory_id,
            object.evac_id,
            object.supply_id,
            object.remarks,
            object.qty
        )
    }

    toObject() {
        return {
            id              : this.id,
            date_created    : this.date_created,
            date_updated    : this.date_updated,
            created_by      : this.created_by,
            user_id         : this.user_id,
            inventory_id    : this.inventory_id,
            evac_id         : this.evac_id,
            supply_id       : this.supply_id,
            remarks         : this.remarks,
            qty             : this.qty
        }
    }
}//PublicUserSupply

/**
 * model for comments of the user report by any public user
 */
class PublicUserComment extends Model { 

    comment     = ""
    report_id
    user_id

    constructor(id, date_created, date_updated, created_by, user_id, report_id, comment) {
        super()
        this.id             = id || keyGenID("publicusercomment")
        this.date_created   = date_created    || new Date()
        this.date_updated   = date_updated    || new Date()
        this.created_by     = created_by      || '0'
        this.user_id        = user_id
        this.report_id      = report_id
        this.comment        = comment
    }

    static parse(object = {}) {
        return new PublicUserComment(
            object.id          ,
            object.date_created,
            object.date_updated,
            object.created_by  ,
            object.user_id     ,
            object.report_id   ,
            object.comment     ,
        )
    }

    toObject() {
        return {
            id          : this.id          ,
            date_created: this.date_created,
            date_updated: this.date_updated,
            created_by  : this.created_by  ,
            user_id     : this.user_id     ,
            report_id   : this.report_id   ,
            comment     : this.comment     ,
        }
    }

}//PublicUserComment

/** defines the model of a donor to send donations */
class DonorsReport extends ReportType {

    constructor(id, date_created, date_updated, created_by, user_id,  evac_id, reports, status) {
        super()
        this.id = id || keyGenID("donorreport") //"publicuserhistory-" + genID(5)
        this.date_created = date_created    || new Date()
        this.date_updated = date_updated    || new Date()
        this.created_by = created_by        || '0'
        this.user_id    = user_id
        this.evac_id    = evac_id || ""
        this.reports    = reports || []
        this.status     = status || SupplyStatus.pending
    }

    static parse(object = {}) {
        return new DonorsReport(
            object.id,
            object.date_created,
            object.date_updated,
            object.created_by,
            object.user_id,
            object.evac_id,
            object.reports,
            object.status,
        )
    }

}//DonorsReport
/* =========== PUBLIC REPORTS =============! */

/** defines the model of the content to be shown on the public */
class PublicContent extends Model {

    /** title of the content */
    title
    /** path of the file from the server */
    path

    static headers = {
        id: 'ID',
        created_by: 'Issued By',
        date_created: 'Date Created',
        date_updated: 'Date Updated',
        title: 'Title',
        path: 'Path',
        images: 'Images'
    }

    constructor(id, date_created, date_updated, created_by,
        title, path, images) {
        super()
        this.id = id || keyGenID('content', 5)
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()
        this.created_by = created_by

        this.title = title
        this.path = path
        this.images = images || []
    }

    toObject() {
        return {
            id: this.id,
            date_created: this.date_created,
            date_updated: this.date_updated,
            created_by: this.created_by,
            title: this.title,
            path: this.path,
            images: this.images 
        }
    }

    static parse(object = {}) {
        return new PublicContent(
            object.id,
            object.date_created,
            object.date_updated,
            object.created_by,
            object.title,
            object.path,
            object.images
        )
    }
} //PublicContent


/** defines the model of an event to be shown on the public */
class PublicEvent extends Model {
    /** title of the event */
    title
    /** content of the public can be html format */
    content

    /** start date of the event */
    date_start

    /** end date of the event */
    date_end

    static headers = {
        title: 'Title',
        content: 'Content',
        date_start: 'Start Date',
        date_end: 'End Date'
    }

    static formModel = {
        title: {
            title: 'Title',
            type: FormModels.text
        },
        content: {
            title: 'Content',
            type: FormModels.textarea
        },
        date_start: {
            title: 'Start Date',
            type: FormModels.datetime
        },
        date_end: {
            title: 'End Date',
            type: FormModels.datetime
        }
    }

    constructor(id, date_created, date_updated, created_by,
        title, content, date_start, date_end) {
        super()

        this.id = id || keyGenID('content', 5)
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()
        this.created_by = created_by

        this.title = title
        this.content = content

        this.date_start = date_start
        this.date_end = date_end || ""
    }

    toObject() {
        return {
            id: this.id,
            date_created: this.date_created,
            date_updated: this.date_updated,
            created_by: this.created_by,
            title: this.title,
            content: this.content,
            date_start: this.date_start,
            date_end: this.date_end
        }
    }

    static parse(object = {}) {
        return new PublicEvent(
            object.id,
            object.date_created,
            object.date_updated,
            object.created_by,
            object.title,
            object.content,
            object.date_start,
            object.date_end
        )
    }

} //PublicEvent


/** defines the model of a file to be available/shown on the public */
class PublicDocument extends Model {
    /** title of the file */
    title

    /** description of the title*/
    description

    /** file destination saved on the server */
    path

    static formModel = {
        title: {
            title: 'Title',
            type: FormModels.text
        },
        description: {
            title: 'Description',
            type: FormModels.textarea
        },
    }

    constructor(id, date_created, date_updated, created_by,
        title, description, path) {
        super()
        this.id = id || keyGenID('document', 5)
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()
        this.created_by = created_by

        this.title = title
        this.description = description || ""
        this.path = path || ""
    }

    toObject() {
        return {
            id: this.id,
            date_created: this.date_created,
            date_updated: this.date_updated,
            created_by: this.created_by,
            title: this.title,
            description: this.description,
            path: this.path,
        }
    }

    static parse(object = {}) {
        return new PublicDocument(
            object.id,
            object.date_created,
            object.date_updated,
            object.created_by,
            object.title,
            object.description,
            object.path,
        )
    }

} //PublicDocument

/** defines the model shown on information and contact of the public website */
class PublicInformation extends PublicContent {

    /** email information for the website */
    email

    /** phone numbers available */
    contact_numbers = []

    /** social media links */
    other_links = []

    constructor(id, date_created, date_updated, created_by,
        path, email, contact_numbers, other_links) {
        super(id || keyGenID('information', 5), date_created, date_updated, created_by)
        this.path = path || ""
        this.email = email || ""
        this.contact_numbers = contact_numbers || []
        this.other_links = other_links || []
    }

    toObject() {
        return {
            id: this.id,
            date_created: this.date_created,
            date_updated: this.date_updated,
            created_by: this.created_by,
            path: this.path,
            email: this.email,
            contact_numbers: this.contact_numbers,
            other_links: this.other_links,
        }
    }

    static parse(object = {}) {
        return new PublicInformation(
            object.id,
            object.date_created,
            object.date_updated,
            object.created_by,
            object.path,
            object.email,
            object.contact_numbers,
            object.other_links,
        )
    }

} //PublicInformation

class PublicGallery extends PublicDocument {

    constructor(id, date_created, date_updated, created_by,
        title, description, images) {
        super()
        this.id = id || keyGenID('gallery', 5)
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()
        this.created_by = created_by

        this.title = title
        this.description = description || ""
        this.images = images || []
    }

    toObject() {
        return {
            id: this.id,
            date_created: this.date_created,
            date_updated: this.date_updated,
            created_by: this.created_by,
            path: this.path,
            title: this.title,
            description: this.description,
            images: this.images,
        }
    }

    static parse(object = {}) {
        return new PublicGallery(
            object.id,
            object.date_created,
            object.date_updated,
            object.created_by,
            object.title,
            object.description,
            object.images,
        )
    }

}