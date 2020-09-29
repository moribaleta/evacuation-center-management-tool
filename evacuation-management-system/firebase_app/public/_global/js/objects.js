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

    /** used to show the data of the evacuation center */
    static headers = {
        id: 'Evacuation Center Code',
        name : 'Name',
        population_capacity: 'Population Capacity',
        floor_space: 'Area (sq)',
        exact_address: 'Address',
        location: 'LatLng',
        contact_numbers: 'Contact Number',
        admin_id: 'Evacuation Center In-charge',
        category: 'Category',
        facilities: 'Available Facilities',
    }

    /** static enum contains type of categories used to define Evacuation Center */
    static CategoryTypes = {
        dedicated_evacuation_center: 'Dedicated Evacuation Center',
        barangay_hall: 'Barangay Hall',
        school: 'School',
        chapel: 'Chapel',
        others: 'Others'
    }

    constructor(id, name, location, population_capacity,
         floor_space, date_created = new Date(),
          date_updated = new Date(), created_by,
           exact_address, municipality, contact_numbers,
           admin_id, category, facilities, images = []) {
        super()
        this.id = id || "evac-" + genID(5)
        this.name = name
        this.location = (location != null && location != undefined) ? location : {
            lat: null,
            lng: null
        }
        this.population_capacity  = population_capacity
        this.floor_space          = floor_space
        this.date_created         = date_created
        this.date_updated         = date_updated
        this.created_by           = created_by
        this.exact_address        = exact_address
        this.municipality         = municipality
        this.contact_numbers      = contact_numbers
        this.admin_id             = admin_id
        this.category             = category
        this.facilities           = facilities
        this.images               = images
    }

    /**returns instance to json object */
    toObject() {
        return {
            id                  : this.id,
            name                : this.name,
            location            : this.location,
            population_capacity : this.population_capacity,
            floor_space         : this.floor_space,
            date_created        : this.date_created,
            date_updated        : this.date_updated,
            created_by          : this.created_by,
            exact_address       : this.exact_address,
            municipality        : this.municipality,
            contact_numbers     : this.contact_numbers,
            admin_id            : this.admin_id,
            category            : this.category,
            facilities          : this.facilities,
            images              : this.images,
        }
    }

    get(key){
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
            object.admin_id ,
            object.category ,
            object.facilities,
            object.images ,
            )

        return evac
    }

} //EvacuationCenter


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

    constructor(id = null, evac_id = null, current_population = 0, created_by = 0, report_date = new Date, date_created = new Date(), date_updated = new Date()) {
        super()
        this.id = id || "history-" + genID(5)
        this.evac_id = evac_id
        this.current_population = current_population
        this.created_by = created_by
        this.report_date = report_date
        this.date_created = date_created
        this.date_updated = date_updated
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

    static parameters_shown = {
        id: 'id',
        date_created: 'Date Created',
        date_updated: 'Date Updated',
        created_by: 'Created By User',
        max_length: 'Maximum Number of Nectars per Food Source',
        population_size: 'Maximum # of Population',
        trial_limit: 'Trial Limit',
        max_epoch: 'Maximum Generation',
        min_shuffle: 'Minimum Shuffle Value',
        max_shuffle: 'Maximum Shuffle Value',
    }

    constructor(id, date_created, date_updated, created_by, max_length, max_val, population_size, trial_limit, max_epoch, min_shuffle, max_shuffle) {
        super()
        this.id = id || "param-" + genID(5)
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
            objects.max_shuffle
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
            max_shuffle: this.max_shuffle
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
        this.id = id || "evacinv-" + genID(5)
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
        this.id = id || "muninv-" + genID(5)
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

    /** any remarks or descriptions */
    remarks = ""


    constructor(id, date_created, date_updated, created_by, inventory_id, inventory_type, qty, date_supplied, remarks) {
        super()
        this.id = id || "evacsupply-" + genID(5)
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()
        this.created_by = created_by || '0'
        this.inventory_id = inventory_id
        this.inventory_type = inventory_type
        this.qty = qty
        this.date_supplied = date_supplied
        this.remarks    = remarks
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
            objects.remarks
        )
    }

    toObject() {
        return {
            id : this.id,
            date_created : this.date_created,
            date_updated : this.date_updated,
            created_by : this.created_by,
            inventory_id : this.inventory_id,
            inventory_type : this.inventory_type,
            qty : this.qty,
            date_supplied : this.date_supplied,
            remarks: this.remarks
        }
    }
}//EvacuationSupply

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
        this.id = id || "evacsupplytype-" + genID(5)
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
}//EvacuationSupplyType

/** defines the object of Public User */
class PublicUser extends Model {
    
    /** firstname of the public */
    firstname
    
    /** lastname of the public */
    lastname
    
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

    static keys = [
        'id',
        'admin_type',
        'created_by',
        'date_created',
        'date_updated',
        'firstname',
        'lastname',
        'municipality',
        'username',
        'email',
        'password'
    ]

    constructor(id, created_by, date_created, date_updated, firstname, lastname, municipality, username, password, email, birthdate, phone_number, address) {
        super()
        this.id = id || "publicuser-" + genID(5)
        this.created_by = created_by
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()

        this.firstname    = firstname
        this.lastname     = lastname
        this.municipality = municipality
        this.username     = username
        this.password     = password
        this.email        = email
        this.birthdate    = birthdate
        this.phone_number = phone_number
        this.address      = address
    }

    toObject() {
        return {
            id: this.id,
            created_by: this.created_by,
            date_created: this.date_created,
            date_updated: this.date_updated,
            firstname   : this.firstname   ,
            lastname    : this.lastname    ,
            municipality: this.municipality,
            username    : this.username    ,
            password    : this.password    ,
            email       : this.email       ,
            birthdate   : this.birthdate   ,
            phone_number: this.phone_number,
            address     : this.address     ,
        }
    }

    static parse(object = {}) {
        return new PublicUser(
            object.id,
            object.created_by,
            object.date_created,
            object.date_updated,
            object.firstname   ,
            object.lastname    ,
            object.municipality,
            object.username    ,
            object.password    ,
            object.email       ,
            object.birthdate   ,
            object.phone_number,
            object.address     ,
        )
    }
} //PublicUser

/** defines the object of history of each public user */
class PublicUserHistory extends Model {
    
    /** user id of the history */
    userid
    /** evac id of the evacuation center*/
    evac_id
    /** date admitted */
    date_admitted
    /** date where the user has signed out */
    date_cleared
    
    constructor(id, date_created, date_updated, created_by, userid, evac_id, date_admitted, date_cleared ) {
        super()
        this.id            = id || "publicuserhistory-" + genID(5)
        this.date_created  = date_created   || new Date()
        this.date_updated  = date_updated   || new Date()
        this.date_admitted = date_admitted  || new Date()
        this.date_cleared  = date_cleared   || ""
        this.created_by    = created_by || '0'
        this.userid        = userid
        this.evac_id       = evac_id
    }


    toObject() {
        return {
            id           : this.id           ,
            date_created : this.date_created ,
            date_updated : this.date_updated ,
            date_admitted: this.date_admitted,
            date_cleared : this.date_cleared ,
            created_by   : this.created_by   ,
            userid       : this.userid       ,
            evac_id      : this.evac_id      ,
        }
    }

    static parse(object = {}) {
        return new PublicUserHistory(
            object.id,
            object.date_created,
            object.date_updated,
            object.created_by,
            object.userid,
            object.evac_id,
            object.date_admitted,
            object.date_cleared,
        )
    }

}//PublicUserHistory